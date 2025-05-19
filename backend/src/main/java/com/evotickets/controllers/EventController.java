package com.evotickets.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.evotickets.dtos.EventDTO;
import com.evotickets.entities.EventEntity;
import com.evotickets.entities.LocationEntity;
import com.evotickets.services.EventService;
import com.evotickets.services.LocationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/events")
public class EventController {
    
    @Autowired
    public EventService eventService;
    @Autowired
    public LocationService locationService;
    
    @GetMapping()
    public ResponseEntity<?> getAllEvents(){
        List<EventDTO> events = eventService.getAllServices();
        return !events.isEmpty() ? ResponseEntity.ok(events)
             : ResponseEntity.status(HttpStatus.NOT_FOUND).body("No hay eventos disponibles");
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEventById(@PathVariable Long id){
        EventDTO event = eventService.getEventDTOById(id);
        return ResponseEntity.ok().body(event);
    }

    @GetMapping("/location")
    public ResponseEntity<?> getEventsByLocation(@RequestParam Long id){
        LocationEntity location = locationService.getLocationById(id);
        List<EventDTO> events = eventService.getEventsByLocation(location);
        return ResponseEntity.ok().body(events);
           
    }

    @PostMapping()
    public ResponseEntity<?> createEvent(@Valid @RequestBody EventDTO event){
        return ResponseEntity.ok().body(eventService.createEvent(event));
    }

    @PutMapping()
    public ResponseEntity<?> modifyEvent(@RequestParam Long id, @Valid @RequestBody EventDTO eventUpdate){
        EventEntity event = eventService.getEventById(id);
        return ResponseEntity.ok().body(eventService.modifyEvent(event, eventUpdate));
    }

    @DeleteMapping()
    public ResponseEntity<?> deleteEvent(@RequestParam Long id){
        eventService.deleteEvent(id);
        return ResponseEntity.ok().body("Evento eliminado correctamente"); 
    }
}
