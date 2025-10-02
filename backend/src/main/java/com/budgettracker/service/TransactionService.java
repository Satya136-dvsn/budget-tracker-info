package com.budgettracker.service;

import com.budgettracker.dto.TransactionRequest;
import com.budgettracker.dto.TransactionResponse;
import com.budgettracker.model.Transaction;
import com.budgettracker.model.User;
import com.budgettracker.repository.TransactionRepository;
import com.budgettracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;

@Service
@Transactional
public class TransactionService {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Create new transaction
    public TransactionResponse createTransaction(TransactionRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setType(request.getType());
        transaction.setCategory(request.getCategory());
        transaction.setAmount(request.getAmount());
        transaction.setDescription(request.getDescription());
        transaction.setTransactionDate(request.getTransactionDate());
        
        Transaction savedTransaction = transactionRepository.save(transaction);
        return new TransactionResponse(savedTransaction);
    }
    
    // Get all transactions for user
    public List<TransactionResponse> getUserTransactions(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Transaction> transactions = transactionRepository.findByUserOrderByTransactionDateDesc(user);
        return transactions.stream()
                .map(TransactionResponse::new)
                .collect(Collectors.toList());
    }
    
    // Get transaction by ID
    public Optional<TransactionResponse> getTransactionById(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return transactionRepository.findById(id)
                .filter(transaction -> transaction.getUser().getId().equals(user.getId()))
                .map(TransactionResponse::new);
    }
    
    // Update transaction
    public TransactionResponse updateTransaction(Long id, TransactionRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Transaction transaction = transactionRepository.findById(id)
                .filter(t -> t.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Transaction not found or access denied"));
        
        transaction.setType(request.getType());
        transaction.setCategory(request.getCategory());
        transaction.setAmount(request.getAmount());
        transaction.setDescription(request.getDescription());
        transaction.setTransactionDate(request.getTransactionDate());
        
        Transaction updatedTransaction = transactionRepository.save(transaction);
        return new TransactionResponse(updatedTransaction);
    }
    
    // Delete transaction
    public void deleteTransaction(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Transaction transaction = transactionRepository.findById(id)
                .filter(t -> t.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Transaction not found or access denied"));
        
        transactionRepository.delete(transaction);
    }
    
    // Get transactions by type
    public List<TransactionResponse> getTransactionsByType(String type, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Transaction.TransactionType transactionType = Transaction.TransactionType.valueOf(type);
        List<Transaction> transactions = transactionRepository.findByUserAndTypeOrderByTransactionDateDesc(user, transactionType);
        
        return transactions.stream()
                .map(TransactionResponse::new)
                .collect(Collectors.toList());
    }
    
    // Get transactions by category
    public List<TransactionResponse> getTransactionsByCategory(String category, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Transaction> transactions = transactionRepository.findByUserAndCategoryOrderByTransactionDateDesc(user, category);
        return transactions.stream()
                .map(TransactionResponse::new)
                .collect(Collectors.toList());
    }
    
    // Get transactions within date range
    public List<TransactionResponse> getTransactionsByDateRange(LocalDateTime startDate, LocalDateTime endDate, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Transaction> transactions = transactionRepository.findByUserAndTransactionDateBetweenOrderByTransactionDateDesc(
                user, startDate, endDate);
        
        return transactions.stream()
                .map(TransactionResponse::new)
                .collect(Collectors.toList());
    }
    
    // Get financial summary
    public Map<String, Object> getFinancialSummary(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Map<String, Object> summary = new HashMap<>();
        
        BigDecimal totalIncome = transactionRepository.calculateTotalIncome(user);
        BigDecimal totalExpenses = transactionRepository.calculateTotalExpenses(user);
        BigDecimal balance = totalIncome.subtract(totalExpenses);
        
        summary.put("totalIncome", totalIncome);
        summary.put("totalExpenses", totalExpenses);
        summary.put("balance", balance);
        summary.put("transactionCount", transactionRepository.countByUser(user));
        
        return summary;
    }
    
    // Get monthly financial summary
    public Map<String, Object> getMonthlyFinancialSummary(int year, int month, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        LocalDateTime startDate = LocalDateTime.of(year, month, 1, 0, 0);
        LocalDateTime endDate = startDate.plusMonths(1).minusSeconds(1);
        
        Map<String, Object> summary = new HashMap<>();
        
        BigDecimal monthlyIncome = transactionRepository.calculateTotalIncomeInPeriod(user, startDate, endDate);
        BigDecimal monthlyExpenses = transactionRepository.calculateTotalExpensesInPeriod(user, startDate, endDate);
        BigDecimal monthlyBalance = monthlyIncome.subtract(monthlyExpenses);
        
        summary.put("month", month);
        summary.put("year", year);
        summary.put("totalIncome", monthlyIncome);
        summary.put("totalExpenses", monthlyExpenses);
        summary.put("balance", monthlyBalance);
        
        return summary;
    }
    
    // Get expense breakdown by category
    public List<Map<String, Object>> getExpenseBreakdown(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Object[]> breakdown = transactionRepository.getExpenseBreakdownByCategory(user);
        
        return breakdown.stream()
                .map(row -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("category", row[0]);
                    item.put("amount", row[1]);
                    return item;
                })
                .collect(Collectors.toList());
    }
    
    // Get income breakdown by category
    public List<Map<String, Object>> getIncomeBreakdown(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Object[]> breakdown = transactionRepository.getIncomeBreakdownByCategory(user);
        
        return breakdown.stream()
                .map(row -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("category", row[0]);
                    item.put("amount", row[1]);
                    return item;
                })
                .collect(Collectors.toList());
    }
    
    // Get recent transactions (last N transactions)
    public List<TransactionResponse> getRecentTransactions(int limit, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Transaction> transactions = transactionRepository.findRecentTransactions(user, limit);
        return transactions.stream()
                .map(TransactionResponse::new)
                .collect(Collectors.toList());
    }
    
    // Get transaction statistics
    public Map<String, Object> getTransactionStatistics(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Map<String, Object> stats = new HashMap<>();
        
        long totalTransactions = transactionRepository.countByUser(user);
        long incomeTransactions = transactionRepository.countByUserAndType(user, Transaction.TransactionType.INCOME);
        long expenseTransactions = transactionRepository.countByUserAndType(user, Transaction.TransactionType.EXPENSE);
        
        stats.put("totalTransactions", totalTransactions);
        stats.put("incomeTransactions", incomeTransactions);
        stats.put("expenseTransactions", expenseTransactions);
        
        if (totalTransactions > 0) {
            stats.put("incomePercentage", (incomeTransactions * 100.0) / totalTransactions);
            stats.put("expensePercentage", (expenseTransactions * 100.0) / totalTransactions);
        } else {
            stats.put("incomePercentage", 0.0);
            stats.put("expensePercentage", 0.0);
        }
        
        return stats;
    }
}