package com.basic.mangment.service;

import com.basic.mangment.entity.UserEntitiy;
import com.basic.mangment.repository.UserRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


public class MyUserDetailsProvider  implements UserDetailsService  {


    private  final UserRepository userRepository;

    public MyUserDetailsProvider( UserRepository userRepository) {

        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {


        UserEntitiy userdata = userRepository.findByUsername(username).orElse(null);
        System.out.println(userdata.getUsername());
        if (userdata == null) {
            System.out.println("user not found");
        }

        UserDetails user = User.builder()
                .username(userdata.getUsername())
                .password(userdata.getPassword())
                .build();

        return user;
    }
}
