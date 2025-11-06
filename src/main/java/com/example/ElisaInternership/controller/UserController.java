package com.example.ElisaInternership.controller;

import com.example.ElisaInternership.dto.ApiResponse;
import com.example.ElisaInternership.model.User;
import com.example.ElisaInternership.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/users")
    public ResponseEntity<ApiResponse<User>> createUser(
            @RequestBody User user,
            @RequestParam(required = false) Long labId,
            Authentication authentication) {
        try {
            User currentUser = (User) authentication.getPrincipal();
            User createdUser = userService.createUser(user, labId, currentUser);
            return ResponseEntity.ok(ApiResponse.success("User created successfully", createdUser));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<ApiResponse<User>> updateUser(
            @PathVariable Long id,
            @RequestBody User user,
            @RequestParam(required = false) Long labId,
            Authentication authentication) {
        try {
            User currentUser = (User) authentication.getPrincipal();
            User updatedUser = userService.updateUser(id, user, labId, currentUser);
            return ResponseEntity.ok(ApiResponse.success("User updated successfully", updatedUser));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteUser(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            User currentUser = (User) authentication.getPrincipal();
            userService.deleteUser(id, currentUser);
            return ResponseEntity.ok(ApiResponse.success("User deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<User>> getUserById(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/users/role/{role}")
    public ResponseEntity<ApiResponse<List<User>>> getUsersByRole(@PathVariable String role) {
        try {
            User.Role userRole = User.Role.valueOf(role.toUpperCase());
            List<User> users = userService.getUsersByRole(userRole);
            return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid role: " + role));
        }
    }
}

