package dev.tal.coding_application;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Document(collection = "codes")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Code {

    @Id
    private ObjectId id;
    
    private String codeName;

    private String initCode; //will be the same every time.

    private String currentCode;
    
    private String solutionCode;

}
