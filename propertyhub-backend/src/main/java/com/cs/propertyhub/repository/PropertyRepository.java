package com.cs.propertyhub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.cs.propertyhub.entity.Property;

public interface PropertyRepository extends JpaRepository<Property, Long> {

}