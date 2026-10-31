package com.cs.propertyhub.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.cs.propertyhub.entity.*;
import com.cs.propertyhub.service.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = "http://localhost:5173")
public class PropertyController {

    private final PropertyService service;

    public PropertyController(PropertyService service) {
        this.service = service;
    }

    // GET all properties
    @GetMapping
    public List<Property> getAllProperties() {
        return service.getAllProperties();
    }

    // GET property by ID
    @GetMapping("/{id}")
    public Property getPropertyById(@PathVariable("id") Long id) {
        return service.getPropertyById(id);
    }

    // POST add property
    @PostMapping
    public Property addProperty(
            @Valid @RequestBody Property property) {
        return service.addProperty(property);
    }

    // PUT update property
    @PutMapping("/{id}")
    public Property updateProperty(
            @PathVariable("id") Long id,
            @RequestBody Property property) {

        return service.updateProperty(id, property);
    }

    // DELETE property
    @DeleteMapping("/{id}")
    public String deleteProperty(
            @PathVariable("id") Long id) {

        service.deleteProperty(id);

        return "Property deleted successfully!";
    }
}