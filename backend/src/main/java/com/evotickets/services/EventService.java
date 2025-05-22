package com.evotickets.services;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.evotickets.dtos.ArtistDTO;
import com.evotickets.dtos.EventDTO;
import com.evotickets.dtos.FaqsDTO;
import com.evotickets.dtos.UserDTO;
import com.evotickets.entities.EventEntity;
import com.evotickets.entities.LocationEntity;
import com.evotickets.exceptions.InvalidInputException;
import com.evotickets.exceptions.NoSuchEventException;
import com.evotickets.repositories.ArtistEventRepository;
import com.evotickets.repositories.EventRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EventService {
    
    
    public final EventRepository eventRepository;
    
    public final ArtistEventRepository artistEventRepository;
    

    public List<EventDTO> getAllServices(){
        List<EventEntity> events = eventRepository.findAll();
        return events.stream()
                .map(this::convertToDto)
            .collect(Collectors.toList());
    }
    
    public EventDTO getEventDTOById(Long id) throws NoSuchEventException{
        var optionalEvent = eventRepository.findById(id);
        if(optionalEvent.isEmpty()) 
            throw new NoSuchEventException("No se ha encontrado ningún evento con la ID " + id);
        return convertToDto(optionalEvent.get());
    }

    public EventEntity getEventById(Long id) throws NoSuchEventException{
        var optionalEvent = eventRepository.findById(id);
        if(optionalEvent.isEmpty()) 
            throw new NoSuchEventException("No se ha encontrado ningún evento con la ID " + id);
        return optionalEvent.get();
    }

    public List<EventDTO> getEventsByLocation(LocationEntity location) throws NoSuchEventException{
        List<EventEntity> events = eventRepository.findByLocation(location);
        if(events.isEmpty()) 
            throw new NoSuchEventException("No se ha encontrado ningún evento en " + location.getName());
        return events.stream()
                     .map(this::convertToDto)
                     .collect(Collectors.toList());
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

    private EventDTO convertToDto(EventEntity event) {
        
        List<ArtistDTO> artistDTOs = artistEventRepository.findByEvent(event)
            .stream()
            .map(artistEvent -> ArtistDTO.fromEntity(artistEvent.getArtist(), artistEvent.getShowsUpAt()))
            .collect(Collectors.toList());

        List<EventDTO> relatedEventsDto = event.getRelatedEventRelations() != null 
            ? event.getRelatedEventRelations().stream()
                .map(er -> convertToDto(er.getRelatedEvent()))
                .collect(Collectors.toList())
            : new ArrayList<>();

        System.out.println(event);
        return EventDTO.builder()
        .id(event.getId())
        .name(event.getName())
        .description(event.getDescription())
        .location(event.getLocation())
        .startDate(event.getStartDate())
        .endDate(event.getEndDate())
        .coverImage(event.getCoverImage())
        .category(event.getCategory())
        .photos(event.getPhotos())
        .minAge(event.getMinAge())
        .capacity(event.getCapacity())
        .website(event.getWebsite())
        .longDescription(event.getLongDescription())
        .faqs(FaqsDTO.buildFaqsDTOList(event.getFaqs()))
        .artists(artistDTOs)
        .relatedEvents(relatedEventsDto)
        .organizer(event.getOrganizer() != null 
            ? event.getOrganizer().getFirstName() + " " + event.getOrganizer().getLastName()
            : null)
        .build();
    }
}
