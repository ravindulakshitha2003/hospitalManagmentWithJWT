package com.basic.mangment.Controller;


import com.basic.mangment.dto.LoginReqestDTO;
import com.basic.mangment.dto.LoginRespondDTO;
import com.basic.mangment.dto.RegisterReqestDTO;
import com.basic.mangment.dto.RegisterRespondDTO;
import com.basic.mangment.service.AuthService;
import com.basic.mangment.service.JWTService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/auth")
public class AuthControler {

    private final JWTService jwtService;
    private final AuthService authService;

    public AuthControler(JWTService jwtService, AuthService authService) {
        this.jwtService = jwtService;
        this.authService = authService;
    }

    @PostMapping ("/login")
    public LoginRespondDTO login(@RequestBody LoginReqestDTO loginReqestDTO) {
            return authService.getToken(loginReqestDTO);
    }


    @PostMapping("/username")
    public String username() {
        return "new data";
    }

    @PostMapping("/register")
    public RegisterRespondDTO register(@RequestBody RegisterReqestDTO registerReqestDTO) {
       return authService.registerUser(registerReqestDTO);
    }


}
