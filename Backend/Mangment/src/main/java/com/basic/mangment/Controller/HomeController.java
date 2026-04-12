package com.basic.mangment.Controller;


import com.basic.mangment.entity.UserEntitiy;
import com.basic.mangment.repository.UserRepository;
import com.basic.mangment.service.AuthService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/data")
public class HomeController {

    private final UserRepository userRepository;

    public HomeController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    @GetMapping("/all")
    public List<UserEntitiy> allUsers() {
        return userRepository.findAll();
    }
}
