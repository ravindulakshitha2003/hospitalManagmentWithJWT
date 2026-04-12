package com.basic.mangment.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document( collection =  "users")
@NoArgsConstructor
@Data
public class UserEntitiy {
    @Id
    private String id;


    public UserEntitiy( String email, String password, String role, String username) {

        this.email = email;
        this.password = password;
        this.role = role;
        this.username = username;
    }

    private String email;
    private String password;
    private String role;
    @Indexed(unique = true)
    private String username;







}
