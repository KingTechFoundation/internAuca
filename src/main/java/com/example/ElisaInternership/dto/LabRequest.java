package com.example.ElisaInternership.dto;

import com.example.ElisaInternership.model.Lab.LabType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class LabRequest {
    @NotBlank(message = "Lab name is required")
    private String name;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Capacity is required")
    @Positive(message = "Capacity must be positive")
    private Integer capacity;

    @NotNull(message = "Lab type is required")
    private LabType type;

    private Long labManagerId;

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public LabType getType() {
        return type;
    }

    public void setType(LabType type) {
        this.type = type;
    }

    public Long getLabManagerId() {
        return labManagerId;
    }

    public void setLabManagerId(Long labManagerId) {
        this.labManagerId = labManagerId;
    }
}

