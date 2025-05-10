package com.evotickets.controllers;

import static org.mockito.BDDMockito.given;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
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
import com.evotickets.services.EventService;
import com.evotickets.services.LocationService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import com.evotickets.config.JwtAuthenticationFilter;

@ExtendWith(SpringExtension.class)
@WebMvcTest(controllers = EventController.class, excludeFilters = {
    @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, value = JwtAuthenticationFilter.class)
})
@AutoConfigureMockMvc(addFilters=false)
public class EventControllerTests {

    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @MockitoBean
    private EventService eventService;
    
    @MockitoBean
    private LocationService locationService;
    
    private LocationEntity locationEntity;
    private EventDTO eventDTO;
    
    @BeforeEach
    public void setUp(){
        locationEntity = LocationEntity.builder()
                .name("Test Location")
                .latitude(10.0)
                .longitude(20.0)
                .build();
        
        eventDTO = EventDTO.builder()
                .name("Test Event")
                .location(locationEntity)
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusDays(1))
                .description("Test Description")
                .build();
    }
    
    // Test para el POST /api/v1/events 
    @Test
    public void EventController_CreateEvent_ReturnCreated() throws Exception{
        given(eventService.createEvent(any(EventDTO.class)))
                .willReturn(
                    EventEntity.builder()
                        .id(1L)
                        .name(eventDTO.getName())
                        .location(eventDTO.getLocation())
                        .startDate(eventDTO.getStartDate())
                        .endDate(eventDTO.getEndDate())
                        .description(eventDTO.getDescription())
                        .build()
                );
        
        ResultActions result = mockMvc.perform(post("/api/v1/events")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(eventDTO)));
                    
        result.andExpect(status().isOk());
    }
    
    // Test para el GET /api/v1/events cuando existen eventos
    @Test
    public void EventController_GetAllEvents_ReturnsEvents() throws Exception{
        List<EventEntity> events = new ArrayList<>();
        events.add(
            EventEntity.builder()
                .id(1L)
                .name("Event 1")
                .location(locationEntity)
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusDays(1))
                .description("Desc 1")
                .build()
        );
        given(eventService.getAllServices()).willReturn(new ArrayList<>(events));
        
        mockMvc.perform(get("/api/v1/events"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$[0].id").value(1L));
    }
    
    // Test para el GET /api/v1/events cuando no hay eventos
    @Test
    public void EventController_GetAllEvents_NoResults() throws Exception{
        given(eventService.getAllServices()).willReturn(new ArrayList<>());
        
        mockMvc.perform(get("/api/v1/events"))
               .andExpect(status().isNotFound())
               .andExpect(content().string("No hay eventos disponibles"));
    }
    
    // Test para el GET /api/v1/events/{id}
    @Test
    public void EventController_GetEventById_ReturnsEvent() throws Exception{
        EventEntity eventEntity = EventEntity.builder()
                                    .id(2L)
                                    .name("Event 2")
                                    .location(locationEntity)
                                    .startDate(LocalDateTime.now())
                                    .endDate(LocalDateTime.now().plusDays(1))
                                    .description("Desc 2")
                                    .build();
        given(eventService.getEventById(2L)).willReturn(eventEntity);
        
        mockMvc.perform(get("/api/v1/events/2"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.id").value(2L))
               .andExpect(jsonPath("$.name").value("Event 2"));
    }
    
    // Test para el GET /api/v1/events/location?id={id}
    @Test
    public void EventController_GetEventsByLocation_ReturnsEvents() throws Exception{
        List<EventEntity> events = new ArrayList<>();
        events.add(
            EventEntity.builder()
                .id(3L)
                .name("Event 3")
                .location(locationEntity)
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusDays(1))
                .description("Desc 3")
                .build()
        );
        given(locationService.getLocationById(100L)).willReturn(locationEntity);
        given(eventService.getEventsByLocation(locationEntity)).willReturn(new ArrayList<>(events));
        
        mockMvc.perform(get("/api/v1/events/location")
                    .param("id", "100"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$[0].id").value(3L));
    }
    
    // Test para el PUT /api/v1/events?id={id}
    @Test
    public void EventController_ModifyEvent_ReturnsModifiedEvent() throws Exception{
        // Evento actual
        EventEntity existingEvent = EventEntity.builder()
                                    .id(1L)
                                    .name("Test Event")
                                    .location(locationEntity)
                                    .startDate(eventDTO.getStartDate())
                                    .endDate(eventDTO.getEndDate())
                                    .description("Test Description")
                                    .build();
        // DTO para actualización
        EventDTO updateDTO = EventDTO.builder()
                                .name("Updated Event")
                                .location(locationEntity)
                                .startDate(eventDTO.getStartDate())
                                .endDate(eventDTO.getEndDate())
                                .description("Updated Description")
                                .build();
        // Evento modificado
        EventEntity modifiedEvent = EventEntity.builder()
                                        .id(1L)
                                        .name(updateDTO.getName())
                                        .location(updateDTO.getLocation())
                                        .startDate(updateDTO.getStartDate())
                                        .endDate(updateDTO.getEndDate())
                                        .description(updateDTO.getDescription())
                                        .build();
        
        given(eventService.getEventById(1L)).willReturn(existingEvent);
        given(eventService.modifyEvent(eq(existingEvent), any(EventDTO.class)))
            .willReturn(modifiedEvent);
        
        mockMvc.perform(put("/api/v1/events")
                    .param("id", "1")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(updateDTO)))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.name").value("Updated Event"))
               .andExpect(jsonPath("$.description").value("Updated Description"));
    }

    // Test para el DELETE /api/v1/events?id={id}
    @Test
    public void EventController_DeleteEvent_ReturnsConfirmation() throws Exception{
        // Suponemos que el delete no devuelve nada; usamos doNothing para simularlo.
        doNothing().when(eventService).deleteEvent(1L);
        
        mockMvc.perform(delete("/api/v1/events")
                    .param("id", "1"))
               .andExpect(status().isOk())
               .andExpect(content().string("Evento eliminado correctamente"));
    }
}