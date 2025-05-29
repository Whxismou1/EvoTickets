package com.evotickets.controllers;

import com.evotickets.dtos.ContactDTO;
import com.evotickets.dtos.WorkWithUsDTO;
import com.evotickets.services.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ContactControllerTest {

    @Mock
    private EmailService emailService;

    @InjectMocks
    private ContactController contactController;

    private ContactDTO contactDTO;
    private WorkWithUsDTO workWithUsDTO;
    private MultipartFile mockFile;

    @BeforeEach
    void setUp() {
        contactDTO = new ContactDTO();
        contactDTO.setName("Cristian");
        contactDTO.setEmail("cristian@example.com");
        contactDTO.setSubject("Consulta");
        contactDTO.setMessage("Hola, quiero más información.");

        workWithUsDTO = new WorkWithUsDTO();
        workWithUsDTO.setName("Postulante");
        workWithUsDTO.setEmail("postulante@example.com");
        workWithUsDTO.setPhone("123456789");
        workWithUsDTO.setMessage("Quiero trabajar con ustedes.");

        mockFile = new MockMultipartFile("resume", "cv.pdf", "application/pdf", "Contenido del CV".getBytes());
    }

    @Test
    public void sendContactEmail_ValidInput_ReturnsSuccess() {
        doNothing().when(emailService).sendContactEmail(anyString(), anyString(), anyString(), anyString());

        ResponseEntity<String> response = contactController.sendContactEmail(contactDTO);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Mensaje enviado correctamente.", response.getBody());
        verify(emailService).sendContactEmail(
            contactDTO.getName(),
            contactDTO.getEmail(),
            contactDTO.getSubject(),
            contactDTO.getMessage()
        );
    }

    @Test
    public void handleWorkApplication_ValidInput_ReturnsSuccess() {
        doNothing().when(emailService).sendWorkWithUsEmail(anyString(), anyString(), anyString(), anyString(), any(MultipartFile.class));

        ResponseEntity<String> response = contactController.handleWorkApplication(workWithUsDTO, mockFile);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Solicitud enviada correctamente.", response.getBody());
        verify(emailService).sendWorkWithUsEmail(
            workWithUsDTO.getName(),
            workWithUsDTO.getEmail(),
            workWithUsDTO.getPhone(),
            workWithUsDTO.getMessage(),
            mockFile
        );
    }
}
