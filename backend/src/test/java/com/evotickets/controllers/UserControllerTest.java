package com.evotickets.controllers;

import com.evotickets.dtos.UserUpdateDTO;
import com.evotickets.entities.UserEntity;
import com.evotickets.services.UserService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    private UserEntity testUser;

    @BeforeEach
    void setUp() {
        testUser = UserEntity.builder()
                .id(1L)
                .firstName("Original")
                .lastName("User")
                .email("test@test.com")
                .build();
    }

    @Test
    public void UserController_UpdateUser_ValidDTO_ReturnsUpdatedUser() {
        UserUpdateDTO updateDTO = new UserUpdateDTO();
        updateDTO.setFirstName("Nuevo");
        updateDTO.setLastName("Apellido");
        updateDTO.setDateOfBirth(LocalDate.of(1990, 3, 15));
        updateDTO.setNotificationsEnabled(false);

        UserEntity updatedUser = UserEntity.builder()
                .id(1L)
                .firstName("Nuevo")
                .lastName("Apellido")
                .email("test@test.com")
                .dateOfBirth(LocalDate.of(1990, 3, 15))
                .notificationsEnabled(false)
                .build();

        when(userService.updateUserProfile(1L, updateDTO)).thenReturn(updatedUser);

        ResponseEntity<UserEntity> response = userController.updateUser(1L, updateDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Nuevo", response.getBody().getFirstName());
        assertEquals("Apellido", response.getBody().getLastName());
        assertEquals(false, response.getBody().isNotificationsEnabled());
        verify(userService).updateUserProfile(1L, updateDTO);
    }

}
