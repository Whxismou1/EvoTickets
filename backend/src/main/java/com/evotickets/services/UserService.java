package com.evotickets.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.evotickets.dtos.UserDTO;
import com.evotickets.entities.UserEntity;
import com.evotickets.mappers.UserMapper;
import com.evotickets.repositories.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private UserMapper mapper;

    @Autowired
    private BCryptPasswordEncoder passEncoder;

    public List<UserDTO> getAllUsers() {
        return userRepo.findAll().stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    public UserDTO registerUser(UserDTO user) {
        UserEntity userEntity = mapper.toEntity(user);

        userEntity.setPassword(passEncoder.encode(user.getPassword()));

        System.out.println(userEntity.toString());
        return mapper.toDTO(userRepo.save(userEntity));
    }

    public UserDTO login(UserDTO user) {
        Optional<UserEntity> optionalUser = userRepo.findByEmail(user.getEmail());

        if (optionalUser.isEmpty()) {
            throw new RuntimeException("Wrong credentials. (user)");
        }

        UserEntity userOnDB = optionalUser.get();

        if (!passEncoder.matches(user.getPassword(), userOnDB.getPassword())) {
            throw new RuntimeException("Wrong credentials!");
        }

        return mapper.toDTO(userOnDB);
    }

}
