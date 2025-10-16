package com.budgettracker.service;

import com.budgettracker.model.Transaction;
import com.budgettracker.model.User;
import com.budgettracker.repository.TransactionRepository;
import com.budgettracker.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExportServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TransactionService transactionService;

    @InjectMocks
    private ExportService exportService;

    private User testUser;
    private List<Transaction> testTransactions;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");

        Transaction transaction1 = new Transaction();
        transaction1.setId(1L);
        transaction1.setTitle("Grocery Shopping");
        transaction1.setCategory("Food");
        transaction1.setType(Transaction.TransactionType.EXPENSE);
        transaction1.setAmount(new BigDecimal("150.00"));
        transaction1.setTransactionDate(LocalDateTime.now().minusDays(1));
        transaction1.setUser(testUser);

        Transaction transaction2 = new Transaction();
        transaction2.setId(2L);
        transaction2.setTitle("Salary");
        transaction2.setCategory("Income");
        transaction2.setType(Transaction.TransactionType.INCOME);
        transaction2.setAmount(new BigDecimal("3000.00"));
        transaction2.setTransactionDate(LocalDateTime.now().minusDays(2));
        transaction2.setUser(testUser);

        testTransactions = Arrays.asList(transaction1, transaction2);
    }

    @Test
    void testExportTransactionsToPdf_Success() throws Exception {
        // Arrange
        String username = "testuser";
        LocalDate startDate = LocalDate.now().minusDays(30);
        LocalDate endDate = LocalDate.now();

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(testUser));
        when(transactionRepository.findByUserIdAndTransactionDateBetween(eq(testUser.getId()), any(), any()))
                .thenReturn(testTransactions);
        when(transactionRepository.getTotalIncomeByUser(testUser.getId()))
                .thenReturn(new BigDecimal("3000.00"));
        when(transactionRepository.getTotalExpensesByUser(testUser.getId()))
                .thenReturn(new BigDecimal("150.00"));
        when(transactionRepository.getTransactionCountByUser(testUser.getId()))
                .thenReturn(2L);
        when(transactionRepository.getExpenseBreakdownByCategory(testUser.getId()))
                .thenReturn(Arrays.asList());

        // Act
        byte[] result = exportService.exportTransactionsToPdf(username, startDate, endDate);

        // Assert
        assertNotNull(result);
        assertTrue(result.length > 0);
        verify(userRepository).findByUsername(username);
        verify(transactionRepository).findByUserIdAndTransactionDateBetween(eq(testUser.getId()), any(), any());
    }

    @Test
    void testExportTransactionsToPdf_UserNotFound() {
        // Arrange
        String username = "nonexistent";
        LocalDate startDate = LocalDate.now().minusDays(30);
        LocalDate endDate = LocalDate.now();

        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            exportService.exportTransactionsToPdf(username, startDate, endDate);
        });

        assertEquals("User not found", exception.getMessage());
        verify(userRepository).findByUsername(username);
        verifyNoInteractions(transactionRepository);
    }

    @Test
    void testExportTransactionsToCsv_Success() throws Exception {
        // Arrange
        String username = "testuser";
        LocalDate startDate = LocalDate.now().minusDays(30);
        LocalDate endDate = LocalDate.now();

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(testUser));
        when(transactionRepository.findByUserIdAndTransactionDateBetween(eq(testUser.getId()), any(), any()))
                .thenReturn(testTransactions);

        // Act
        String result = exportService.exportTransactionsToCsv(username, startDate, endDate);

        // Assert
        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertTrue(result.contains("Date,Title,Category,Type,Amount,Description"));
        assertTrue(result.contains("Grocery Shopping"));
        assertTrue(result.contains("Salary"));
        verify(userRepository).findByUsername(username);
        verify(transactionRepository).findByUserIdAndTransactionDateBetween(eq(testUser.getId()), any(), any());
    }

    @Test
    void testExportTransactionsToCsv_EmptyTransactions() throws Exception {
        // Arrange
        String username = "testuser";
        LocalDate startDate = LocalDate.now().minusDays(30);
        LocalDate endDate = LocalDate.now();

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(testUser));
        when(transactionRepository.findByUserIdAndTransactionDateBetween(eq(testUser.getId()), any(), any()))
                .thenReturn(Arrays.asList());

        // Act
        String result = exportService.exportTransactionsToCsv(username, startDate, endDate);

        // Assert
        assertNotNull(result);
        assertTrue(result.contains("Date,Title,Category,Type,Amount,Description"));
        // Should only contain headers when no transactions
        assertEquals(1, result.split("\n").length);
    }

    @Test
    void testExportAnalyticsToPdf_Success() throws Exception {
        // Arrange
        String username = "testuser";
        
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(testUser));
        when(transactionService.getFinancialSummary(username)).thenReturn(
                java.util.Map.of(
                        "totalIncome", new BigDecimal("3000.00"),
                        "totalExpenses", new BigDecimal("150.00"),
                        "balance", new BigDecimal("2850.00"),
                        "transactionCount", 2L
                )
        );
        when(transactionService.getExpenseBreakdown(username)).thenReturn(Arrays.asList());
        when(transactionService.getMonthlyTrends(6, username)).thenReturn(Arrays.asList());

        // Act
        byte[] result = exportService.exportAnalyticsToPdf(username);

        // Assert
        assertNotNull(result);
        assertTrue(result.length > 0);
        verify(userRepository).findByUsername(username);
        verify(transactionService).getFinancialSummary(username);
        verify(transactionService).getExpenseBreakdown(username);
        verify(transactionService).getMonthlyTrends(6, username);
    }

    @Test
    void testExportAnalyticsToPdf_UserNotFound() {
        // Arrange
        String username = "nonexistent";
        
        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            exportService.exportAnalyticsToPdf(username);
        });

        assertEquals("User not found", exception.getMessage());
        verify(userRepository).findByUsername(username);
        verifyNoInteractions(transactionService);
    }

    @Test
    void testExportTransactionsToCsv_WithNullDates() throws Exception {
        // Arrange
        String username = "testuser";

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(testUser));
        when(transactionRepository.findByUserIdOrderByTransactionDateDesc(testUser.getId()))
                .thenReturn(testTransactions);

        // Act
        String result = exportService.exportTransactionsToCsv(username, null, null);

        // Assert
        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertTrue(result.contains("Date,Title,Category,Type,Amount,Description"));
        verify(userRepository).findByUsername(username);
        verify(transactionRepository).findByUserIdOrderByTransactionDateDesc(testUser.getId());
    }

    @Test
    void testExportTransactionsToPdf_WithNullDates() throws Exception {
        // Arrange
        String username = "testuser";

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(testUser));
        when(transactionRepository.findByUserIdOrderByTransactionDateDesc(testUser.getId()))
                .thenReturn(testTransactions);
        when(transactionRepository.getTotalIncomeByUser(testUser.getId()))
                .thenReturn(new BigDecimal("3000.00"));
        when(transactionRepository.getTotalExpensesByUser(testUser.getId()))
                .thenReturn(new BigDecimal("150.00"));
        when(transactionRepository.getTransactionCountByUser(testUser.getId()))
                .thenReturn(2L);
        when(transactionRepository.getExpenseBreakdownByCategory(testUser.getId()))
                .thenReturn(Arrays.asList());

        // Act
        byte[] result = exportService.exportTransactionsToPdf(username, null, null);

        // Assert
        assertNotNull(result);
        assertTrue(result.length > 0);
        verify(userRepository).findByUsername(username);
        verify(transactionRepository).findByUserIdOrderByTransactionDateDesc(testUser.getId());
    }
}