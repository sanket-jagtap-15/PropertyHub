
package com.cs.propertyhub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cs.propertyhub.entity.Enquiry;

@Repository
public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {

}
