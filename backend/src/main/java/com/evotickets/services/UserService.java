package com.evotickets.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.evotickets.entities.UserEntity;
import com.evotickets.repositories.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepo;

    public List<UserEntity> getAllUsers() {
        return userRepo.findAll();
    }

    public UserEntity registerUser(UserEntity user){
        return this.userRepo.save(user);
    }


}
