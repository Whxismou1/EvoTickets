package com.evotickets.services;

import com.evotickets.dtos.UserUpdateDTO;
import com.evotickets.entities.UserEntity;
import com.evotickets.exceptions.CustomException;
import com.evotickets.exceptions.InvalidCredentialsException;
import com.evotickets.exceptions.UserNotFoundException;
import com.evotickets.repositories.UserRepository;
import com.evotickets.utils.ImageUploader;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class UserServiceTests {

    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepo;

    @Mock
    private ImageUploader imageUploader;

    @Mock
    private PasswordEncoder passwordEncoder;

    private UserEntity user;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        user = UserEntity.builder()
                .id(1L)
                .email("test@user.com")
                .password("encodedPass")
                .firstName("Test")
                .lastName("User")
                .dateOfBirth(LocalDate.of(2000, 1, 1))
                .build();
    }

    @Test
    public void getUserByID_ValidId_ReturnsUser() {
        when(userRepo.findById(1L)).thenReturn(Optional.of(user));

        UserEntity result = userService.getUserByID(1L);

        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo("test@user.com");
    }

    @Test
    public void getUserByID_InvalidId_ThrowsException() {
        when(userRepo.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getUserByID(99L))
                .isInstanceOf(UserNotFoundException.class);
    }

    @Test
    public void uploadProfilePicture_ValidFile_UpdatesUserPicture() throws Exception {
        MultipartFile mockFile = mock(MultipartFile.class);
        when(mockFile.isEmpty()).thenReturn(false);
        when(userRepo.findById(1L)).thenReturn(Optional.of(user));
        when(imageUploader.uploadImage(mockFile)).thenReturn("http://image.com/pic.jpg");

        String url = userService.uploadProfilePicture(1L, mockFile);

        assertThat(url).isEqualTo("http://image.com/pic.jpg");
        verify(userRepo).save(user);
    }

    @Test
    public void uploadProfilePicture_EmptyFile_ThrowsCustomException() {
        MultipartFile emptyFile = mock(MultipartFile.class);
        when(emptyFile.isEmpty()).thenReturn(true);

        assertThatThrownBy(() -> userService.uploadProfilePicture(1L, emptyFile))
                .isInstanceOf(CustomException.class);
    }

    @Test
    public void updateUserProfile_ValidChanges_SavesUser() {
        when(userRepo.findById(1L)).thenReturn(Optional.of(user));
        when(userRepo.save(any(UserEntity.class))).thenReturn(user); 

        UserUpdateDTO dto = new UserUpdateDTO();
        dto.setFirstName("Updated");
        dto.setLastName("Name");
        dto.setPhone("123456");
        dto.setLocation("New City");
        dto.setNotificationsEnabled(true);
        dto.setDateOfBirth(LocalDate.of(1999, 5, 5));

        UserEntity updated = userService.updateUserProfile(1L, dto);

        assertThat(updated.getFirstName()).isEqualTo("Updated");
        assertThat(updated.getLocation()).isEqualTo("New City");
        verify(userRepo).save(user);
    }

    @Test
    public void deleteUserById_ValidId_DeletesUser() {
        when(userRepo.findById(1L)).thenReturn(Optional.of(user));

        userService.deleteUserById(1L);

        verify(userRepo).delete(user);
    }

    @Test
    public void deleteUserById_NotFound_ThrowsException() {
        when(userRepo.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.deleteUserById(99L))
                .isInstanceOf(UserNotFoundException.class);
    }

    @Test
    public void changePassword_ValidPassword_ChangesIt() {
        when(userRepo.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("oldPass", user.getPassword())).thenReturn(true);
        when(passwordEncoder.encode("newPass")).thenReturn("encodedNew");

        userService.changePassword(1L, "oldPass", "newPass");

        verify(userRepo).save(user);
        assertThat(user.getPassword()).isEqualTo("encodedNew");
    }

    @Test
    public void changePassword_InvalidPassword_ThrowsException() {
        when(userRepo.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongPass", user.getPassword())).thenReturn(false);

        assertThatThrownBy(() -> userService.changePassword(1L, "wrongPass", "newPass"))
                .isInstanceOf(InvalidCredentialsException.class);
    }
}
