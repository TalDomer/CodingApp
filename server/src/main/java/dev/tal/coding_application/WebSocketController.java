package dev.tal.coding_application;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Controller
public class WebSocketController {

    @Autowired
    private CodesRepository codeBlockRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private Map<String, Set<String>> activeUsers = new ConcurrentHashMap<>(); //users map
    private Map<String, String> roles = new ConcurrentHashMap<>(); // role map
    private Map<String, String> codeNameToMentor = new ConcurrentHashMap<>(); // Mentor of this current code

    @MessageMapping("/codeblock/{codeName}")
    public void updateCode(@DestinationVariable String codeName, Map<String, String> payload) {
        String currentCode = payload.get("currentCode");

        if (currentCode == null) {
            return;
        }

        Code codeBlock = codeBlockRepository.findCodeBycodeName(codeName)
                .orElseThrow(() -> new RuntimeException("CodeBlock not found"));

        codeBlock.setCurrentCode(currentCode);         //update  the currentCode
        codeBlockRepository.save(codeBlock);

        messagingTemplate.convertAndSend("/topic/codeblock/" + codeName, Map.of(
            "currentCode", currentCode
        ));         //send the updated code to all connected users
    }

    @MessageMapping("/connect/{codeName}")
    public void handleConnect(@DestinationVariable String codeName, Map<String, String> payload) {
        String userId = payload.get("userId");

        if (userId == null) {
            System.err.println("Received null userId");
            return;
        }

        activeUsers.putIfAbsent(codeName, ConcurrentHashMap.newKeySet()); //create user list if it doesn't exist
        Set<String> users = activeUsers.get(codeName);
        users.add(userId);

        String role;
        if (!codeNameToMentor.containsKey(codeName)) { // The first user is the mentor
            codeNameToMentor.put(codeName, userId);
            roles.put(userId, "mentor");
            role = "mentor";
        } else {
            roles.put(userId, "student");
            role = "student";
        }
        sendRoleUpdate(userId, codeName, role);

        updateUserCount(codeName);
    }

    @MessageMapping("/disconnect/{codeName}")
    public void handleDisconnect(@DestinationVariable String codeName, Map<String, String> payload) {
        String userId = payload.get("userId");

        if (userId == null) {
            System.err.println("Received null userId");
            return;
        }

        Set<String> users = activeUsers.get(codeName);
        if (users != null) {
            users.remove(userId);
        }
        if (userId.equals(codeNameToMentor.get(codeName))) { // If the disconnected user was the mentor
            activeUsers.remove(codeName);
            codeNameToMentor.remove(codeName);
            roles.remove(userId);
            sendRedirectToLobbyMessage(codeName); // redirect all users to the lobby
        } else {
            roles.remove(userId);
        }
        updateUserCount(codeName);
    }

    private void updateUserCount(String codeName) {
        int userCount = activeUsers.getOrDefault(codeName, Set.of()).size();
        sendUserCountUpdate(codeName, userCount);
    }

    private void sendUserCountUpdate(String codeBlockName, int count) {
        Map<String, Object> response = Map.of("userCount", count);
        messagingTemplate.convertAndSend("/topic/codeblock/" + codeBlockName, response);
    }

    private void sendRoleUpdate(String userId, String codeBlockName, String role) {
        Map<String, Object> response = Map.of("userId", userId, "role", role);
        System.out.println("Role update: " + response);
        messagingTemplate.convertAndSend("/topic/codeblock/" + codeBlockName, response);
    }

    private void sendRedirectToLobbyMessage(String codeBlockName) {
        Map<String, Object> response = Map.of("mentorDisconnected", true);
        messagingTemplate.convertAndSend("/topic/codeblock/" + codeBlockName, response);
    }
}
