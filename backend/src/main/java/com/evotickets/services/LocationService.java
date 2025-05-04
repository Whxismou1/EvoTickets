package com.evotickets.services;

import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.evotickets.entities.LocationEntity;
import com.evotickets.repositories.LocationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LocationService {
    
    @Autowired
    private LocationRepository locationRepository;

    public LocationEntity getLocationById(Long id) throws NoSuchElementException{
        return locationRepository.findById(id).get();
    }
}
