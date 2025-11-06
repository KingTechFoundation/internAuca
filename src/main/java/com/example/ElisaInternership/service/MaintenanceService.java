package com.example.ElisaInternership.service;

import com.example.ElisaInternership.dto.MaintenanceRequest;
import com.example.ElisaInternership.model.Equipment;
import com.example.ElisaInternership.model.Maintenance;
import com.example.ElisaInternership.model.User;
import com.example.ElisaInternership.repository.EquipmentRepository;
import com.example.ElisaInternership.repository.MaintenanceRepository;
import com.example.ElisaInternership.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class MaintenanceService {
    @Autowired
    private MaintenanceRepository maintenanceRepository;

    @Autowired
    private EquipmentRepository equipmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditService auditService;

    public Maintenance createMaintenanceRequest(MaintenanceRequest request, User currentUser) {
        Equipment equipment = equipmentRepository.findById(request.getEquipmentId())
                .orElseThrow(() -> new RuntimeException("Equipment not found"));

        Maintenance maintenance = new Maintenance();
        maintenance.setEquipment(equipment);
        maintenance.setRequestedBy(currentUser);
        maintenance.setDescription(request.getDescription());
        maintenance.setStatus(Maintenance.MaintenanceStatus.PENDING);

        if (request.getAssignedTechnicianId() != null) {
            User technician = userRepository.findById(request.getAssignedTechnicianId())
                    .orElseThrow(() -> new RuntimeException("Technician not found"));
            maintenance.setAssignedTechnician(technician);
            maintenance.setAssignedDate(LocalDateTime.now());
            maintenance.setStatus(Maintenance.MaintenanceStatus.IN_PROGRESS);
        }

        maintenance.setCost(request.getCost());
        maintenance.setNotes(request.getNotes());

        maintenance = maintenanceRepository.save(maintenance);
        
        // Update equipment status
        equipment.setStatus(Equipment.EquipmentStatus.UNDER_MAINTENANCE);
        equipment.setLastMaintenanceDate(LocalDateTime.now());
        equipmentRepository.save(equipment);

        auditService.logAction("MAINTENANCE_CREATED", "Maintenance", maintenance.getId(), currentUser, 
                "Maintenance request created for equipment: " + equipment.getName());
        return maintenance;
    }

    public Maintenance assignTechnician(Long id, Long technicianId, User currentUser) {
        Maintenance maintenance = maintenanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance request not found"));

        User technician = userRepository.findById(technicianId)
                .orElseThrow(() -> new RuntimeException("Technician not found"));

        maintenance.setAssignedTechnician(technician);
        maintenance.setAssignedDate(LocalDateTime.now());
        maintenance.setStatus(Maintenance.MaintenanceStatus.IN_PROGRESS);

        maintenance = maintenanceRepository.save(maintenance);
        auditService.logAction("MAINTENANCE_ASSIGNED", "Maintenance", maintenance.getId(), currentUser, 
                "Technician assigned to maintenance");
        return maintenance;
    }

    public Maintenance completeMaintenance(Long id, Double cost, String notes, User currentUser) {
        Maintenance maintenance = maintenanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance request not found"));

        maintenance.setStatus(Maintenance.MaintenanceStatus.COMPLETED);
        maintenance.setCompletionDate(LocalDateTime.now());
        if (cost != null) {
            maintenance.setCost(cost);
        }
        if (notes != null) {
            maintenance.setNotes(notes);
        }

        maintenance = maintenanceRepository.save(maintenance);

        // Update equipment status
        Equipment equipment = maintenance.getEquipment();
        equipment.setStatus(Equipment.EquipmentStatus.AVAILABLE);
        equipment.setLastMaintenanceDate(LocalDateTime.now());
        equipmentRepository.save(equipment);

        auditService.logAction("MAINTENANCE_COMPLETED", "Maintenance", maintenance.getId(), currentUser, 
                "Maintenance completed");
        return maintenance;
    }

    public Maintenance updateMaintenance(Long id, MaintenanceRequest request, User currentUser) {
        Maintenance maintenance = maintenanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance request not found"));

        maintenance.setDescription(request.getDescription());
        if (request.getCost() != null) {
            maintenance.setCost(request.getCost());
        }
        if (request.getNotes() != null) {
            maintenance.setNotes(request.getNotes());
        }

        maintenance = maintenanceRepository.save(maintenance);
        auditService.logAction("MAINTENANCE_UPDATED", "Maintenance", maintenance.getId(), currentUser, 
                "Maintenance updated");
        return maintenance;
    }

    public void cancelMaintenance(Long id, User currentUser) {
        Maintenance maintenance = maintenanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance request not found"));

        maintenance.setStatus(Maintenance.MaintenanceStatus.CANCELLED);
        maintenanceRepository.save(maintenance);

        // Update equipment status
        Equipment equipment = maintenance.getEquipment();
        equipment.setStatus(Equipment.EquipmentStatus.AVAILABLE);
        equipmentRepository.save(equipment);

        auditService.logAction("MAINTENANCE_CANCELLED", "Maintenance", maintenance.getId(), currentUser, 
                "Maintenance cancelled");
    }

    public List<Maintenance> getAllMaintenance() {
        return maintenanceRepository.findAll();
    }

    public Maintenance getMaintenanceById(Long id) {
        return maintenanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance request not found"));
    }

    public List<Maintenance> getMaintenanceByEquipment(Long equipmentId) {
        return maintenanceRepository.findByEquipmentId(equipmentId);
    }

    public List<Maintenance> getMaintenanceByStatus(Maintenance.MaintenanceStatus status) {
        return maintenanceRepository.findByStatus(status);
    }

    public List<Maintenance> getMaintenanceByTechnician(Long technicianId) {
        return maintenanceRepository.findByAssignedTechnicianId(technicianId);
    }
}

