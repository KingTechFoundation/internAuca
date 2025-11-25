package com.example.ElisaInternership.repository;

import com.example.ElisaInternership.model.Maintenance;
import com.example.ElisaInternership.model.Maintenance.MaintenanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {
    List<Maintenance> findByEquipmentId(Long equipmentId);
    List<Maintenance> findByStatus(MaintenanceStatus status);
    List<Maintenance> findByAssignedTechnicianId(Long technicianId);
    List<Maintenance> findByRequestedById(Long userId);
}






