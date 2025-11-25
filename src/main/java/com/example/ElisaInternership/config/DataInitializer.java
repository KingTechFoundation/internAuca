package com.example.ElisaInternership.config;

import com.example.ElisaInternership.model.Booking;
import com.example.ElisaInternership.model.Equipment;
import com.example.ElisaInternership.model.Lab;
import com.example.ElisaInternership.model.User;
import com.example.ElisaInternership.repository.BookingRepository;
import com.example.ElisaInternership.repository.EquipmentRepository;
import com.example.ElisaInternership.repository.LabRepository;
import com.example.ElisaInternership.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LabRepository labRepository;

    @Autowired
    private EquipmentRepository equipmentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create default admin user if it doesn't exist
        User admin = null;
        if (!userRepository.existsByUsername("admin")) {
            admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@auca.rw");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFirstName("System");
            admin.setLastName("Administrator");
            admin.setRole(User.Role.ADMIN);
            admin.setActive(true);
            admin = userRepository.save(admin);
            System.out.println("Default admin user created: username=admin, password=admin123");
        } else {
            admin = userRepository.findByUsername("admin").orElse(null);
        }

        // Create sample Labs if none exist
        if (labRepository.count() == 0) {
            createSampleLabs(admin);
        }
    }

    private void createSampleLabs(User admin) {
        // Lab 1: Main Computer Lab
        Lab lab1 = new Lab();
        lab1.setName("Main Computer Lab");
        lab1.setLocation("Building A, Room 101");
        lab1.setCapacity(30);
        lab1.setType(Lab.LabType.MAIN_COMPUTER_LAB);
        lab1.setLabManager(admin);
        lab1.setActive(true);
        lab1 = labRepository.save(lab1);

        // Lab 2: English Lab
        Lab lab2 = new Lab();
        lab2.setName("English Lab");
        lab2.setLocation("Building B, Room 202");
        lab2.setCapacity(20);
        lab2.setType(Lab.LabType.ENGLISH_LAB);
        lab2.setLabManager(admin);
        lab2.setActive(true);
        lab2 = labRepository.save(lab2);

        System.out.println("Sample labs created");

        createSampleEquipment(lab1, lab2);
        createSampleBookings(lab1, admin);
    }

    private void createSampleEquipment(Lab lab1, Lab lab2) {
        // Equipment for Lab 1
        Equipment eq1 = new Equipment();
        eq1.setName("Dell XPS 15");
        eq1.setDescription("High-performance laptop for development");
        eq1.setSerialNumber("DELL-XPS-001");
        eq1.setLab(lab1);
        eq1.setStatus(Equipment.EquipmentStatus.AVAILABLE);
        equipmentRepository.save(eq1);

        Equipment eq2 = new Equipment();
        eq2.setName("Projector Epson");
        eq2.setDescription("4K Projector for presentations");
        eq2.setSerialNumber("EPSON-PROJ-001");
        eq2.setLab(lab1);
        eq2.setStatus(Equipment.EquipmentStatus.IN_USE);
        equipmentRepository.save(eq2);

        // Equipment for Lab 2
        Equipment eq3 = new Equipment();
        eq3.setName("Headphones Sony");
        eq3.setDescription("Noise cancelling headphones");
        eq3.setSerialNumber("SONY-WH-001");
        eq3.setLab(lab2);
        eq3.setStatus(Equipment.EquipmentStatus.AVAILABLE);
        equipmentRepository.save(eq3);

        System.out.println("Sample equipment created");
    }

    private void createSampleBookings(Lab lab, User user) {
        Booking booking1 = new Booking();
        booking1.setLab(lab);
        booking1.setUser(user);
        booking1.setStartTime(java.time.LocalDateTime.now().plusDays(1).withHour(10).withMinute(0));
        booking1.setEndTime(java.time.LocalDateTime.now().plusDays(1).withHour(12).withMinute(0));
        booking1.setPurpose("Java Programming Class");
        booking1.setStatus(Booking.BookingStatus.APPROVED);
        bookingRepository.save(booking1);

        Booking booking2 = new Booking();
        booking2.setLab(lab);
        booking2.setUser(user);
        booking2.setStartTime(java.time.LocalDateTime.now().plusDays(2).withHour(14).withMinute(0));
        booking2.setEndTime(java.time.LocalDateTime.now().plusDays(2).withHour(16).withMinute(0));
        booking2.setPurpose("Database Management Workshop");
        booking2.setStatus(Booking.BookingStatus.PENDING);
        bookingRepository.save(booking2);

        System.out.println("Sample bookings created");
    }
}
