package com.budgettracker.repository;

import com.budgettracker.model.SavingsGoal;
import com.budgettracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface SavingsGoalRepository extends JpaRepository<SavingsGoal, Long> {
    
    // Find all savings goals for a user
    List<SavingsGoal> findByUserOrderByCreatedAtDesc(User user);
    
    // Find savings goals by user and status
    List<SavingsGoal> findByUserAndStatusOrderByCreatedAtDesc(User user, SavingsGoal.GoalStatus status);
    
    // Find active savings goals (IN_PROGRESS)
    List<SavingsGoal> findByUserAndStatus(User user, SavingsGoal.GoalStatus status);
    
    // Find savings goal by user and id
    Optional<SavingsGoal> findByUserAndId(User user, Long id);
    
    // Get total target amount for all active goals
    @Query("SELECT COALESCE(SUM(sg.targetAmount), 0) FROM SavingsGoal sg WHERE sg.user = :user AND sg.status = 'IN_PROGRESS'")
    BigDecimal getTotalTargetAmount(@Param("user") User user);
    
    // Get total current amount for all active goals
    @Query("SELECT COALESCE(SUM(sg.currentAmount), 0) FROM SavingsGoal sg WHERE sg.user = :user AND sg.status = 'IN_PROGRESS'")
    BigDecimal getTotalCurrentAmount(@Param("user") User user);
    
    // Count active savings goals
    long countByUserAndStatus(User user, SavingsGoal.GoalStatus status);
    
    // Count all savings goals for user
    long countByUser(User user);
    
    // Delete savings goal by user and id
    void deleteByUserAndId(User user, Long id);
}
