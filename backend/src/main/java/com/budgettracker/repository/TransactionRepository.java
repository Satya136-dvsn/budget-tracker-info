package com.budgettracker.repository;

import com.budgettracker.model.Transaction;
import com.budgettracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    // Find transactions by user
    List<Transaction> findByUserOrderByTransactionDateDesc(User user);
    
    // Find transactions by user and type
    List<Transaction> findByUserAndTypeOrderByTransactionDateDesc(User user, Transaction.TransactionType type);
    
    // Find transactions by user and category
    List<Transaction> findByUserAndCategoryOrderByTransactionDateDesc(User user, String category);
    
    // Find transactions by user within date range
    List<Transaction> findByUserAndTransactionDateBetweenOrderByTransactionDateDesc(
            User user, LocalDateTime startDate, LocalDateTime endDate);
    
    // Find transactions by user, type and date range
    List<Transaction> findByUserAndTypeAndTransactionDateBetweenOrderByTransactionDateDesc(
            User user, Transaction.TransactionType type, LocalDateTime startDate, LocalDateTime endDate);
    
    // Calculate total income for user
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user = :user AND t.type = 'INCOME'")
    BigDecimal calculateTotalIncome(@Param("user") User user);
    
    // Calculate total expenses for user
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user = :user AND t.type = 'EXPENSE'")
    BigDecimal calculateTotalExpenses(@Param("user") User user);
    
    // Calculate total income for user within date range
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user = :user AND t.type = 'INCOME' AND t.transactionDate BETWEEN :startDate AND :endDate")
    BigDecimal calculateTotalIncomeInPeriod(@Param("user") User user, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Calculate total expenses for user within date range
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user = :user AND t.type = 'EXPENSE' AND t.transactionDate BETWEEN :startDate AND :endDate")
    BigDecimal calculateTotalExpensesInPeriod(@Param("user") User user, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Get expense breakdown by category
    @Query("SELECT t.category, COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user = :user AND t.type = 'EXPENSE' GROUP BY t.category ORDER BY SUM(t.amount) DESC")
    List<Object[]> getExpenseBreakdownByCategory(@Param("user") User user);
    
    // Get income breakdown by category
    @Query("SELECT t.category, COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user = :user AND t.type = 'INCOME' GROUP BY t.category ORDER BY SUM(t.amount) DESC")
    List<Object[]> getIncomeBreakdownByCategory(@Param("user") User user);
    
    // Get monthly transaction summary
    @Query("SELECT YEAR(t.transactionDate), MONTH(t.transactionDate), t.type, COALESCE(SUM(t.amount), 0) " +
           "FROM Transaction t WHERE t.user = :user " +
           "GROUP BY YEAR(t.transactionDate), MONTH(t.transactionDate), t.type " +
           "ORDER BY YEAR(t.transactionDate) DESC, MONTH(t.transactionDate) DESC")
    List<Object[]> getMonthlyTransactionSummary(@Param("user") User user);
    
    // Count transactions by user
    long countByUser(User user);
    
    // Count transactions by user and type
    long countByUserAndType(User user, Transaction.TransactionType type);
    
    // Get recent transactions (limit)
    @Query("SELECT t FROM Transaction t WHERE t.user = :user ORDER BY t.transactionDate DESC LIMIT :limit")
    List<Transaction> findRecentTransactions(@Param("user") User user, @Param("limit") int limit);
}