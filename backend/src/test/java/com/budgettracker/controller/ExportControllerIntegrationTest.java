package com.budgettracker.controller;

import com.budgettracker.service.ExportService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ExportController.class)
class ExportControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ExportService exportService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    void testExportTransactionsToPdf_Success() throws Exception {
        // Arrange
        byte[] pdfContent = "PDF content".getBytes();
        when(exportService.exportTransactionsToPdf(eq("testuser"), any(), any()))
                .thenReturn(pdfContent);

        // Act & Assert
        mockMvc.perform(get("/api/export/transactions/pdf")
                        .param("startDate", "2024-01-01")
                        .param("endDate", "2024-01-31")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF))
                .andExpect(header().exists("Content-Disposition"))
                .andExpect(content().bytes(pdfContent));

        verify(exportService).exportTransactionsToPdf(eq("testuser"), any(LocalDate.class), any(LocalDate.class));
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    void testExportTransactionsToPdf_WithoutDateParams() throws Exception {
        // Arrange
        byte[] pdfContent = "PDF content".getBytes();
        when(exportService.exportTransactionsToPdf(eq("testuser"), isNull(), isNull()))
                .thenReturn(pdfContent);

        // Act & Assert
        mockMvc.perform(get("/api/export/transactions/pdf")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF))
                .andExpect(content().bytes(pdfContent));

        verify(exportService).exportTransactionsToPdf(eq("testuser"), isNull(), isNull());
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    void testExportTransactionsToCsv_Success() throws Exception {
        // Arrange
        String csvContent = "Date,Title,Category,Type,Amount,Description\n2024-01-01,Test,Food,EXPENSE,100.00,Test transaction";
        when(exportService.exportTransactionsToCsv(eq("testuser"), any(), any()))
                .thenReturn(csvContent);

        // Act & Assert
        mockMvc.perform(get("/api/export/transactions/csv")
                        .param("startDate", "2024-01-01")
                        .param("endDate", "2024-01-31")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().contentType("text/csv"))
                .andExpect(header().exists("Content-Disposition"))
                .andExpect(content().string(csvContent));

        verify(exportService).exportTransactionsToCsv(eq("testuser"), any(LocalDate.class), any(LocalDate.class));
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    void testExportAnalyticsToPdf_Success() throws Exception {
        // Arrange
        byte[] pdfContent = "Analytics PDF content".getBytes();
        when(exportService.exportAnalyticsToPdf("testuser"))
                .thenReturn(pdfContent);

        // Act & Assert
        mockMvc.perform(get("/api/export/analytics/pdf")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF))
                .andExpect(header().exists("Content-Disposition"))
                .andExpect(content().bytes(pdfContent));

        verify(exportService).exportAnalyticsToPdf("testuser");
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    void testGetExportPreview_Success() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/export/preview")
                        .param("startDate", "2024-01-01")
                        .param("endDate", "2024-01-31")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.startDate").value("2024-01-01"))
                .andExpect(jsonPath("$.endDate").value("2024-01-31"))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.exportDate").exists());
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    void testGetExportPreview_WithoutDateParams() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/export/preview")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.startDate").value("All time"))
                .andExpect(jsonPath("$.endDate").value("All time"))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.exportDate").exists());
    }

    @Test
    void testExportTransactionsToPdf_Unauthorized() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/export/transactions/pdf")
                        .with(csrf()))
                .andExpect(status().isUnauthorized());

        verifyNoInteractions(exportService);
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    void testExportTransactionsToPdf_ServiceException() throws Exception {
        // Arrange
        when(exportService.exportTransactionsToPdf(eq("testuser"), any(), any()))
                .thenThrow(new RuntimeException("Export failed"));

        // Act & Assert
        mockMvc.perform(get("/api/export/transactions/pdf")
                        .with(csrf()))
                .andExpect(status().isInternalServerError());

        verify(exportService).exportTransactionsToPdf(eq("testuser"), any(), any());
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    void testExportTransactionsToCsv_ServiceException() throws Exception {
        // Arrange
        when(exportService.exportTransactionsToCsv(eq("testuser"), any(), any()))
                .thenThrow(new RuntimeException("CSV export failed"));

        // Act & Assert
        mockMvc.perform(get("/api/export/transactions/csv")
                        .with(csrf()))
                .andExpect(status().isInternalServerError());

        verify(exportService).exportTransactionsToCsv(eq("testuser"), any(), any());
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    void testExportAnalyticsToPdf_ServiceException() throws Exception {
        // Arrange
        when(exportService.exportAnalyticsToPdf("testuser"))
                .thenThrow(new RuntimeException("Analytics export failed"));

        // Act & Assert
        mockMvc.perform(get("/api/export/analytics/pdf")
                        .with(csrf()))
                .andExpect(status().isInternalServerError());

        verify(exportService).exportAnalyticsToPdf("testuser");
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"ADMIN"})
    void testExportTransactionsToPdf_AdminRole() throws Exception {
        // Arrange
        byte[] pdfContent = "PDF content".getBytes();
        when(exportService.exportTransactionsToPdf(eq("testuser"), any(), any()))
                .thenReturn(pdfContent);

        // Act & Assert
        mockMvc.perform(get("/api/export/transactions/pdf")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF));

        verify(exportService).exportTransactionsToPdf(eq("testuser"), any(), any());
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    void testExportTransactionsToPdf_InvalidDateFormat() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/export/transactions/pdf")
                        .param("startDate", "invalid-date")
                        .param("endDate", "2024-01-31")
                        .with(csrf()))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(exportService);
    }
}