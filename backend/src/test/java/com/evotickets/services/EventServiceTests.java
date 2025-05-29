package com.evotickets.services;

import com.evotickets.dtos.EventDTO;
import com.evotickets.entities.*;
import com.evotickets.entities.enums.EventCategory;
import com.evotickets.exceptions.InvalidInputException;
import com.evotickets.exceptions.NoSuchEventException;
import com.evotickets.repositories.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class EventServiceTests {

    @InjectMocks
    private EventService eventService;

    @Mock
    private EventRepository eventRepository;
    @Mock
    private EventHighlightsRepository eventHighlightsRepository;
    @Mock
    private EventPhotosRepository eventPhotosRepository;
    @Mock
    private LocationRepository locationRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private FaqsRepository faqsRepository;
    @Mock
    private ArtistEventRepository artistEventRepository;
    @Mock
    private ArtistsRepository artistRepository;

    private EventEntity eventEntity;
    private EventDTO eventDTO;
    private UserEntity organizer;
    private LocationEntity location;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        organizer = UserEntity.builder()
                .id(41L)
                .firstName("Org")
                .lastName("User")
                .build();

        location = LocationEntity.builder()
                .id(1L)
                .name("Main Stage")
                .latitude(0.0)
                .longitude(0.0)
                .build();

        eventEntity = EventEntity.builder()
                .id(1L)
                .name("Test Event")
                .description("Desc")
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusHours(2))
                .category(EventCategory.CONCERT)
                .location(location)
                .organizer(organizer)
                .capacity(100)
                .minAge(18)
                .photos(new ArrayList<>())
                .faqs(new ArrayList<>())
                .highlights(new ArrayList<>())
                .relatedEventRelations(new ArrayList<>())
                .artistEvents(new ArrayList<>())
                .build();

        eventDTO = EventDTO.builder()
                .name("Test Event")
                .description("Desc")
                .startDate(eventEntity.getStartDate())
                .endDate(eventEntity.getEndDate())
                .category(EventCategory.CONCERT)
                .locationName("Main Stage")
                .capacity(100)
                .minAge(18)
                .build();
    }

    @Test
    public void getEventDTOById_ExistingId_ReturnsDTO() {
        when(eventRepository.findById(1L)).thenReturn(Optional.of(eventEntity));
        when(artistEventRepository.findByEvent(eventEntity)).thenReturn(List.of());

        EventDTO result = eventService.getEventDTOById(1L);

        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Test Event");
    }

    @Test
    public void getEventDTOById_NotFound_ThrowsException() {
        when(eventRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> eventService.getEventDTOById(99L))
                .isInstanceOf(NoSuchEventException.class);
    }

    @Test
    public void createEvent_ValidInput_SavesAndReturnsEntity() {
        when(eventRepository.findByName("Test Event")).thenReturn(null);
        when(locationRepository.findByName("Main Stage")).thenReturn(location);
        when(userRepository.findById(41L)).thenReturn(Optional.of(organizer));
        when(eventRepository.saveAndFlush(any())).thenReturn(eventEntity);

        EventEntity saved = eventService.createEvent(eventDTO);

        assertThat(saved).isNotNull();
        assertThat(saved.getName()).isEqualTo("Test Event");
    }

    @Test
    public void createEvent_DuplicateName_ThrowsInvalidInputException() {
        when(eventRepository.findByName("Test Event")).thenReturn(eventEntity);

        assertThatThrownBy(() -> eventService.createEvent(eventDTO))
                .isInstanceOf(InvalidInputException.class)
                .hasMessageContaining("Ya existe un evento con el nombre");
    }

    @Test
    public void modifyEvent_ValidChanges_SavesUpdatedEntity() {
        EventDTO update = EventDTO.builder()
                .name("Updated Event")
                .description("New Desc")
                .startDate(eventEntity.getStartDate())
                .endDate(eventEntity.getEndDate().plusHours(1))
                .build();

        when(eventRepository.findByName("Updated Event")).thenReturn(null);
        when(eventRepository.saveAndFlush(any())).thenReturn(eventEntity);

        EventEntity result = eventService.modifyEvent(eventEntity, update);

        assertThat(result.getDescription()).isEqualTo("New Desc");
        verify(eventRepository).saveAndFlush(eventEntity);
    }

    @Test
    public void deleteEvent_ValidId_DeletesSuccessfully() {
        when(eventRepository.findById(1L)).thenReturn(Optional.of(eventEntity));

        eventService.deleteEvent(1L);

        verify(eventRepository).deleteById(1L);
    }

    @Test
    public void deleteEvent_NotFound_ThrowsException() {
        when(eventRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> eventService.deleteEvent(999L))
                .isInstanceOf(NoSuchEventException.class);
    }

    @Test
    void getAllServices_ReturnsEventDTOList() {
        when(eventRepository.findAll()).thenReturn(List.of(eventEntity));
        when(artistEventRepository.findByEvent(any())).thenReturn(List.of());

        List<EventDTO> result = eventService.getAllServices();

        assertThat(result).isNotEmpty();
        assertThat(result.get(0).getName()).isEqualTo("Test Event");
    }

    @Test
    void getAllServicesLimited_WithLimit_ReturnsLimitedList() {
        when(eventRepository.findLimited(any())).thenReturn(List.of(eventEntity));
        when(artistEventRepository.findByEvent(any())).thenReturn(List.of());

        List<EventDTO> result = eventService.getAllServicesLimited(1);

        assertThat(result).hasSize(1);
    }

    @Test
    void getEventById_ValidId_ReturnsEvent() {
        when(eventRepository.findById(1L)).thenReturn(Optional.of(eventEntity));

        EventEntity result = eventService.getEventById(1L);

        assertThat(result).isEqualTo(eventEntity);
    }

    @Test
    void getEventById_NotFound_ThrowsException() {
        when(eventRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> eventService.getEventById(99L))
                .isInstanceOf(NoSuchEventException.class);
    }

    @Test
    void getEventsByLocation_NoEventsFound_ThrowsException() {
        when(eventRepository.findByLocation(location)).thenReturn(new ArrayList<>());

        assertThatThrownBy(() -> eventService.getEventsByLocation(location))
                .isInstanceOf(NoSuchEventException.class);
    }

    @Test
    void getAllInfo_WithValidOrganizerId_ReturnsEventDTOList() {
        when(eventRepository.findAllByOrganizerId(41L)).thenReturn(List.of(eventEntity));
        when(artistEventRepository.findByEvent(eventEntity)).thenReturn(List.of());

        List<EventDTO> result = eventService.getAllInfo(41L);

        assertThat(result).isNotEmpty();
        assertThat(result.get(0).getName()).isEqualTo("Test Event");
    }

}
