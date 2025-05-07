package com.evotickets.services;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.evotickets.dtos.EventDTO;
import com.evotickets.entities.EventEntity;
import com.evotickets.entities.LocationEntity;
import com.evotickets.exceptions.InvalidInputException;
import com.evotickets.exceptions.NoSuchEventException;
import com.evotickets.repositories.EventRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EventService {
    
    @Autowired
    public EventRepository eventRepository;
    

    public ArrayList<EventEntity> getAllServices(){
        return (ArrayList<EventEntity>) eventRepository.findAll();
    }

    public EventEntity getEventById(Long id) throws NoSuchEventException{
        var optionalEvent = eventRepository.findById(id);
        if(optionalEvent.isEmpty()) throw new NoSuchEventException("No se ha encontrado ningun evento con la ID "+ id);
        return optionalEvent.get();
    }

    public ArrayList<EventEntity> getEventsByLocation(LocationEntity location) throws NoSuchEventException{
        ArrayList<EventEntity> events = eventRepository.findByLocation(location);
        if(events.isEmpty()) throw new NoSuchEventException("No se ha encontrado ningun evento con en "+ location.getName());
        return events;
    }

    public EventEntity createEvent(EventDTO event){
        if(eventRepository.findByName(event.getName()) != null) throw new InvalidInputException("Ya existe un evento con el nombre " + event.getName());
        EventEntity eventEntity = EventEntity.builder()
        .location(event.getLocation())
        .name(event.getName())
        .startDate(event.getStartDate())
        .endDate(event.getEndDate())
        .description(event.getDescription())
        .build();
        return eventRepository.saveAndFlush(eventEntity);
        
    }

    public EventEntity modifyEvent(EventEntity event, EventDTO eventUpdate) throws NoSuchEventException{
        
        if(!event.getName().equals(eventUpdate.getName()) && eventRepository.findByName(eventUpdate.getName()) != null ) throw new InvalidInputException("Ya existe un evento con el nombre " + eventUpdate.getName());
        if(eventUpdate.getStartDate().isAfter(eventUpdate.getEndDate())) throw new InvalidInputException("La fecha de inicio no puede ser posterior a la fecha de fin");
        if(eventUpdate.getName() != null) {
            event.setName(eventUpdate.getName());
        }
        if(eventUpdate.getDescription() != null) {
            event.setDescription(eventUpdate.getDescription());
        }
        if(eventUpdate.getLocation() != null) {
            event.setLocation(eventUpdate.getLocation());
        }
        if(eventUpdate.getStartDate() != null) {
            event.setStartDate(eventUpdate.getStartDate());
        }
        if(eventUpdate.getEndDate() != null) {
            event.setEndDate(eventUpdate.getEndDate());
        }
        return eventRepository.saveAndFlush(event);
    }

    public void deleteEvent(Long id) throws NoSuchEventException{
        var eventOptional = eventRepository.findById(id);
        if(eventOptional.isEmpty()) throw new NoSuchEventException("No se ha encontrado ningun evento que eliminar con la ID " +id);
        eventRepository.deleteById(id);
    }
}
