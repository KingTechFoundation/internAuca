package com.example.ElisaInternership.repository;

import com.example.ElisaInternership.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
    List<Booking> findByLabId(Long labId);
    
    @Query("SELECT b FROM Booking b WHERE b.lab.id = :labId AND b.status = 'APPROVED' " +
           "AND ((b.startTime <= :endTime AND b.endTime >= :startTime))")
    List<Booking> findOverlappingBookings(@Param("labId") Long labId, 
                                          @Param("startTime") LocalDateTime startTime, 
                                          @Param("endTime") LocalDateTime endTime);
    
    List<Booking> findByLabIdAndStartTimeBetween(Long labId, LocalDateTime start, LocalDateTime end);
}

