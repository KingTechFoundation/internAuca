package com.example.ElisaInternership.service;

import com.example.ElisaInternership.dto.BookingRequest;
import com.example.ElisaInternership.model.Booking;
import com.example.ElisaInternership.model.Lab;
import com.example.ElisaInternership.model.User;
import com.example.ElisaInternership.repository.BookingRepository;
import com.example.ElisaInternership.repository.LabRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class BookingService {
    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private LabRepository labRepository;

    @Autowired
    private AuditService auditService;

    public Booking createBooking(BookingRequest request, User user) {
        if (request.getStartTime().isAfter(request.getEndTime())) {
            throw new RuntimeException("Start time must be before end time");
        }

        // Allow bookings that start within the current hour or later
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfCurrentHour = now.withMinute(0).withSecond(0).withNano(0);

        if (request.getStartTime().isBefore(startOfCurrentHour)) {
            throw new RuntimeException("Cannot book in the past");
        }

        Lab lab = labRepository.findById(request.getLabId())
                .orElseThrow(() -> new RuntimeException("Lab not found"));

        // Check for overlapping bookings
        List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                lab.getId(), request.getStartTime(), request.getEndTime());
        if (!overlapping.isEmpty()) {
            throw new RuntimeException("Lab is already booked for this time slot");
        }

        Booking booking = new Booking();
        booking.setLab(lab);
        booking.setUser(user);
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose());
        booking.setStatus(user.getRole() == User.Role.INSTRUCTOR ? Booking.BookingStatus.APPROVED
                : Booking.BookingStatus.PENDING);

        booking = bookingRepository.save(booking);
        auditService.logAction("BOOKING_CREATED", "Booking", booking.getId(), user,
                "Booking created for lab: " + lab.getName());
        return booking;
    }

    public Booking updateBooking(Long id, BookingRequest request, User currentUser) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (request.getStartTime().isAfter(request.getEndTime())) {
            throw new RuntimeException("Start time must be before end time");
        }

        Lab lab = labRepository.findById(request.getLabId())
                .orElseThrow(() -> new RuntimeException("Lab not found"));

        // Check for overlapping bookings (excluding current booking)
        List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                lab.getId(), request.getStartTime(), request.getEndTime());
        overlapping.removeIf(b -> b.getId().equals(id));
        if (!overlapping.isEmpty()) {
            throw new RuntimeException("Lab is already booked for this time slot");
        }

        booking.setLab(lab);
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose());

        booking = bookingRepository.save(booking);
        auditService.logAction("BOOKING_UPDATED", "Booking", booking.getId(), currentUser,
                "Booking updated");
        return booking;
    }

    public Booking approveBooking(Long id, User currentUser) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(Booking.BookingStatus.APPROVED);
        booking = bookingRepository.save(booking);
        auditService.logAction("BOOKING_APPROVED", "Booking", booking.getId(), currentUser,
                "Booking approved");
        return booking;
    }

    public Booking rejectBooking(Long id, User currentUser) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(Booking.BookingStatus.REJECTED);
        booking = bookingRepository.save(booking);
        auditService.logAction("BOOKING_REJECTED", "Booking", booking.getId(), currentUser,
                "Booking rejected");
        return booking;
    }

    public void cancelBooking(Long id, User currentUser) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        bookingRepository.save(booking);
        auditService.logAction("BOOKING_CANCELLED", "Booking", booking.getId(), currentUser,
                "Booking cancelled");
    }

    public void deleteBooking(Long id, User currentUser) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        auditService.logAction("BOOKING_DELETED", "Booking", booking.getId(), currentUser,
                "Booking deleted");
        bookingRepository.delete(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getBookingsByLab(Long labId) {
        return bookingRepository.findByLabId(labId);
    }

    public List<Booking> getBookingsByLabAndDateRange(Long labId, LocalDateTime start, LocalDateTime end) {
        return bookingRepository.findByLabIdAndStartTimeBetween(labId, start, end);
    }
}
