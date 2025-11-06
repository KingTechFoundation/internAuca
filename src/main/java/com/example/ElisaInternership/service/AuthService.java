package com.example.ElisaInternership.service;

import com.example.ElisaInternership.dto.AuthResponse;
import com.example.ElisaInternership.dto.LoginRequest;
import com.example.ElisaInternership.dto.RegisterRequest;
import com.example.ElisaInternership.model.Lab;
import com.example.ElisaInternership.model.User;
import com.example.ElisaInternership.repository.LabRepository;
import com.example.ElisaInternership.repository.UserRepository;
import com.example.ElisaInternership.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LabRepository labRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private AuditService auditService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        
        // Default role is STUDENT, but can be set by admin later
        user.setRole(User.Role.STUDENT);
        user.setActive(true);

        if (request.getLabId() != null) {
            Lab lab = labRepository.findById(request.getLabId())
                    .orElseThrow(() -> new RuntimeException("Lab not found"));
            user.setAssignedLab(lab);
        }

        user = userRepository.save(user);
        auditService.logAction("USER_CREATED", "User", user.getId(), user, "New user registered");

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String token = jwtUtil.generateToken(userDetails, user.getRole().name());

        return new AuthResponse(token, user.getId(), user.getUsername(), user.getEmail(),
                user.getFirstName(), user.getLastName(), user.getRole().name());
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
        } catch (Exception e) {
            throw new RuntimeException("Invalid username or password");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getActive()) {
            throw new RuntimeException("Account is deactivated");
        }

        String token = jwtUtil.generateToken(userDetails, user.getRole().name());
        auditService.logAction("USER_LOGIN", "User", user.getId(), user, "User logged in");

        return new AuthResponse(token, user.getId(), user.getUsername(), user.getEmail(),
                user.getFirstName(), user.getLastName(), user.getRole().name());
    }
}

