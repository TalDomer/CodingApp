package dev.tal.coding_application;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CodeService {

    @Autowired
    private CodesRepository codesRepository;

    public List<Code> getCodes(){
        return codesRepository.findAll();
    }

    public Code getSingleCodeBlock(String codeName){
        Optional<Code> codeFound =  codesRepository.findCodeBycodeName(codeName);
        if(codeFound.isPresent()){
            return codeFound.get();
        }
        return null;
    }

    public Code updateCodeBlock(String codeName, Code updatedCode) {
        Optional<Code> existingCode = codesRepository.findCodeBycodeName(codeName);
        if (existingCode.isPresent()) {
            Code codeToUpdate = existingCode.get();
            codeToUpdate.setCurrentCode(updatedCode.getCurrentCode());
            return codesRepository.save(codeToUpdate);
        }
        return null;
    }

}
