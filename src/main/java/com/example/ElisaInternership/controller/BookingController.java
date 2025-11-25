package com.example.ElisaInternership.controller;

import com.example.ElisaInternership.dto.ApiResponse;
import com.example.ElisaInternership.dto.BookingRequest;
import com.example.ElisaInternership.model.Booking;
import com.example.ElisaInternership.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api")
public class BookingController {
    @Autowired
    private BookingService bookingService;

    @PostMapping("/instructor/bookings")
    public ResponseEntity<ApiResponse<Booking>> createBooking(
            @Valid @RequestBody BookingRequest request,
            Authentication authentication) {
        try {
            com.example.ElisaInternership.model.User currentUser = 
                    (com.example.ElisaInternership.model.User) authentication.getPrincipal();
            Booking booking = bookingService.createBooking(request, currentUser);
            return ResponseEntity.ok(ApiResponse.success("Booking created successfully", booking));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/student/bookings")
    public ResponseEntity<ApiResponse<Booking>> createStudentBooking(
            @Valid @RequestBody BookingRequest request,
            Authentication authentication) {
        try {
            com.example.ElisaInternership.model.User currentUser = 
                    (com.example.ElisaInternership.model.User) authentication.getPrincipal();
            Booking booking = bookingService.createBooking(request, currentUser);
            return ResponseEntity.ok(ApiResponse.success("Booking request created successfully", booking));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/instructor/bookings/{id}")
    public ResponseEntity<ApiResponse<Booking>> updateBooking(
            @PathVariable Long id,
            @Valid @RequestBody BookingRequest request,
            Authentication authentication) {
        try {
            com.example.ElisaInternership.model.User currentUser = 
                    (com.example.ElisaInternership.model.User) authentication.getPrincipal();
            Booking booking = bookingService.updateBooking(id, request, currentUser);
            return ResponseEntity.ok(ApiResponse.success("Booking updated successfully", booking));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/lab-manager/bookings/{id}/approve")
    public ResponseEntity<ApiResponse<Booking>> approveBooking(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            com.example.ElisaInternership.model.User currentUser = 
                    (com.example.ElisaInternership.model.User) authentication.getPrincipal();
            Booking booking = bookingService.approveBooking(id, currentUser);
            return ResponseEntity.ok(ApiResponse.success("Booking approved successfully", booking));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/lab-manager/bookings/{id}/reject")
    public ResponseEntity<ApiResponse<Booking>> rejectBooking(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            com.example.ElisaInternership.model.User currentUser = 
                    (com.example.ElisaInternership.model.User) authentication.getPrincipal();
            Booking booking = bookingService.rejectBooking(id, currentUser);
            return ResponseEntity.ok(ApiResponse.success("Booking rejected", booking));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/bookings/{id}/cancel")
    public ResponseEntity<ApiResponse<Object>> cancelBooking(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            com.example.ElisaInternership.model.User currentUser = 
                    (com.example.ElisaInternership.model.User) authentication.getPrincipal();
            bookingService.cancelBooking(id, currentUser);
            return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/admin/bookings/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteBooking(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            com.example.ElisaInternership.model.User currentUser = 
                    (com.example.ElisaInternership.model.User) authentication.getPrincipal();
            bookingService.deleteBooking(id, currentUser);
            return ResponseEntity.ok(ApiResponse.success("Booking deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<Booking>>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(ApiResponse.success("Bookings retrieved successfully", bookings));
    }

    @GetMapping("/bookings/{id}")
    public ResponseEntity<ApiResponse<Booking>> getBookingById(@PathVariable Long id) {
        try {
            Booking booking = bookingService.getBookingById(id);
            return ResponseEntity.ok(ApiResponse.success("Booking retrieved successfully", booking));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/bookings/user/{userId}")
    public ResponseEntity<ApiResponse<List<Booking>>> getBookingsByUser(@PathVariable Long userId) {
        List<Booking> bookings = bookingService.getBookingsByUser(userId);
        return ResponseEntity.ok(ApiResponse.success("Bookings retrieved successfully", bookings));
    }

    @GetMapping("/bookings/my-bookings")
    public ResponseEntity<ApiResponse<List<Booking>>> getMyBookings(Authentication authentication) {
        try {
            com.example.ElisaInternership.model.User currentUser = 
                    (com.example.ElisaInternership.model.User) authentication.getPrincipal();
            List<Booking> bookings = bookingService.getBookingsByUser(currentUser.getId());
            return ResponseEntity.ok(ApiResponse.success("Bookings retrieved successfully", bookings));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/bookings/lab/{labId}")
    public ResponseEntity<ApiResponse<List<Booking>>> getBookingsByLab(@PathVariable Long labId) {
        List<Booking> bookings = bookingService.getBookingsByLab(labId);
        return ResponseEntity.ok(ApiResponse.success("Bookings retrieved successfully", bookings));
    }

    @GetMapping("/bookings/lab/{labId}/availability")
    public ResponseEntity<ApiResponse<List<Booking>>> getBookingsByLabAndDateRange(
            @PathVariable Long labId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        List<Booking> bookings = bookingService.getBookingsByLabAndDateRange(labId, start, end);
        return ResponseEntity.ok(ApiResponse.success("Bookings retrieved successfully", bookings));
    }
}






