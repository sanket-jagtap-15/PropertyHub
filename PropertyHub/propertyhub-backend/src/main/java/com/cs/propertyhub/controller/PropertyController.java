
package com.cs.propertyhub.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.cs.propertyhub.entity.Property;
import com.cs.propertyhub.service.PropertyService;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://propertyhubsj.netlify.app"
})
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @GetMapping
    public List<Property> getAllProperties() {
        return propertyService.getAllProperties();
    }

    @GetMapping("/{id}")
    public Property getPropertyById(@PathVariable("id") Long id) {
        return propertyService.getPropertyById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Property addProperty(@RequestBody Property property) {
        return propertyService.addProperty(property);
    }

    @PutMapping("/{id}")
    public Property updateProperty(
            @PathVariable("id") Long id,
            @RequestBody Property property) {
        return propertyService.updateProperty(id, property);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProperty(@PathVariable("id") Long id) {
        propertyService.deleteProperty(id);
    }
}
