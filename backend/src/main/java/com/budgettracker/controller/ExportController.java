package com.budgettracker.controller;

import com.budgettracker.service.ExportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/export")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class ExportController {

    @Autowired
    private ExportService exportService;

    // Export transactions to PDF
    @GetMapping("/transactions/pdf")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<byte[]> exportTransactionsToPdf(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            byte[] pdfBytes = exportService.exportTransactionsToPdf(username, startDate, endDate);

            String filename = generateTransactionFilename("pdf", startDate, endDate);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", filename);
            headers.setContentLength(pdfBytes.length);

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Export transactions to CSV
    @GetMapping("/transactions/csv")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<String> exportTransactionsToCsv(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            String csvContent = exportService.exportTransactionsToCsv(username, startDate, endDate);

            String filename = generateTransactionFilename("csv", startDate, endDate);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("text/csv"));
            headers.setContentDispositionFormData("attachment", filename);

            return new ResponseEntity<>(csvContent, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Export analytics report to PDF
    @GetMapping("/analytics/pdf")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<byte[]> exportAnalyticsToPdf(Authentication authentication) {
        try {
            String username = authentication.getName();
            byte[] pdfBytes = exportService.exportAnalyticsToPdf(username);

            String filename = "financial-analytics-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) + ".pdf";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", filename);
            headers.setContentLength(pdfBytes.length);

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get export preview data
    @GetMapping("/preview")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getExportPreview(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            // This could return a summary of what would be exported
            // For now, we'll return basic info
            
            java.util.Map<String, Object> preview = new java.util.HashMap<>();
            preview.put("startDate", startDate != null ? startDate.toString() : "All time");
            preview.put("endDate", endDate != null ? endDate.toString() : "All time");
            preview.put("username", username);
            preview.put("exportDate", LocalDate.now().toString());
            
            return ResponseEntity.ok(preview);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error generating export preview: " + e.getMessage());
        }
    }

    private String generateTransactionFilename(String extension, LocalDate startDate, LocalDate endDate) {
        StringBuilder filename = new StringBuilder("transactions");
        
        if (startDate != null && endDate != null) {
            filename.append("-")
                    .append(startDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")))
                    .append("-to-")
                    .append(endDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        } else {
            filename.append("-")
                    .append(LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        }
        
        filename.append(".").append(extension);
        return filename.toString();
    }
}