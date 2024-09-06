package dev.tal.coding_application;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin (origins = "*") //because front is on 3000, back on 8081 (port)
@RequestMapping ("/api/codeblocks")
public class CodeController {

    @Autowired
    private CodeService codeService;
    
    @GetMapping
    public ResponseEntity<List<Code>> getAllCodes(){
        return new ResponseEntity<List<Code>>(codeService.getCodes(), HttpStatus.OK);
    }

    @GetMapping("/{codeName}")
    public ResponseEntity<Code> getSingleCodeBlock(@PathVariable String codeName){
        Code code = codeService.getSingleCodeBlock(codeName);
        if (code != null) {
            return new ResponseEntity <Code>(code, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{codeName}")
    public ResponseEntity<Code> updateCodeBlock(@PathVariable String codeName, @RequestBody Code updatedCode) {
        Code code = codeService.updateCodeBlock(codeName, updatedCode);
        if (code != null) {
            return new ResponseEntity<>(code, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

}

