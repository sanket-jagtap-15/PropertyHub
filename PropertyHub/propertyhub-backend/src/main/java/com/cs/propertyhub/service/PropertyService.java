package com.cs.propertyhub.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.cs.propertyhub.entity.Property;
import com.cs.propertyhub.repository.PropertyRepository;

@Service
public class PropertyService {

    private final PropertyRepository repository;

    public PropertyService(PropertyRepository repository) {
        this.repository = repository;
    }

    // Get all properties
    public List<Property> getAllProperties() {
        return repository.findAll();
    }

    // Get property by ID
    public Property getPropertyById(Long id) {
        return repository.findById(id)
            .orElseThrow(() ->
                new RuntimeException("Property not found: " + id)
            );
    }

    // Add property
    public Property addProperty(Property property) {
        return repository.save(property);
    }

    // Update property
    public Property updateProperty(
            Long id, Property updatedProperty) {

        Property existing = getPropertyById(id);

        existing.setTitle(updatedProperty.getTitle());
        existing.setDescription(updatedProperty.getDescription());
        existing.setLocation(updatedProperty.getLocation());
        existing.setPrice(updatedProperty.getPrice());
        existing.setPropertyType(updatedProperty.getPropertyType());
        existing.setBedrooms(updatedProperty.getBedrooms());
        existing.setBathrooms(updatedProperty.getBathrooms());
        existing.setImageUrl(updatedProperty.getImageUrl());

        return repository.save(existing);
    }

    // Delete property
    public void deleteProperty(Long id) {
        Property property = getPropertyById(id);
        repository.delete(property);
    }
}