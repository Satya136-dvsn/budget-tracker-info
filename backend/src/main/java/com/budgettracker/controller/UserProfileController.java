package com.budgettracker.controller;

import com.budgettracker.dto.AuthResponse;
import com.budgettracker.dto.UserProfileUpdateRequest;
import com.budgettracker.model.User;
import com.budgettracker.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserProfileController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/profile")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getUserProfile(Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            
            AuthResponse response = new AuthResponse();
            response.setId(user.getId());
            response.setUsername(user.getUsername());
            response.setEmail(user.getEmail());
            response.setRole(user.getRole().name());
            response.setMonthlyIncome(user.getMonthlyIncome());
            response.setCurrentSavings(user.getCurrentSavings());
            response.setTargetExpenses(user.getTargetExpenses());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/profile")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateUserProfile(@Valid @RequestBody UserProfileUpdateRequest updateRequest,
                                             Authentication authentication) {
        try {
            User currentUser = (User) authentication.getPrincipal();
            
            User updatedUser = userService.updateUserProfile(
                currentUser.getId(),
                updateRequest.getMonthlyIncome(),
                updateRequest.getCurrentSavings(),
                updateRequest.getTargetExpenses()
            );
            
            AuthResponse response = new AuthResponse();
            response.setId(updatedUser.getId());
            response.setUsername(updatedUser.getUsername());
            response.setEmail(updatedUser.getEmail());
            response.setRole(updatedUser.getRole().name());
            response.setMonthlyIncome(updatedUser.getMonthlyIncome());
            response.setCurrentSavings(updatedUser.getCurrentSavings());
            response.setTargetExpenses(updatedUser.getTargetExpenses());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/profile/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUserProfileById(@PathVariable Long userId) {
        try {
            User user = userService.getUserById(userId);
            
            AuthResponse response = new AuthResponse();
            response.setId(user.getId());
            response.setUsername(user.getUsername());
            response.setEmail(user.getEmail());
            response.setRole(user.getRole().name());
            response.setMonthlyIncome(user.getMonthlyIncome());
            response.setCurrentSavings(user.getCurrentSavings());
            response.setTargetExpenses(user.getTargetExpenses());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/profile/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserProfileById(@PathVariable Long userId,
                                                  @Valid @RequestBody UserProfileUpdateRequest updateRequest) {
        try {
            User updatedUser = userService.updateUserProfile(
                userId,
                updateRequest.getMonthlyIncome(),
                updateRequest.getCurrentSavings(),
                updateRequest.getTargetExpenses()
            );
            
            AuthResponse response = new AuthResponse();
            response.setId(updatedUser.getId());
            response.setUsername(updatedUser.getUsername());
            response.setEmail(updatedUser.getEmail());
            response.setRole(updatedUser.getRole().name());
            response.setMonthlyIncome(updatedUser.getMonthlyIncome());
            response.setCurrentSavings(updatedUser.getCurrentSavings());
            response.setTargetExpenses(updatedUser.getTargetExpenses());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body("Error: " + e.getMessage());
        }
    }
}
