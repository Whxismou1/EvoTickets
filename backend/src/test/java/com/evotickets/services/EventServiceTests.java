package com.evotickets.services;

import com.evotickets.dtos.EventDTO;
import com.evotickets.entities.EventEntity;
import com.evotickets.entities.LocationEntity;
import com.evotickets.exceptions.InvalidInputException;
import com.evotickets.exceptions.NoSuchEventException;
import com.evotickets.repositories.EventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
public class EventServiceTests {
    @Mock
    private EventRepository eventRepository;
    
    @InjectMocks
    private EventService eventService;
    
    private LocationEntity locationEntity;
    private EventDTO eventDTO;
    private EventEntity eventEntity;
    
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
        
        eventEntity = EventEntity.builder()
                .id(1L)
                .name(eventDTO.getName())
                .location(eventDTO.getLocation())
                .startDate(eventDTO.getStartDate())
                .endDate(eventDTO.getEndDate())
                .description(eventDTO.getDescription())
                .build();
    }

    @Test
    public void testGetAllServices_ReturnsList(){
        List<EventEntity> events = new ArrayList<>();
        events.add(eventEntity);
        when(eventRepository.findAll()).thenReturn(events);
        
        List<EventEntity> result = eventService.getAllServices();
        assertEquals(1, result.size());
        assertEquals(eventEntity, result.get(0));
    }
    
    // Test para getEventById: cuando el evento existe
    @Test
    public void testGetEventById_EventExists(){
        when(eventRepository.findById(1L)).thenReturn(Optional.of(eventEntity));
        EventEntity result = eventService.getEventById(1L);
        assertEquals(eventEntity, result);
    }
    
    // Test para getEventById: cuando el evento no existe
    @Test
    public void testGetEventById_EventNotFound(){
        when(eventRepository.findById(1L)).thenReturn(Optional.empty());
        NoSuchEventException ex = assertThrows(NoSuchEventException.class, () -> {
            eventService.getEventById(1L);
        });
        assertTrue(ex.getMessage().contains("No se ha encontrado ningun evento con la ID"));
    }

    @Test
    public void testGetEventsByLocation_ReturnsList(){
        ArrayList<EventEntity> events = new ArrayList<>();
        events.add(eventEntity);
        when(eventRepository.findByLocation(locationEntity)).thenReturn(events);
        List<EventEntity> result = eventService.getEventsByLocation(locationEntity);
        assertEquals(1, result.size());
    }
    
    // Test para getEventsByLocation: cuando no se encuentran eventos
    @Test
    public void testGetEventsByLocation_NoEventsFound(){
        when(eventRepository.findByLocation(locationEntity)).thenReturn(new ArrayList<>());
        NoSuchEventException ex = assertThrows(NoSuchEventException.class, () -> {
            eventService.getEventsByLocation(locationEntity);
        });
        assertTrue(ex.getMessage().contains(locationEntity.getName()));
    }
    
    // Test para createEvent: creación exitosa de un evento
    @Test
    public void testCreateEvent_Success(){
        // Se asume que no existe ningún evento con el nombre dado
        when(eventRepository.findByName(eventDTO.getName())).thenReturn(null);
        when(eventRepository.saveAndFlush(any(EventEntity.class))).thenReturn(eventEntity);
        
        EventEntity result = eventService.createEvent(eventDTO);
        assertNotNull(result);
        assertEquals(eventEntity.getId(), result.getId());
    }
    
    // Test para createEvent: cuando ya existe un evento con el mismo nombre
    @Test
    public void testCreateEvent_EventAlreadyExists(){
        when(eventRepository.findByName(eventDTO.getName())).thenReturn(eventEntity);
        InvalidInputException ex = assertThrows(InvalidInputException.class, () -> {
            eventService.createEvent(eventDTO);
        });
        assertTrue(ex.getMessage().contains("Ya existe un evento con el nombre"));
    }
    
    // Test para modifyEvent: modificación exitosa del evento
    @Test
    public void testModifyEvent_Success(){
        // DTO de actualización
        EventDTO updateDTO = EventDTO.builder()
                .name("Updated Event")
                .location(locationEntity)
                .startDate(eventDTO.getStartDate())
                .endDate(eventDTO.getEndDate())
                .description("Updated Description")
                .build();
        // Se asume que no existe otro evento con el nuevo nombre (o es el mismo)
        when(eventRepository.findByName(updateDTO.getName())).thenReturn(null);
        when(eventRepository.saveAndFlush(any(EventEntity.class)))
                .thenReturn(
                    EventEntity.builder()
                        .id(1L)
                        .name(updateDTO.getName())
                        .location(updateDTO.getLocation())
                        .startDate(updateDTO.getStartDate())
                        .endDate(updateDTO.getEndDate())
                        .description(updateDTO.getDescription())
                        .build()
                );
        
        EventEntity result = eventService.modifyEvent(eventEntity, updateDTO);
        assertEquals("Updated Event", result.getName());
        assertEquals("Updated Description", result.getDescription());
    }

    // Test para modifyEvent: conflicto en el nombre
    @Test
    public void testModifyEvent_NameConflict(){
        // Si se intenta cambiar el nombre y ya existe otro evento con ese nombre
        EventDTO updateDTO = EventDTO.builder()
                .name("Conflict Event")
                .location(locationEntity)
                .startDate(eventDTO.getStartDate())
                .endDate(eventDTO.getEndDate())
                .description("Updated Description")
                .build();
        when(eventRepository.findByName(updateDTO.getName())).thenReturn(new EventEntity());
        
        InvalidInputException ex = assertThrows(InvalidInputException.class, () -> {
            eventService.modifyEvent(eventEntity, updateDTO);
        });
        assertTrue(ex.getMessage().contains("Ya existe un evento con el nombre"));
    }
    
    // Test para modifyEvent: fechas inválidas (fecha de inicio posterior a la fecha de fin)
    @Test
    public void testModifyEvent_InvalidDates(){
        EventDTO updateDTO = EventDTO.builder()
                .name("Updated Event")
                .location(locationEntity)
                .startDate(LocalDateTime.now().plusDays(2))
                .endDate(LocalDateTime.now())
                .description("Updated Description")
                .build();
        InvalidInputException ex = assertThrows(InvalidInputException.class, () -> {
            eventService.modifyEvent(eventEntity, updateDTO);
        });
        assertTrue(ex.getMessage().contains("La fecha de inicio no puede ser posterior a la fecha de fin"));
    }
    
    // Test para deleteEvent: eliminación exitosa
    @Test
    public void testDeleteEvent_Success(){
        when(eventRepository.findById(1L)).thenReturn(Optional.of(eventEntity));
        assertDoesNotThrow(() -> {
            eventService.deleteEvent(1L);
        });
        verify(eventRepository, times(1)).deleteById(1L);
    }
    
    // Test para deleteEvent: si el evento no existe
    @Test
    public void testDeleteEvent_EventNotFound(){
        when(eventRepository.findById(1L)).thenReturn(Optional.empty());
        NoSuchEventException ex = assertThrows(NoSuchEventException.class, () -> {
            eventService.deleteEvent(1L);
        });
        assertTrue(ex.getMessage().contains("No se ha encontrado ningun evento que eliminar con la ID"));
    }
}
