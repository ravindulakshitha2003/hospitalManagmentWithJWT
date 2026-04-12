package com.basic.mangment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@AllArgsConstructor
@Data
public class LoginRespondDTO {
    private String token;
    private LocalDateTime LocalTime;
    private String  massage;
    private String error;
}
