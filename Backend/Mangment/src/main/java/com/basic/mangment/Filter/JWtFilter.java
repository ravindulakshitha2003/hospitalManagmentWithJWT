package com.basic.mangment.Filter;

import com.basic.mangment.entity.UserEntitiy;
import com.basic.mangment.repository.UserRepository;
import com.basic.mangment.service.JWTService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
@Component
public class JWtFilter extends OncePerRequestFilter {
     private  final JWTService jwtService;
     private final UserRepository userRepository;

    public JWtFilter(JWTService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authorization = request.getHeader("Authorization");
        System.out.println(authorization);
        if(authorization ==null || !authorization.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        String token = authorization.split(" ")[1];
        String username = jwtService.getUsernameFromToken(token);

        if (username == null) {
            filterChain.doFilter(request,response);
            return;
        }

        if(SecurityContextHolder.getContext().getAuthentication() != null){
            filterChain.doFilter(request,response);
            return;
        }

        UserEntitiy userDTO  = userRepository.findByUsername(username).orElse(null);
        if (userDTO == null) {
            filterChain.doFilter(request,response);
            return;
        }



        if(SecurityContextHolder.getContext().getAuthentication() != null) {
            filterChain.doFilter(request, response);
            return;
        }
        UserDetails user = User.builder()
                .username(userDTO.getUsername())
                .password(userDTO.getPassword())
                .build();

        UsernamePasswordAuthenticationToken newtoken = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());

        newtoken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

        SecurityContextHolder.getContext().setAuthentication(newtoken);
        filterChain.doFilter(request, response);
    }
}
