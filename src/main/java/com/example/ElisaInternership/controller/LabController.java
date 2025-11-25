package com.example.ElisaInternership.controller;

import com.example.ElisaInternership.dto.ApiResponse;
import com.example.ElisaInternership.dto.LabRequest;
import com.example.ElisaInternership.model.Lab;
import com.example.ElisaInternership.service.LabService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class LabController {
    @Autowired
    private LabService labService;

    @PostMapping("/admin/labs")
    public ResponseEntity<ApiResponse<Lab>> createLab(
            @Valid @RequestBody LabRequest request,
            Authentication authentication) {
        try {
            com.example.ElisaInternership.model.User currentUser = 
                    (com.example.ElisaInternership.model.User) authentication.getPrincipal();
            Lab lab = labService.createLab(request, currentUser);
            return ResponseEntity.ok(ApiResponse.success("Lab created successfully", lab));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/admin/labs/{id}")
    public ResponseEntity<ApiResponse<Lab>> updateLab(
            @PathVariable Long id,
            @Valid @RequestBody LabRequest request,
            Authentication authentication) {
        try {
            com.example.ElisaInternership.model.User currentUser = 
                    (com.example.ElisaInternership.model.User) authentication.getPrincipal();
            Lab lab = labService.updateLab(id, request, currentUser);
            return ResponseEntity.ok(ApiResponse.success("Lab updated successfully", lab));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/admin/labs/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteLab(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            com.example.ElisaInternership.model.User currentUser = 
                    (com.example.ElisaInternership.model.User) authentication.getPrincipal();
            labService.deleteLab(id, currentUser);
            return ResponseEntity.ok(ApiResponse.success("Lab deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/labs")
    public ResponseEntity<ApiResponse<List<Lab>>> getAllLabs() {
        List<Lab> labs = labService.getAllLabs();
        return ResponseEntity.ok(ApiResponse.success("Labs retrieved successfully", labs));
    }

    @GetMapping("/labs/active")
    public ResponseEntity<ApiResponse<List<Lab>>> getActiveLabs() {
        List<Lab> labs = labService.getActiveLabs();
        return ResponseEntity.ok(ApiResponse.success("Active labs retrieved successfully", labs));
    }

    @GetMapping("/labs/{id}")
    public ResponseEntity<ApiResponse<Lab>> getLabById(@PathVariable Long id) {
        try {
            Lab lab = labService.getLabById(id);
            return ResponseEntity.ok(ApiResponse.success("Lab retrieved successfully", lab));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/lab-manager/labs")
    public ResponseEntity<ApiResponse<List<Lab>>> getLabsByManager(Authentication authentication) {
        try {
            com.example.ElisaInternership.model.User currentUser = 
                    (com.example.ElisaInternership.model.User) authentication.getPrincipal();
            List<Lab> labs = labService.getLabsByManager(currentUser.getId());
            return ResponseEntity.ok(ApiResponse.success("Labs retrieved successfully", labs));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}






