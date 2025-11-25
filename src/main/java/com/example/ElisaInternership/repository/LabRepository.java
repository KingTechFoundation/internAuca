package com.example.ElisaInternership.repository;

import com.example.ElisaInternership.model.Lab;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabRepository extends JpaRepository<Lab, Long> {
    List<Lab> findByActiveTrue();
    List<Lab> findByLabManagerId(Long labManagerId);
}






