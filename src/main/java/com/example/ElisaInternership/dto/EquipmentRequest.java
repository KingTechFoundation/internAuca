package com.example.ElisaInternership.dto;

import com.example.ElisaInternership.model.Equipment.EquipmentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class EquipmentRequest {
    @NotBlank(message = "Equipment name is required")
    private String name;

    private String description;

    @NotBlank(message = "Serial number is required")
    private String serialNumber;

    @NotNull(message = "Lab ID is required")
    private Long labId;

    private EquipmentStatus status;

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public Long getLabId() {
        return labId;
    }

    public void setLabId(Long labId) {
        this.labId = labId;
    }

    public EquipmentStatus getStatus() {
        return status;
    }

    public void setStatus(EquipmentStatus status) {
        this.status = status;
    }
}

