package com.evotickets.controllers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.evotickets.dtos.EventDTO;
import com.evotickets.entities.EventEntity;
import com.evotickets.entities.LocationEntity;
import com.evotickets.exceptions.NoSuchEventException;
import com.evotickets.services.EventService;
import com.evotickets.services.LocationService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(EventController.class)
public class EventControllerTests {

    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @MockBean
    private EventService eventService;
    
    @MockBean
    private LocationService locationService;
    
    private LocationEntity location;
    private EventDTO eventDTO;
    private EventEntity eventEntity;
    
    @BeforeEach
    void setUp() {
        // Configuración de LocationEntity usando el builder (asumiendo que LocationEntity tiene builder)
        location = LocationEntity.builder()
                    .name("Central Park")
                    .latitude(40.785091)
                    .longitude(-73.968285)
                    .build();
        
        // Configuración de EventDTO usando @Builder
        eventDTO = EventDTO.builder()
                    .location(location)
                    .name("Music Festival NYC")
                    .description("A grand music festival featuring top artists.")
                    .startDate(LocalDateTime.now().plusDays(1))
                    .endDate(LocalDateTime.now().plusDays(1).plusHours(8))
                    .build();
        
        // Configuración de EventEntity (simulación de entidad persistida)
        eventEntity = EventEntity.builder()
                        .id(1L)
                        .location(location)
                        .name("Music Festival NYC")
                        .description("A grand music festival featuring top artists.")
                        .startDate(eventDTO.getStartDate())
                        .endDate(eventDTO.getEndDate())
                        .build();
    }
    
    // GET /api/v1/events: casos con eventos y sin eventos
    @Test
    void testGetAllEventsWithResults() throws Exception {
        List<EventEntity> events = List.of(eventEntity);
        when(eventService.getAllServices()).thenReturn(new ArrayList<>(events));
        
        mockMvc.perform(get("/api/v1/events"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(eventEntity.getId()))
            .andExpect(jsonPath("$[0].name").value(eventEntity.getName()));
    }
    
    @Test
    void testGetAllEventsNotFound() throws Exception {
        when(eventService.getAllServices()).thenReturn(new ArrayList<>());
        
        mockMvc.perform(get("/api/v1/events"))
            .andExpect(status().isNotFound())
            .andExpect(content().string("No hay eventos disponibles"));
    }
    
    // GET /api/v1/events/{id}: éxito y no encontrado
    @Test
    void testGetEventByIdSuccess() throws Exception {
        when(eventService.getEventById(1L)).thenReturn(eventEntity);
        
        mockMvc.perform(get("/api/v1/events/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(eventEntity.getId()))
            .andExpect(jsonPath("$.name").value(eventEntity.getName()));
    }
    
    @Test
    void testGetEventByIdNotFound() throws Exception {
        when(eventService.getEventById(1L))
             .thenThrow(new NoSuchEventException("No se ha encontrado ningun evento con la ID 1"));
        
        mockMvc.perform(get("/api/v1/events/1"))
            .andExpect(status().isBadRequest());
    }
    
    // GET /api/v1/events/location?id={id}
    @Test
    void testGetEventsByLocationSuccess() throws Exception {
        List<EventEntity> events = List.of(eventEntity);
        when(locationService.getLocationById(1L)).thenReturn(location);
        when(eventService.getEventsByLocation(location)).thenReturn(new ArrayList<>(events));
        
        mockMvc.perform(get("/api/v1/events/location")
                        .param("id", "1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(eventEntity.getId()));
    }
    
    // POST /api/v1/events: creación de evento
    @Test
    void testCreateEventSuccess() throws Exception {
        when(eventService.createEvent(any(EventDTO.class))).thenReturn(eventEntity);
        
        mockMvc.perform(post("/api/v1/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(eventDTO)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(eventEntity.getId()));
    }
    
    // PUT /api/v1/events?id={id}: modificación de evento
    @Test
    void testModifyEventSuccess() throws Exception {
        // Creamos un DTO modificado con el builder
        EventDTO updateDTO = EventDTO.builder()
                                .location(location)
                                .name("Updated Event Name")
                                .description("Updated Description")
                                .startDate(eventDTO.getStartDate())
                                .endDate(eventDTO.getEndDate())
                                .build();
        
        EventEntity updatedEntity = EventEntity.builder()
                                    .id(eventEntity.getId())
                                    .location(location)
                                    .name(updateDTO.getName())
                                    .description(updateDTO.getDescription())
                                    .startDate(updateDTO.getStartDate())
                                    .endDate(updateDTO.getEndDate())
                                    .build();
        
        when(eventService.getEventById(1L)).thenReturn(eventEntity);
        when(eventService.modifyEvent(eq(eventEntity), any(EventDTO.class))).thenReturn(updatedEntity);
        
        mockMvc.perform(put("/api/v1/events")
                        .param("id", "1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDTO)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Updated Event Name"));
    }
    
    // DELETE /api/v1/events?id={id}: eliminación de evento
    @Test
    void testDeleteEventSuccess() throws Exception {
        doNothing().when(eventService).deleteEvent(1L);
        
        mockMvc.perform(delete("/api/v1/events")
                        .param("id", "1"))
            .andExpect(status().isOk())
            .andExpect(content().string("Evento eliminado correctamente"));
    }
    
    @Test
    void testDeleteEventNotFound() throws Exception {
        // Para métodos void debemos usar doThrow
        doThrow(new NoSuchEventException("No se ha encontrado ningun evento que eliminar con la ID 1"))
                .when(eventService).deleteEvent(1L);
        
        mockMvc.perform(delete("/api/v1/events")
                        .param("id", "1"))
            .andExpect(status().isBadRequest());
    }
}