package com.basic.mangment.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class RegisterRespondDTO {

    private String username;

    private String password;
    private String email;
    private String mobile;
    private String role;
    private String massage;
    private String error;

    public RegisterRespondDTO(String username, String password, String email, String role, String massage, String error) {
        this.username = username;
        this.password = password;
        this.email = email;

        this.role = role;
        this.massage = massage;
        this.error = error;
    }
}
