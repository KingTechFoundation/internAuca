package com.example.ElisaInternership.service;

import com.example.ElisaInternership.dto.EquipmentRequest;
import com.example.ElisaInternership.model.Equipment;
import com.example.ElisaInternership.model.Lab;
import com.example.ElisaInternership.model.User;
import com.example.ElisaInternership.repository.EquipmentRepository;
import com.example.ElisaInternership.repository.LabRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EquipmentService {
    @Autowired
    private EquipmentRepository equipmentRepository;

    @Autowired
    private LabRepository labRepository;

    @Autowired
    private AuditService auditService;

    public Equipment createEquipment(EquipmentRequest request, User currentUser) {
        Lab lab = labRepository.findById(request.getLabId())
                .orElseThrow(() -> new RuntimeException("Lab not found"));

        Equipment equipment = new Equipment();
        equipment.setName(request.getName());
        equipment.setDescription(request.getDescription());
        equipment.setSerialNumber(request.getSerialNumber());
        equipment.setLab(lab);
        equipment.setStatus(request.getStatus() != null ? request.getStatus() : Equipment.EquipmentStatus.AVAILABLE);

        equipment = equipmentRepository.save(equipment);
        auditService.logAction("EQUIPMENT_CREATED", "Equipment", equipment.getId(), currentUser, 
                "Equipment created: " + equipment.getName());
        return equipment;
    }

    public Equipment updateEquipment(Long id, EquipmentRequest request, User currentUser) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));

        equipment.setName(request.getName());
        equipment.setDescription(request.getDescription());
        equipment.setSerialNumber(request.getSerialNumber());

        if (request.getLabId() != null) {
            Lab lab = labRepository.findById(request.getLabId())
                    .orElseThrow(() -> new RuntimeException("Lab not found"));
            equipment.setLab(lab);
        }

        if (request.getStatus() != null) {
            equipment.setStatus(request.getStatus());
        }

        equipment = equipmentRepository.save(equipment);
        auditService.logAction("EQUIPMENT_UPDATED", "Equipment", equipment.getId(), currentUser, 
                "Equipment updated: " + equipment.getName());
        return equipment;
    }

    public void deleteEquipment(Long id, User currentUser) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));
        auditService.logAction("EQUIPMENT_DELETED", "Equipment", equipment.getId(), currentUser, 
                "Equipment deleted: " + equipment.getName());
        equipmentRepository.delete(equipment);
    }

    public List<Equipment> getAllEquipment() {
        return equipmentRepository.findAll();
    }

    public Equipment getEquipmentById(Long id) {
        return equipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));
    }

    public List<Equipment> getEquipmentByLab(Long labId) {
        return equipmentRepository.findByLabId(labId);
    }

    public List<Equipment> getEquipmentByStatus(Equipment.EquipmentStatus status) {
        return equipmentRepository.findByStatus(status);
    }
}

