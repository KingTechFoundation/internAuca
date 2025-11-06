package com.example.ElisaInternership.service;

import com.example.ElisaInternership.model.Booking;
import com.example.ElisaInternership.model.Equipment;
import com.example.ElisaInternership.model.Maintenance;
import com.example.ElisaInternership.repository.BookingRepository;
import com.example.ElisaInternership.repository.EquipmentRepository;
import com.example.ElisaInternership.repository.MaintenanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {
    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EquipmentRepository equipmentRepository;

    @Autowired
    private MaintenanceRepository maintenanceRepository;

    public Map<String, Object> getMonthlyLabUsageReport(YearMonth yearMonth) {
        LocalDateTime start = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime end = yearMonth.atEndOfMonth().atTime(23, 59, 59);

        List<Booking> bookings = bookingRepository.findAll().stream()
                .filter(b -> b.getStartTime().isAfter(start.minusDays(1)) && 
                            b.getStartTime().isBefore(end.plusDays(1)))
                .toList();

        Map<String, Object> report = new HashMap<>();
        report.put("month", yearMonth.toString());
        report.put("totalBookings", bookings.size());
        report.put("approvedBookings", bookings.stream()
                .filter(b -> b.getStatus() == Booking.BookingStatus.APPROVED)
                .count());
        report.put("pendingBookings", bookings.stream()
                .filter(b -> b.getStatus() == Booking.BookingStatus.PENDING)
                .count());
        report.put("bookings", bookings);

        return report;
    }

    public Map<String, Object> getEquipmentUtilizationReport() {
        List<Equipment> allEquipment = equipmentRepository.findAll();
        long total = allEquipment.size();
        long available = allEquipment.stream()
                .filter(e -> e.getStatus() == Equipment.EquipmentStatus.AVAILABLE)
                .count();
        long inUse = allEquipment.stream()
                .filter(e -> e.getStatus() == Equipment.EquipmentStatus.IN_USE)
                .count();
        long underMaintenance = allEquipment.stream()
                .filter(e -> e.getStatus() == Equipment.EquipmentStatus.UNDER_MAINTENANCE)
                .count();
        long broken = allEquipment.stream()
                .filter(e -> e.getStatus() == Equipment.EquipmentStatus.BROKEN)
                .count();

        Map<String, Object> report = new HashMap<>();
        report.put("totalEquipment", total);
        report.put("available", available);
        report.put("inUse", inUse);
        report.put("underMaintenance", underMaintenance);
        report.put("broken", broken);
        report.put("utilizationRate", total > 0 ? (double)(inUse + underMaintenance) / total * 100 : 0);

        return report;
    }

    public Map<String, Object> getMaintenanceStatistics() {
        List<Maintenance> allMaintenance = maintenanceRepository.findAll();
        long total = allMaintenance.size();
        long pending = allMaintenance.stream()
                .filter(m -> m.getStatus() == Maintenance.MaintenanceStatus.PENDING)
                .count();
        long inProgress = allMaintenance.stream()
                .filter(m -> m.getStatus() == Maintenance.MaintenanceStatus.IN_PROGRESS)
                .count();
        long completed = allMaintenance.stream()
                .filter(m -> m.getStatus() == Maintenance.MaintenanceStatus.COMPLETED)
                .count();

        double totalCost = allMaintenance.stream()
                .filter(m -> m.getCost() != null)
                .mapToDouble(Maintenance::getCost)
                .sum();

        Map<String, Object> report = new HashMap<>();
        report.put("totalRequests", total);
        report.put("pending", pending);
        report.put("inProgress", inProgress);
        report.put("completed", completed);
        report.put("totalCost", totalCost);
        report.put("averageCost", completed > 0 ? totalCost / completed : 0);

        return report;
    }
}

