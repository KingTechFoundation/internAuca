package com.example.ElisaInternership.controller;

import com.example.ElisaInternership.dto.ApiResponse;
import com.example.ElisaInternership.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/reports")
public class ReportController {
    @Autowired
    private ReportService reportService;

    @GetMapping("/monthly-lab-usage")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMonthlyLabUsageReport(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM") YearMonth yearMonth) {
        Map<String, Object> report = reportService.getMonthlyLabUsageReport(yearMonth);
        return ResponseEntity.ok(ApiResponse.success("Report generated successfully", report));
    }

    @GetMapping("/equipment-utilization")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getEquipmentUtilizationReport() {
        Map<String, Object> report = reportService.getEquipmentUtilizationReport();
        return ResponseEntity.ok(ApiResponse.success("Report generated successfully", report));
    }

    @GetMapping("/maintenance-statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMaintenanceStatistics() {
        Map<String, Object> report = reportService.getMaintenanceStatistics();
        return ResponseEntity.ok(ApiResponse.success("Report generated successfully", report));
    }
}






