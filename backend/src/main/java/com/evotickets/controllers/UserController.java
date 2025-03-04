package com.evotickets.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.evotickets.dtos.UserDTO;
import com.evotickets.services.UserService;



@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    @Autowired
    private UserService userService;


    @GetMapping("/all")
    public ResponseEntity<List<UserDTO>> getAllUser(){
        List<UserDTO> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody UserDTO user) {
        
        return ResponseEntity.status(201).body(userService.registerUser(user));
    }

    @PostMapping("/login")
    public ResponseEntity<UserDTO> login(@RequestBody UserDTO user) {
        
        return ResponseEntity.status(200).body(userService.login(user));
    }
    
    @GetMapping("/logout")
    public String logout(@RequestBody UserDTO user) {
        
        return "Prueba logout";
    }


}
