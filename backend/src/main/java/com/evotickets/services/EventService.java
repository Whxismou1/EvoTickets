package com.evotickets.services;

import java.util.ArrayList;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.evotickets.dtos.EventDTO;
import com.evotickets.entities.EventEntity;
import com.evotickets.entities.LocationEntity;
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

    public EventEntity getEventById(Long id) throws NoSuchElementException{
        var optionalEvent = eventRepository.findById(id);
        if(optionalEvent.isEmpty()) throw new NoSuchElementException("No se ha encontrado ningun evento con la ID "+ id);
        return optionalEvent.get();
    }

    public ArrayList<EventEntity> getEventsByLocation(LocationEntity location){
        ArrayList<EventEntity> events = eventRepository.findByLocation(location);
        if(events.isEmpty()) throw new NoSuchElementException("No se ha encontrado ningun evento con en "+ location.getName());
        return events;
    }

    public EventEntity createEvent(EventDTO event){
        return EventEntity.builder()
            .location(event.getLocation())
            .name(event.getName())
            .startDate(event.getStartDate())
            .endDate(event.getEndDate())
            .description(event.getDescription())
            .build();
    }

    public EventEntity modifyEvent(EventEntity eventUpdate){
        var eventOptional = eventRepository.findById(eventUpdate.getId());
        if(eventOptional.isEmpty()) throw new NoSuchElementException("No se ha encontrado ningun evento que modificar con la ID " +eventUpdate.getId());
        EventEntity event = eventOptional.get();
        event.setDescription(eventUpdate.getDescription());
        event.setEndDate(eventUpdate.getEndDate());
        event.setLocation(eventUpdate.getLocation());
        event.setName(eventUpdate.getName());
        event.setStartDate(eventUpdate.getStartDate());
        return event;
    }

    public void deleteEvent(Long id){
        var eventOptional = eventRepository.findById(id);
        if(eventOptional.isEmpty()) throw new NoSuchElementException("No se ha encontrado ningun evento que eliminar con la ID " +id);
        eventRepository.deleteById(id);
    }
}
