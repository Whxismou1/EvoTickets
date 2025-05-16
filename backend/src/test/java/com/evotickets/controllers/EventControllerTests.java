package com.evotickets.controllers;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.evotickets.dtos.EventDTO;
import com.evotickets.entities.EventEntity;
import com.evotickets.entities.LocationEntity;
import com.evotickets.services.EventService;
import com.evotickets.services.LocationService;

@ExtendWith(MockitoExtension.class)
public class EventControllerTests {

    @Mock
    private EventService eventService;

    @Mock
    private LocationService locationService;

    @InjectMocks
    private EventController eventController;

    private EventEntity eventEntity;
    private EventDTO eventDTO;
    private LocationEntity location;

    @BeforeEach
    void setUp() {
        location = LocationEntity.builder()
                .id(1L)
                .name("Test Location")
                .latitude(10.0)
                .longitude(20.0)
                .build();
        eventEntity = EventEntity.builder()
                .id(1L)
                .name("Test Event")
                .description("Test Description")
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusHours(2))
                .location(location)
                .build();
        eventDTO = EventDTO.builder()
                .location(location)
                .name("Test Event")
                .description("Test Description")
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusHours(2))
                .build();
    }

    @Test
    public void testGetAllEvents_NonEmptyList() {
        ArrayList<EventDTO> events = new ArrayList<>(Arrays.asList(eventDTO));
        when(eventService.getAllServices()).thenReturn(events);

        ResponseEntity<?> response = eventController.getAllEvents();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(events, response.getBody());

        verify(eventService).getAllServices();
    }

    @Test
    public void testGetAllEvents_EmptyList() {
        ArrayList<EventDTO> events = new ArrayList<>();
        when(eventService.getAllServices()).thenReturn(events);

        ResponseEntity<?> response = eventController.getAllEvents();
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("No hay eventos disponibles", response.getBody());

        verify(eventService).getAllServices();
    }

    @Test
    public void testGetEventById() {
        when(eventService.getEventById(1L)).thenReturn(eventEntity);

        ResponseEntity<?> response = eventController.getEventById(1L);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(eventEntity, response.getBody());

        verify(eventService).getEventById(1L);
    }

    @Test
    public void testGetEventsByLocation() {
        when(locationService.getLocationById(1L)).thenReturn(location);
        ArrayList<EventDTO> events = new ArrayList<>(Arrays.asList(eventDTO));
        when(eventService.getEventsByLocation(location)).thenReturn(events);

        ResponseEntity<?> response = eventController.getEventsByLocation(1L);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(events, response.getBody());

        verify(locationService).getLocationById(1L);
        verify(eventService).getEventsByLocation(location);
    }

    @Test
    public void testCreateEvent() {
        when(eventService.createEvent(any(EventDTO.class))).thenReturn(eventEntity);

        ResponseEntity<?> response = eventController.createEvent(eventDTO);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(eventEntity, response.getBody());

        verify(eventService).createEvent(eventDTO);
    }

    @Test
    public void testModifyEvent() {
        when(eventService.getEventById(1L)).thenReturn(eventEntity);
        when(eventService.modifyEvent(eventEntity, eventDTO)).thenReturn(eventEntity);

        ResponseEntity<?> response = eventController.modifyEvent(1L, eventDTO);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(eventEntity, response.getBody());

        verify(eventService).getEventById(1L);
        verify(eventService).modifyEvent(eventEntity, eventDTO);
    }

    @Test
    public void testDeleteEvent() {
        doNothing().when(eventService).deleteEvent(1L);

        ResponseEntity<?> response = eventController.deleteEvent(1L);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Evento eliminado correctamente", response.getBody());

        verify(eventService).deleteEvent(1L);
    }
}