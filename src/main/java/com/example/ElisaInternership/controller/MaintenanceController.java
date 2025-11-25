package com.example.ElisaInternership.controller;

import com.example.ElisaInternership.dto.ApiResponse;
import com.example.ElisaInternership.dto.MaintenanceRequest;
import com.example.ElisaInternership.model.Maintenance;
import com.example.ElisaInternership.service.MaintenanceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MaintenanceController {
    @Autowired
    private MaintenanceService maintenanceService;

    @PostMapping("/lab-manager/maintenance")
    public ResponseEntity<ApiResponse<Maintenance>> createMaintenanceRequest(
            @Valid @RequestBody MaintenanceRequest request,
            Authentication authentication) {
        try {
            com.example.ElisaInternership.model.User currentUser = 
                    (com.example.ElisaInternership.model.User) authentication.getPrincipal();
            Maintenance maintenance = maintenanceService.createMaintenanceRequest(request, currentUser);
            return ResponseEntity.ok(ApiResponse.success("Maintenance request created successfully", maintenance));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/lab-manager/maintenance/{id}/assign")
    public ResponseEntity<ApiResponse<Maintenance>> assignTechnician(
            @PathVariable Long id,
            @RequestParam Long technicianId,
            Authentication authentication) {
        try {
            com.example.ElisaInternership.model.User currentUser = 
                    (com.example.ElisaInternership.model.User) authentication.getPrincipal();
            Maintenance maintenance = maintenanceService.assignTechnician(id, technicianId, currentUser);
            return ResponseEntity.ok(ApiResponse.success("Technician assigned successfully", maintenance));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/lab-manager/maintenance/{id}/complete")
    public ResponseEntity<ApiResponse<Maintenance>> completeMaintenance(
            @PathVariable Long id,
            @RequestParam(required = false) Double cost,
            @RequestParam(required = false) String notes,
            Authentication authentication) {
        try {
            com.example.ElisaInternership.model.User currentUser = 
                    (com.example.ElisaInternership.model.User) authentication.getPrincipal();
            Maintenance maintenance = maintenanceService.completeMaintenance(id, cost, notes, currentUser);
            return ResponseEntity.ok(ApiResponse.success("Maintenance completed successfully", maintenance));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/lab-manager/maintenance/{id}")
    public ResponseEntity<ApiResponse<Maintenance>> updateMaintenance(
            @PathVariable Long id,
            @Valid @RequestBody MaintenanceRequest request,
            Authentication authentication) {
        try {
            com.example.ElisaInternership.model.User currentUser = 
                    (com.example.ElisaInternership.model.User) authentication.getPrincipal();
            Maintenance maintenance = maintenanceService.updateMaintenance(id, request, currentUser);
            return ResponseEntity.ok(ApiResponse.success("Maintenance updated successfully", maintenance));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/lab-manager/maintenance/{id}/cancel")
    public ResponseEntity<ApiResponse<Object>> cancelMaintenance(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            com.example.ElisaInternership.model.User currentUser = 
                    (com.example.ElisaInternership.model.User) authentication.getPrincipal();
            maintenanceService.cancelMaintenance(id, currentUser);
            return ResponseEntity.ok(ApiResponse.success("Maintenance cancelled successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/maintenance")
    public ResponseEntity<ApiResponse<List<Maintenance>>> getAllMaintenance() {
        List<Maintenance> maintenance = maintenanceService.getAllMaintenance();
        return ResponseEntity.ok(ApiResponse.success("Maintenance requests retrieved successfully", maintenance));
    }

    @GetMapping("/maintenance/{id}")
    public ResponseEntity<ApiResponse<Maintenance>> getMaintenanceById(@PathVariable Long id) {
        try {
            Maintenance maintenance = maintenanceService.getMaintenanceById(id);
            return ResponseEntity.ok(ApiResponse.success("Maintenance request retrieved successfully", maintenance));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/maintenance/equipment/{equipmentId}")
    public ResponseEntity<ApiResponse<List<Maintenance>>> getMaintenanceByEquipment(@PathVariable Long equipmentId) {
        List<Maintenance> maintenance = maintenanceService.getMaintenanceByEquipment(equipmentId);
        return ResponseEntity.ok(ApiResponse.success("Maintenance requests retrieved successfully", maintenance));
    }

    @GetMapping("/maintenance/status/{status}")
    public ResponseEntity<ApiResponse<List<Maintenance>>> getMaintenanceByStatus(@PathVariable String status) {
        try {
            Maintenance.MaintenanceStatus maintenanceStatus = Maintenance.MaintenanceStatus.valueOf(status.toUpperCase());
            List<Maintenance> maintenance = maintenanceService.getMaintenanceByStatus(maintenanceStatus);
            return ResponseEntity.ok(ApiResponse.success("Maintenance requests retrieved successfully", maintenance));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid status: " + status));
        }
    }

    @GetMapping("/maintenance/technician/{technicianId}")
    public ResponseEntity<ApiResponse<List<Maintenance>>> getMaintenanceByTechnician(@PathVariable Long technicianId) {
        List<Maintenance> maintenance = maintenanceService.getMaintenanceByTechnician(technicianId);
        return ResponseEntity.ok(ApiResponse.success("Maintenance requests retrieved successfully", maintenance));
    }
}






