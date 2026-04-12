package com.basic.mangment.service;

import com.basic.mangment.dto.LoginReqestDTO;
import com.basic.mangment.dto.LoginRespondDTO;
import com.basic.mangment.dto.RegisterReqestDTO;
import com.basic.mangment.dto.RegisterRespondDTO;
import com.basic.mangment.entity.UserEntitiy;
import com.basic.mangment.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private  final JWTService jwtService;
    private  final AuthenticationManager authenticationManager;
    private  final UserRepository userRepository;
    private  final PasswordEncoder passwordEncoder;

    public AuthService(JWTService jwtService, AuthenticationManager authenticationManager, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginRespondDTO getToken( LoginReqestDTO loginReqestDTO) {
        if(!isExists(loginReqestDTO.getUsername())) { new LoginRespondDTO(null, LocalDateTime.now(),"User Not found","error");}

        try {
            authenticationManager.authenticate( new UsernamePasswordAuthenticationToken(loginReqestDTO.getUsername(),loginReqestDTO.getPassword()));
        }catch (Exception e){
            return new LoginRespondDTO(null, null,null,"erroe");
        }
        Map<String,Object> claims = new HashMap<String,Object>();
        claims.put("role","");
        claims.put("emmail","user@gmail.com");


        String token = jwtService.generateToken(loginReqestDTO.getUsername(), claims);
        return new LoginRespondDTO(token, LocalDateTime.now(), "Login Success", null);


    }


    public RegisterRespondDTO  registerUser(RegisterReqestDTO registerReqestDTO) {
        Boolean alreadyExcits = isExists(registerReqestDTO.getUsername());

        if(alreadyExcits) {

            return  new RegisterRespondDTO(null, null,null,null,null,"User already exits");
        }

        UserEntitiy user = new  UserEntitiy( registerReqestDTO.getEmail(), passwordEncoder.encode(registerReqestDTO.getPassword()), registerReqestDTO.getRole(),registerReqestDTO.getUsername());
        userRepository.save(user);
        return new RegisterRespondDTO(registerReqestDTO.getUsername(), registerReqestDTO.getPassword(), registerReqestDTO.getEmail(), registerReqestDTO.getRole(), "User successfully registered", null);

    }


    Boolean isExists(String username) {
        return userRepository.findByUsername(username).isPresent();
    }



}
