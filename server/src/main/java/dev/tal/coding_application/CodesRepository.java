package dev.tal.coding_application;

import java.util.*;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CodesRepository extends MongoRepository<Code, ObjectId>{
    Optional<Code> findCodeBycodeName(String codeName);
}
