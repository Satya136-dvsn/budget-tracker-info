package com.budgettracker.controller;

import com.budgettracker.dto.TransactionRequest;
import com.budgettracker.dto.TransactionResponse;
import com.budgettracker.service.TransactionService;
import com.budgettracker.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")
public class TransactionController {
    
    @Autowired
    private TransactionService transactionService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    // Create new transaction
    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> createTransaction(@Valid @RequestBody TransactionRequest request, 
                                             @RequestHeader("Authorization") String token) {
        try {
            String username = jwtUtil.extractUsername(token.substring(7));
            TransactionResponse response = transactionService.createTransaction(request, username);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating transaction: " + e.getMessage());
        }
    }
    
    // Get all user transactions
    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getUserTransactions(@RequestHeader("Authorization") String token) {
        try {
            String username = jwtUtil.extractUsername(token.substring(7));
            List<TransactionResponse> transactions = transactionService.getUserTransactions(username);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching transactions: " + e.getMessage());
        }
    }
    
    // Get transaction by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getTransactionById(@PathVariable Long id, 
                                              @RequestHeader("Authorization") String token) {
        try {
            String username = jwtUtil.extractUsername(token.substring(7));
            Optional<TransactionResponse> transaction = transactionService.getTransactionById(id, username);
            
            if (transaction.isPresent()) {
                return ResponseEntity.ok(transaction.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching transaction: " + e.getMessage());
        }
    }
    
    // Update transaction
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateTransaction(@PathVariable Long id, 
                                             @Valid @RequestBody TransactionRequest request,
                                             @RequestHeader("Authorization") String token) {
        try {
            String username = jwtUtil.extractUsername(token.substring(7));
            TransactionResponse response = transactionService.updateTransaction(id, request, username);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating transaction: " + e.getMessage());
        }
    }
    
    // Delete transaction
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteTransaction(@PathVariable Long id, 
                                             @RequestHeader("Authorization") String token) {
        try {
            String username = jwtUtil.extractUsername(token.substring(7));
            transactionService.deleteTransaction(id, username);
            return ResponseEntity.ok().body("Transaction deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting transaction: " + e.getMessage());
        }
    }
    
    // Get transactions by type
    @GetMapping("/type/{type}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getTransactionsByType(@PathVariable String type, 
                                                  @RequestHeader("Authorization") String token) {
        try {
            String username = jwtUtil.extractUsername(token.substring(7));
            List<TransactionResponse> transactions = transactionService.getTransactionsByType(type, username);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching transactions by type: " + e.getMessage());
        }
    }
    
    // Get transactions by category
    @GetMapping("/category/{category}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getTransactionsByCategory(@PathVariable String category, 
                                                      @RequestHeader("Authorization") String token) {
        try {
            String username = jwtUtil.extractUsername(token.substring(7));
            List<TransactionResponse> transactions = transactionService.getTransactionsByCategory(category, username);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching transactions by category: " + e.getMessage());
        }
    }
    
    // Get transactions by date range
    @GetMapping("/date-range")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getTransactionsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestHeader("Authorization") String token) {
        try {
            String username = jwtUtil.extractUsername(token.substring(7));
            List<TransactionResponse> transactions = transactionService.getTransactionsByDateRange(startDate, endDate, username);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching transactions by date range: " + e.getMessage());
        }
    }
    
    // Get financial summary
    @GetMapping("/summary")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getFinancialSummary(@RequestHeader("Authorization") String token) {
        try {
            String username = jwtUtil.extractUsername(token.substring(7));
            Map<String, Object> summary = transactionService.getFinancialSummary(username);
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching financial summary: " + e.getMessage());
        }
    }
    
    // Get monthly financial summary
    @GetMapping("/summary/{year}/{month}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getMonthlyFinancialSummary(@PathVariable int year, 
                                                        @PathVariable int month, 
                                                        @RequestHeader("Authorization") String token) {
        try {
            String username = jwtUtil.extractUsername(token.substring(7));
            Map<String, Object> summary = transactionService.getMonthlyFinancialSummary(year, month, username);
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching monthly summary: " + e.getMessage());
        }
    }
    
    // Get expense breakdown by category
    @GetMapping("/breakdown/expenses")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getExpenseBreakdown(@RequestHeader("Authorization") String token) {
        try {
            String username = jwtUtil.extractUsername(token.substring(7));
            List<Map<String, Object>> breakdown = transactionService.getExpenseBreakdown(username);
            return ResponseEntity.ok(breakdown);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching expense breakdown: " + e.getMessage());
        }
    }
    
    // Get income breakdown by category
    @GetMapping("/breakdown/income")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getIncomeBreakdown(@RequestHeader("Authorization") String token) {
        try {
            String username = jwtUtil.extractUsername(token.substring(7));
            List<Map<String, Object>> breakdown = transactionService.getIncomeBreakdown(username);
            return ResponseEntity.ok(breakdown);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching income breakdown: " + e.getMessage());
        }
    }
    
    // Get recent transactions
    @GetMapping("/recent")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getRecentTransactions(@RequestParam(defaultValue = "10") int limit, 
                                                  @RequestHeader("Authorization") String token) {
        try {
            String username = jwtUtil.extractUsername(token.substring(7));
            List<TransactionResponse> transactions = transactionService.getRecentTransactions(limit, username);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching recent transactions: " + e.getMessage());
        }
    }
    
    // Get transaction statistics
    @GetMapping("/statistics")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getTransactionStatistics(@RequestHeader("Authorization") String token) {
        try {
            String username = jwtUtil.extractUsername(token.substring(7));
            Map<String, Object> statistics = transactionService.getTransactionStatistics(username);
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching transaction statistics: " + e.getMessage());
        }
    }
}