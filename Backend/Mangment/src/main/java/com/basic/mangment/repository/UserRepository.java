package com.basic.mangment.repository;

import com.basic.mangment.entity.UserEntitiy;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<UserEntitiy, String> {
 Optional<UserEntitiy> findByUsername(String username);
}
