package com.example.ElisaInternership.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class MaintenanceRequest {
    @NotNull(message = "Equipment ID is required")
    private Long equipmentId;

    @NotBlank(message = "Description is required")
    private String description;

    private Long assignedTechnicianId;

    private Double cost;

    private String notes;

    // Getters and Setters
    public Long getEquipmentId() {
        return equipmentId;
    }

    public void setEquipmentId(Long equipmentId) {
        this.equipmentId = equipmentId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getAssignedTechnicianId() {
        return assignedTechnicianId;
    }

    public void setAssignedTechnicianId(Long assignedTechnicianId) {
        this.assignedTechnicianId = assignedTechnicianId;
    }

    public Double getCost() {
        return cost;
    }

    public void setCost(Double cost) {
        this.cost = cost;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}

