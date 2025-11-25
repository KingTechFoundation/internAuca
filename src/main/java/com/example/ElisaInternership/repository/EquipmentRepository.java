package com.example.ElisaInternership.repository;

import com.example.ElisaInternership.model.Equipment;
import com.example.ElisaInternership.model.Equipment.EquipmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
    List<Equipment> findByLabId(Long labId);
    List<Equipment> findByStatus(EquipmentStatus status);
    List<Equipment> findByLabIdAndStatus(Long labId, EquipmentStatus status);
}






