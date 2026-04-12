package com.basic.mangment.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Map;

@Service
public class JWTService {
    private  final SecretKey secretKey;



    public JWTService() {
        try {
            SecretKey k = KeyGenerator.getInstance("HmacSHA256").generateKey();
            this.secretKey = Keys.hmacShaKeyFor(k.getEncoded());;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }

    public String generateToken(String username, Map<String,Object> claims) {
        return Jwts.builder()
                .claims(claims)
                .subject(username)

                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 3600 * 1000))
                .signWith(secretKey)
                .compact();
    }

    public Claims getTokenData(String token){
        try {
            return Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        }catch (Exception e){
            return null;
        }
    }

    public String getUsernameFromToken(String token) {
        Claims data = getTokenData(token);
        if(data==null) return null;
        return data.getSubject();

    }

}
