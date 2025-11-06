package com.example.ElisaInternership.controller;

import com.example.ElisaInternership.dto.ApiResponse;
import com.example.ElisaInternership.dto.EquipmentRequest;
import com.example.ElisaInternership.model.Equipment;
import com.example.ElisaInternership.service.EquipmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class EquipmentController {
    @Autowired
    private EquipmentService equipmentService;

    @PostMapping("/lab-manager/equipment")
    public ResponseEntity<ApiResponse<Equipment>> createEquipment(
            @Valid @RequestBody EquipmentRequest request,
            Authentication authentication) {
        try {
            com.example.ElisaInternership.model.User currentUser = 
                    (com.example.ElisaInternership.model.User) authentication.getPrincipal();
            Equipment equipment = equipmentService.createEquipment(request, currentUser);
            return ResponseEntity.ok(ApiResponse.success("Equipment created successfully", equipment));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/lab-manager/equipment/{id}")
    public ResponseEntity<ApiResponse<Equipment>> updateEquipment(
            @PathVariable Long id,
            @Valid @RequestBody EquipmentRequest request,
            Authentication authentication) {
        try {
            com.example.ElisaInternership.model.User currentUser = 
                    (com.example.ElisaInternership.model.User) authentication.getPrincipal();
            Equipment equipment = equipmentService.updateEquipment(id, request, currentUser);
            return ResponseEntity.ok(ApiResponse.success("Equipment updated successfully", equipment));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/lab-manager/equipment/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteEquipment(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            com.example.ElisaInternership.model.User currentUser = 
                    (com.example.ElisaInternership.model.User) authentication.getPrincipal();
            equipmentService.deleteEquipment(id, currentUser);
            return ResponseEntity.ok(ApiResponse.success("Equipment deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/equipment")
    public ResponseEntity<ApiResponse<List<Equipment>>> getAllEquipment() {
        List<Equipment> equipment = equipmentService.getAllEquipment();
        return ResponseEntity.ok(ApiResponse.success("Equipment retrieved successfully", equipment));
    }

    @GetMapping("/equipment/{id}")
    public ResponseEntity<ApiResponse<Equipment>> getEquipmentById(@PathVariable Long id) {
        try {
            Equipment equipment = equipmentService.getEquipmentById(id);
            return ResponseEntity.ok(ApiResponse.success("Equipment retrieved successfully", equipment));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/equipment/lab/{labId}")
    public ResponseEntity<ApiResponse<List<Equipment>>> getEquipmentByLab(@PathVariable Long labId) {
        List<Equipment> equipment = equipmentService.getEquipmentByLab(labId);
        return ResponseEntity.ok(ApiResponse.success("Equipment retrieved successfully", equipment));
    }

    @GetMapping("/equipment/status/{status}")
    public ResponseEntity<ApiResponse<List<Equipment>>> getEquipmentByStatus(@PathVariable String status) {
        try {
            Equipment.EquipmentStatus equipmentStatus = Equipment.EquipmentStatus.valueOf(status.toUpperCase());
            List<Equipment> equipment = equipmentService.getEquipmentByStatus(equipmentStatus);
            return ResponseEntity.ok(ApiResponse.success("Equipment retrieved successfully", equipment));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid status: " + status));
        }
    }
}

