package com.example.ElisaInternership.service;

import com.example.ElisaInternership.dto.LabRequest;
import com.example.ElisaInternership.model.Lab;
import com.example.ElisaInternership.model.User;
import com.example.ElisaInternership.repository.LabRepository;
import com.example.ElisaInternership.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class LabService {
    @Autowired
    private LabRepository labRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditService auditService;

    public Lab createLab(LabRequest request, User currentUser) {
        Lab lab = new Lab();
        lab.setName(request.getName());
        lab.setLocation(request.getLocation());
        lab.setCapacity(request.getCapacity());
        lab.setType(request.getType());
        lab.setActive(true);

        if (request.getLabManagerId() != null) {
            User labManager = userRepository.findById(request.getLabManagerId())
                    .orElseThrow(() -> new RuntimeException("Lab manager not found"));
            if (labManager.getRole() != User.Role.LAB_MANAGER && labManager.getRole() != User.Role.ADMIN) {
                throw new RuntimeException("User must be a Lab Manager or Admin");
            }
            lab.setLabManager(labManager);
        }

        lab = labRepository.save(lab);
        auditService.logAction("LAB_CREATED", "Lab", lab.getId(), currentUser, 
                "Lab created: " + lab.getName());
        return lab;
    }

    public Lab updateLab(Long id, LabRequest request, User currentUser) {
        Lab lab = labRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lab not found"));

        lab.setName(request.getName());
        lab.setLocation(request.getLocation());
        lab.setCapacity(request.getCapacity());
        lab.setType(request.getType());

        if (request.getLabManagerId() != null) {
            User labManager = userRepository.findById(request.getLabManagerId())
                    .orElseThrow(() -> new RuntimeException("Lab manager not found"));
            if (labManager.getRole() != User.Role.LAB_MANAGER && labManager.getRole() != User.Role.ADMIN) {
                throw new RuntimeException("User must be a Lab Manager or Admin");
            }
            lab.setLabManager(labManager);
        } else {
            lab.setLabManager(null);
        }

        lab = labRepository.save(lab);
        auditService.logAction("LAB_UPDATED", "Lab", lab.getId(), currentUser, 
                "Lab updated: " + lab.getName());
        return lab;
    }

    public void deleteLab(Long id, User currentUser) {
        Lab lab = labRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lab not found"));
        auditService.logAction("LAB_DELETED", "Lab", lab.getId(), currentUser, 
                "Lab deleted: " + lab.getName());
        labRepository.delete(lab);
    }

    public List<Lab> getAllLabs() {
        return labRepository.findAll();
    }

    public List<Lab> getActiveLabs() {
        return labRepository.findByActiveTrue();
    }

    public Lab getLabById(Long id) {
        return labRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lab not found"));
    }

    public List<Lab> getLabsByManager(Long managerId) {
        return labRepository.findByLabManagerId(managerId);
    }
}






