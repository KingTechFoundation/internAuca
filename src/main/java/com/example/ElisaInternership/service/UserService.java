package com.example.ElisaInternership.service;

import com.example.ElisaInternership.model.Lab;
import com.example.ElisaInternership.model.User;
import com.example.ElisaInternership.repository.LabRepository;
import com.example.ElisaInternership.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LabRepository labRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuditService auditService;

    public User createUser(User user, Long labId, User currentUser) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setActive(true);

        if (labId != null) {
            Lab lab = labRepository.findById(labId)
                    .orElseThrow(() -> new RuntimeException("Lab not found"));
            user.setAssignedLab(lab);
        }

        user = userRepository.save(user);
        auditService.logAction("USER_CREATED", "User", user.getId(), currentUser, 
                "User created: " + user.getUsername());
        return user;
    }

    public User updateUser(Long id, User updatedUser, Long labId, User currentUser) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getUsername().equals(updatedUser.getUsername()) && 
            userRepository.existsByUsername(updatedUser.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }
        if (!user.getEmail().equals(updatedUser.getEmail()) && 
            userRepository.existsByEmail(updatedUser.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }

        user.setUsername(updatedUser.getUsername());
        user.setEmail(updatedUser.getEmail());
        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());
        user.setRole(updatedUser.getRole());
        user.setActive(updatedUser.getActive());

        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        if (labId != null) {
            Lab lab = labRepository.findById(labId)
                    .orElseThrow(() -> new RuntimeException("Lab not found"));
            user.setAssignedLab(lab);
        } else {
            user.setAssignedLab(null);
        }

        user = userRepository.save(user);
        auditService.logAction("USER_UPDATED", "User", user.getId(), currentUser, 
                "User updated: " + user.getUsername());
        return user;
    }

    public void deleteUser(Long id, User currentUser) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        auditService.logAction("USER_DELETED", "User", user.getId(), currentUser, 
                "User deleted: " + user.getUsername());
        userRepository.delete(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<User> getUsersByRole(User.Role role) {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() == role)
                .toList();
    }
}

