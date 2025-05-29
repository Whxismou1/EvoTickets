package com.evotickets.controllers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.evotickets.dtos.EventDTO;
import com.evotickets.entities.EventEntity;
import com.evotickets.entities.LocationEntity;
import com.evotickets.services.EventService;
import com.evotickets.services.LocationService;

@ExtendWith(MockitoExtension.class)
public class EventControllerTest {

    @Mock
    private EventService eventService;

    @Mock
    private LocationService locationService;

    @InjectMocks
    private EventController eventController;

    private EventDTO eventDTO;
    private EventEntity eventEntity;

    @BeforeEach
    void setUp() {
        eventDTO = EventDTO.builder()
                .name("Evento de prueba")
                .description("Descripción de prueba")
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusHours(2))
                .capacity(100)
                .minAge(18)
                .build();
        eventEntity = EventEntity.builder()
                .name("Evento de prueba")
                .description("Descripción de prueba")
                .startDate(eventDTO.getStartDate())
                .endDate(eventDTO.getEndDate())
                .capacity(100)
                .minAge(18)
                .build();
    }

    @Test
    public void getAllEvents_WhenEventsExist_ReturnsOk() {
        when(eventService.getAllServices()).thenReturn(List.of(eventDTO));

        ResponseEntity<?> response = eventController.getAllEvents();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(List.of(eventDTO), response.getBody());
    }

    @Test
    public void getAllEvents_WhenNoEvents_ReturnsNotFound() {
        when(eventService.getAllServices()).thenReturn(List.of());

        ResponseEntity<?> response = eventController.getAllEvents();

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("No hay eventos disponibles", response.getBody());
    }

    @Test
    public void getEventById_ValidId_ReturnsEvent() {
        when(eventService.getEventDTOById(1L)).thenReturn(eventDTO);

        ResponseEntity<?> response = eventController.getEventById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(eventDTO, response.getBody());
    }

    @Test
    public void getEventsByLocation_ValidId_ReturnsEvents() {
        LocationEntity location = new LocationEntity();
        when(locationService.getLocationById(1L)).thenReturn(location);
        when(eventService.getEventsByLocation(location)).thenReturn(List.of(eventDTO));

        ResponseEntity<?> response = eventController.getEventsByLocation(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(List.of(eventDTO), response.getBody());
    }

    @Test
    public void createEvent_ValidEvent_ReturnsCreatedEvent() {
        when(eventService.createEvent(any(EventDTO.class))).thenReturn(eventEntity);

        ResponseEntity<?> response = eventController.createEvent(eventDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(eventEntity, response.getBody());
    }

    @Test
    public void modifyEvent_ValidId_ReturnsModifiedEvent() {
        when(eventService.getEventById(1L)).thenReturn(eventEntity);
        when(eventService.modifyEvent(any(EventEntity.class), any(EventDTO.class)))
                .thenReturn(eventEntity);

        ResponseEntity<?> response = eventController.modifyEvent(1L, eventDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(eventEntity, response.getBody());
    }

    @Test
    public void deleteEvent_ValidId_ReturnsSuccessMessage() {
        doNothing().when(eventService).deleteEvent(1L);

        ResponseEntity<?> response = eventController.deleteEvent(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Evento eliminado correctamente", response.getBody());
    }

    @Test
    public void getAllInfo_ValidOrganizerId_ReturnsEvents() {
        when(eventService.getAllInfo(99L)).thenReturn(List.of(eventDTO));

        ResponseEntity<?> response = eventController.getAllInfo(99L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(List.of(eventDTO), response.getBody());
    }
}
