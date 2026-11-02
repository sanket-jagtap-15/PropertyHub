
package com.cs.propertyhub.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cs.propertyhub.entity.Enquiry;
import com.cs.propertyhub.repository.EnquiryRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/enquiries")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://propertyhubsj.netlify.app"
})
public class EnquiryController {

    private final EnquiryRepository enquiryRepository;

    public EnquiryController(EnquiryRepository enquiryRepository) {
        this.enquiryRepository = enquiryRepository;
    }

    // Save customer enquiry
    @PostMapping
    public ResponseEntity<Enquiry> saveEnquiry(
            @Valid @RequestBody Enquiry enquiry) {

        Enquiry savedEnquiry = enquiryRepository.save(enquiry);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedEnquiry);
    }

    // Get all customer enquiries
    @GetMapping
    public ResponseEntity<List<Enquiry>> getAllEnquiries() {

        List<Enquiry> enquiries = enquiryRepository.findAll();

        return ResponseEntity.ok(enquiries);
    }

@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteEnquiry(@PathVariable("id") Long id) {

    if (!enquiryRepository.existsById(id)) {
        return ResponseEntity.notFound().build();
    }

    enquiryRepository.deleteById(id);

    return ResponseEntity.noContent().build();
}

}
