package com.evotickets.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.evotickets.dtos.EventPhotosDTO;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.evotickets.dtos.ArtistDTO;
import com.evotickets.dtos.EventDTO;
import com.evotickets.dtos.FaqsDTO;
import com.evotickets.entities.ArtistEntity;
import com.evotickets.entities.ArtistEventEntity;
import com.evotickets.entities.EventEntity;
import com.evotickets.entities.EventHighlightsEntity;
import com.evotickets.entities.EventPhotosEntity;
import com.evotickets.entities.FaqsEntity;
import com.evotickets.entities.LocationEntity;
import com.evotickets.entities.ids.ArtistEventId;
import com.evotickets.exceptions.InvalidInputException;
import com.evotickets.exceptions.NoSuchEventException;
import com.evotickets.repositories.ArtistEventRepository;
import com.evotickets.repositories.ArtistsRepository;
import com.evotickets.repositories.EventHighlightsRepository;
import com.evotickets.repositories.EventPhotosRepository;
import com.evotickets.repositories.EventRepository;
import com.evotickets.repositories.FaqsRepository;
import com.evotickets.repositories.LocationRepository;
import com.evotickets.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EventService {
    
    public final EventHighlightsRepository eventHighlightsRepository;

    public final EventPhotosRepository eventPhotosRepository;

    public final EventRepository eventRepository;

    public final LocationRepository locationRepository;

    public final UserRepository userRepository;

    public final FaqsRepository faqsRepository;
    
    public final ArtistEventRepository artistEventRepository;

    public final ArtistsRepository artistRepository;
    

    public List<EventDTO> getAllServices(){
        List<EventEntity> events = eventRepository.findAll();
        return events.stream()
                .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    public List<EventDTO> getAllServicesLimited(int limit){
        Pageable pageable = PageRequest.of(0, limit);

        List<EventEntity> events = eventRepository.findLimited(pageable);
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
        if(event.getLocationName() == null) throw new InvalidInputException("La ubicación del evento no puede ser nula");
        LocationEntity location = locationRepository.findByName(event.getLocationName());
        if(location == null){
            location = LocationEntity.builder()
                .name(event.getLocationName())
                .latitude(0.0)
                .longitude(0.0)
                .build();
            location = locationRepository.saveAndFlush(location);
        }
        

        List<EventPhotosEntity> photos = event.getPhotos() != null
            ? event.getPhotos().stream()
                .map(photo -> EventPhotosEntity.builder()
                    .url(photo.getUrl())
                    .event(null)
                    .build())
                .collect(Collectors.toList())
            : new ArrayList<>();
        
        List<FaqsEntity> faqs = event.getFaqs() != null
            ? event.getFaqs().stream()
                .map(faq -> FaqsEntity.builder()
                    .question(faq.getQuestion())
                    .answer(faq.getAnswer())
                    .event(null) 
                    .build())
                .collect(Collectors.toList())
            : new ArrayList<>();

        List<EventHighlightsEntity> highlights = event.getHighlights() != null
            ? event.getHighlights().stream()
                .map(highlight -> EventHighlightsEntity.builder()
                    .highlight(highlight.getHighlight())
                    .event(null)
                    .build())
                .collect(Collectors.toList())
            : new ArrayList<>();
        

        EventEntity eventEntity = EventEntity.builder()
            .description(event.getDescription())
            .endDate(event.getEndDate())
            .startDate(event.getStartDate())
            .name(event.getName())
            .location(location)
            .coverImage(event.getCoverImage())
            .category(event.getCategory())
            .organizer(userRepository.findById((long) 41).get()) //TODO: coger la id del token del usuario logueado
            .capacity(event.getCapacity())
            .minAge(event.getMinAge())
            .website(event.getWebsite())
            .longDescription(event.getLongDescription())
            .build();

        eventEntity = eventRepository.saveAndFlush(eventEntity);
        for (EventPhotosEntity photo : photos) {
            photo.setEvent(eventEntity);
        }
        if(!photos.isEmpty()){
            eventPhotosRepository.saveAll(photos);
            eventEntity.setPhotos(photos);
        }
        for (FaqsEntity faq : faqs) {
            faq.setEvent(eventEntity);
        }
        if(!faqs.isEmpty()){
            faqsRepository.saveAll(faqs);
            eventEntity.setFaqs(faqs);
        }

        for (EventHighlightsEntity highlight : highlights) {
            highlight.setEvent(eventEntity);
        }

        if(!highlights.isEmpty()){
            eventHighlightsRepository.saveAll(highlights);
            eventEntity.setHighlights(highlights);

        }

        if(event.getArtists() != null && !event.getArtists().isEmpty()){
            System.out.println("Linea 175");
            final EventEntity finalEventEntity = eventEntity;
            event.getArtists().forEach(artistDTO -> {
                if(artistDTO.getId() != null){
                    System.out.println("Linea 177");
                    Optional<ArtistEntity> optArtist = artistRepository.findById(artistDTO.getId());
                    if(optArtist.isPresent()){
                        System.out.println("Linea 178");
                        ArtistEntity artistEntity = optArtist.get();
                        ArtistEventId compositeKey = new ArtistEventId();
                        compositeKey.setArtistId(artistEntity.getArtistId());
                        System.out.println("Linea 182");
                        compositeKey.setEventId(finalEventEntity.getId());
                        System.out.println("Linea 184");
                        ArtistEventEntity artistEvent = ArtistEventEntity.builder()
                            .id(compositeKey)
                            .artist(artistEntity)
                            .event(finalEventEntity)
                            .role(artistDTO.getRole())
                            .build();
                            artistEventRepository.saveAndFlush(artistEvent);
                    }
                }
            });
        }

  

        return eventEntity;
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
    // Mapear información básica del evento...
    
    // En lugar de convertir recursivamente todos los eventos relacionados,
    // devolvemos una lista simple con id y nombre para evitar recursión infinita.
    List<EventDTO> relatedEventsDto = event.getRelatedEventRelations() != null 
        ? event.getRelatedEventRelations().stream()
            .map(er -> EventDTO.builder()
                .id(er.getRelatedEvent().getId())
                .name(er.getRelatedEvent().getName())
                .build())
            .collect(Collectors.toList())
        : new ArrayList<>();

    return EventDTO.builder()
        .id(event.getId())
        .name(event.getName())
        .description(event.getDescription())
        .location(event.getLocation())
        .startDate(event.getStartDate())
        .endDate(event.getEndDate())
        .coverImage(event.getCoverImage())
        .category(event.getCategory())
        .photos( event.getPhotos() != null 
            ? event.getPhotos().stream()
                .map(photo -> EventPhotosDTO.builder()
                    .url(photo.getUrl())
                    .build())
                .collect(Collectors.toList())
            : new ArrayList<>())
        .minAge(event.getMinAge())
        .capacity(event.getCapacity())
        .website(event.getWebsite())
        .longDescription(event.getLongDescription())
        .faqs(FaqsDTO.buildFaqsDTOList(event.getFaqs()))
        .artists(artistEventRepository.findByEvent(event)
                .stream()
                .map(artistEvent -> ArtistDTO.fromEntity(artistEvent.getArtist(), artistEvent.getShowsUpAt()))
                .collect(Collectors.toList()))
        .relatedEvents(relatedEventsDto)
        .organizer(event.getOrganizer() != null 
            ? event.getOrganizer().getFirstName() + " " + event.getOrganizer().getLastName()
            : null)
        .build();

    }

    public List<EventDTO> getAllInfo(Long organizerId) {
        List<EventEntity> events = eventRepository.findByOrganizerId(organizerId);
        return events.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
    }

}


