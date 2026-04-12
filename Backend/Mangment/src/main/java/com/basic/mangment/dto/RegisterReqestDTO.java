package com.basic.mangment.dto;


import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class RegisterReqestDTO {

    private String username;
    private String password;
    private String email;
    private String mobile;
    private String role;

}
