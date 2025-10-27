package com.budgettracker.service;

import com.budgettracker.dto.UserProfileRequest;
import com.budgettracker.dto.UserProfileResponse;
import com.budgettracker.model.UserProfile;
import com.budgettracker.repository.UserProfileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service for managing user profiles and preferences
 * Handles currency settings, notifications, and personal preferences
 */
@Service
@Transactional
public class UserProfileService {

    private static final Logger logger = LoggerFactory.getLogger(UserProfileService.class);

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private RealTimeService realTimeService;

    /**
     * Get user profile by user ID, create default if not exists
     */
    public UserProfileResponse getUserProfile(Long userId) {
        Optional<UserProfile> profileOpt = userProfileRepository.findByUserId(userId);
        
        if (profileOpt.isPresent()) {
            return UserProfileResponse.fromEntity(profileOpt.get());
        } else {
            // Create default profile for new user
            UserProfile defaultProfile = createDefaultProfile(userId);
            return UserProfileResponse.fromEntity(defaultProfile);
        }
    }

    /**
     * Create default user profile with INR currency
     */
    public UserProfile createDefaultProfile(Long userId) {
        logger.info("Creating default profile for user: {}", userId);
        
        UserProfile profile = new UserProfile(userId);
        profile.setPreferredCurrency("INR"); // Default to Indian Rupees
        profile.setTimezone("Asia/Kolkata"); // Indian Standard Time
        profile.setDateFormat("DD/MM/YYYY"); // Indian date format
        profile.setNumberFormat("IN"); // Indian number format
        profile.setLanguage("en");
        profile.setTheme("light");
        
        UserProfile savedProfile = userProfileRepository.save(profile);
        logger.info("Created default profile for user: {} with INR currency", userId);
        
        return savedProfile;
    }

    /**
     * Update user profile
     */
    public UserProfileResponse updateUserProfile(Long userId, UserProfileRequest request) {
        logger.info("Updating profile for user: {}", userId);
        
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElse(new UserProfile(userId));

        // Update currency preference
        if (request.getPreferredCurrency() != null) {
            String oldCurrency = profile.getPreferredCurrency();
            profile.setPreferredCurrency(request.getPreferredCurrency());
            
            // Send real-time update if currency changed
            if (!request.getPreferredCurrency().equals(oldCurrency)) {
                realTimeService.sendCurrencyRateUpdate(userId, Map.of(
                    "newCurrency", request.getPreferredCurrency(),
                    "oldCurrency", oldCurrency,
                    "message", "Currency preference updated"
                ));
            }
        }

        // Update other preferences
        if (request.getTimezone() != null) {
            profile.setTimezone(request.getTimezone());
        }
        if (request.getDateFormat() != null) {
            profile.setDateFormat(request.getDateFormat());
        }
        if (request.getNumberFormat() != null) {
            profile.setNumberFormat(request.getNumberFormat());
        }
        if (request.getLanguage() != null) {
            profile.setLanguage(request.getLanguage());
        }
        if (request.getTheme() != null) {
            profile.setTheme(request.getTheme());
        }

        // Update notification preferences
        if (request.getEmailNotifications() != null) {
            profile.setEmailNotifications(request.getEmailNotifications());
        }
        if (request.getSmsNotifications() != null) {
            profile.setSmsNotifications(request.getSmsNotifications());
        }
        if (request.getPushNotifications() != null) {
            profile.setPushNotifications(request.getPushNotifications());
        }
        if (request.getWhatsappNotifications() != null) {
            profile.setWhatsappNotifications(request.getWhatsappNotifications());
        }
        if (request.getBudgetAlerts() != null) {
            profile.setBudgetAlerts(request.getBudgetAlerts());
        }
        if (request.getBillReminders() != null) {
            profile.setBillReminders(request.getBillReminders());
        }
        if (request.getInvestmentAlerts() != null) {
            profile.setInvestmentAlerts(request.getInvestmentAlerts());
        }
        if (request.getWeeklySummary() != null) {
            profile.setWeeklySummary(request.getWeeklySummary());
        }
        if (request.getMonthlyReport() != null) {
            profile.setMonthlyReport(request.getMonthlyReport());
        }

        UserProfile savedProfile = userProfileRepository.save(profile);
        logger.info("Updated profile for user: {}", userId);

        // Send real-time update
        realTimeService.sendUserUpdate(userId, "PROFILE_UPDATED", Map.of(
            "message", "Profile settings updated successfully",
            "preferredCurrency", savedProfile.getPreferredCurrency()
        ));

        return UserProfileResponse.fromEntity(savedProfile);
    }

    /**
     * Get user's preferred currency
     */
    public String getUserPreferredCurrency(Long userId) {
        return userProfileRepository.findPreferredCurrencyByUserId(userId)
                .orElse("INR"); // Default to INR if not found
    }

    /**
     * Update only currency preference
     */
    public void updateCurrencyPreference(Long userId, String currency) {
        logger.info("Updating currency preference for user: {} to {}", userId, currency);
        
        Optional<UserProfile> profileOpt = userProfileRepository.findByUserId(userId);
        if (profileOpt.isPresent()) {
            UserProfile profile = profileOpt.get();
            String oldCurrency = profile.getPreferredCurrency();
            profile.setPreferredCurrency(currency);
            userProfileRepository.save(profile);
            
            // Send real-time update
            realTimeService.sendCurrencyRateUpdate(userId, Map.of(
                "newCurrency", currency,
                "oldCurrency", oldCurrency,
                "message", "Currency preference updated to " + currency
            ));
        } else {
            // Create new profile with specified currency
            UserProfile profile = createDefaultProfile(userId);
            profile.setPreferredCurrency(currency);
            userProfileRepository.save(profile);
        }
    }

    /**
     * Get user's timezone
     */
    public String getUserTimezone(Long userId) {
        return userProfileRepository.findTimezoneByUserId(userId)
                .orElse("Asia/Kolkata"); // Default to IST
    }

    /**
     * Delete user profile
     */
    public void deleteUserProfile(Long userId) {
        logger.info("Deleting profile for user: {}", userId);
        userProfileRepository.deleteByUserId(userId);
    }

    /**
     * Get users with specific notification preferences
     */
    public List<UserProfileResponse> getUsersWithNotificationPreferences(
            Boolean emailNotifications, Boolean smsNotifications, Boolean pushNotifications) {
        
        List<UserProfile> profiles = userProfileRepository.findByNotificationPreferences(
                emailNotifications, smsNotifications, pushNotifications);
        
        return profiles.stream()
                .map(UserProfileResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get users who want budget alerts
     */
    public List<Long> getUsersWithBudgetAlertsEnabled() {
        return userProfileRepository.findUsersWithBudgetAlertsEnabled()
                .stream()
                .map(UserProfile::getUserId)
                .collect(Collectors.toList());
    }

    /**
     * Get users who want bill reminders
     */
    public List<Long> getUsersWithBillRemindersEnabled() {
        return userProfileRepository.findUsersWithBillRemindersEnabled()
                .stream()
                .map(UserProfile::getUserId)
                .collect(Collectors.toList());
    }

    /**
     * Get users who want investment alerts
     */
    public List<Long> getUsersWithInvestmentAlertsEnabled() {
        return userProfileRepository.findUsersWithInvestmentAlertsEnabled()
                .stream()
                .map(UserProfile::getUserId)
                .collect(Collectors.toList());
    }

    /**
     * Check if user profile exists
     */
    public boolean userProfileExists(Long userId) {
        return userProfileRepository.existsByUserId(userId);
    }

    /**
     * Ensure user has a profile (create if not exists)
     */
    public UserProfile ensureUserProfile(Long userId) {
        return userProfileRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultProfile(userId));
    }
}