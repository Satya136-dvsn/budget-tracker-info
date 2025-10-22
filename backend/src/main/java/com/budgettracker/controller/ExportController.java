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

    // Export comprehensive report
    @GetMapping("/comprehensive")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<byte[]> exportComprehensiveReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            
            // Validate date range
            if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
                return ResponseEntity.badRequest().build();
            }
            
            // Check for reasonable date range (not more than 5 years)
            if (startDate != null && endDate != null) {
                long daysBetween = java.time.temporal.ChronoUnit.DAYS.between(startDate, endDate);
                if (daysBetween > 1825) { // 5 years
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
                }
            }
            
            byte[] pdfBytes = exportService.generateComprehensiveReport(username, startDate, endDate);
            
            if (pdfBytes.length > 50 * 1024 * 1024) { // 50MB limit
                return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).build();
            }
            
            String filename = generateComprehensiveFilename(startDate, endDate);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", filename);
            headers.setContentLength(pdfBytes.length);

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Export to Excel
    @GetMapping("/excel")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<byte[]> exportToExcel(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            
            // Validate date range
            if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
                return ResponseEntity.badRequest().build();
            }
            
            byte[] excelBytes = exportService.exportToExcel(username, startDate, endDate);
            
            if (excelBytes.length > 100 * 1024 * 1024) { // 100MB limit for Excel
                return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).build();
            }
            
            String filename = generateExcelFilename(startDate, endDate);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.setContentDispositionFormData("attachment", filename);
            headers.setContentLength(excelBytes.length);

            return new ResponseEntity<>(excelBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Export budget report
    @GetMapping("/budget")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<byte[]> exportBudgetReport(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            
            // Validate month and year
            if (month != null && (month < 1 || month > 12)) {
                return ResponseEntity.badRequest().build();
            }
            
            if (year != null && (year < 2000 || year > LocalDate.now().getYear() + 1)) {
                return ResponseEntity.badRequest().build();
            }
            
            // Default to current month/year if not provided
            if (month == null) month = LocalDate.now().getMonthValue();
            if (year == null) year = LocalDate.now().getYear();
            
            byte[] pdfBytes = exportService.generateBudgetReport(username, month, year);
            
            String filename = String.format("budget-report-%s-%d.pdf", getMonthName(month).toLowerCase(), year);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", filename);
            headers.setContentLength(pdfBytes.length);

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Export savings goals report
    @GetMapping("/savings-goals")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<byte[]> exportSavingsGoalsReport(Authentication authentication) {
        try {
            String username = authentication.getName();
            
            byte[] pdfBytes = exportService.generateSavingsGoalsReport(username);
            
            String filename = "savings-goals-report-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) + ".pdf";
            
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
            
            // Validate date range
            if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
                return ResponseEntity.badRequest()
                        .body(java.util.Map.of("error", "Start date cannot be after end date"));
            }
            
            java.util.Map<String, Object> preview = new java.util.HashMap<>();
            preview.put("startDate", startDate != null ? startDate.toString() : "All time");
            preview.put("endDate", endDate != null ? endDate.toString() : "All time");
            preview.put("username", username);
            preview.put("exportDate", LocalDate.now().toString());
            
            // Add estimated data size
            if (startDate != null && endDate != null) {
                long daysBetween = java.time.temporal.ChronoUnit.DAYS.between(startDate, endDate);
                preview.put("estimatedDays", daysBetween);
                preview.put("estimatedSize", estimateExportSize(daysBetween));
            }
            
            return ResponseEntity.ok(preview);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("error", "Error generating export preview: " + e.getMessage()));
        }
    }

    // Validate export request
    @PostMapping("/validate")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> validateExportRequest(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String format,
            Authentication authentication) {
        try {
            java.util.Map<String, Object> validation = new java.util.HashMap<>();
            java.util.List<String> errors = new java.util.ArrayList<>();
            java.util.List<String> warnings = new java.util.ArrayList<>();
            
            // Validate date range
            if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
                errors.add("Start date cannot be after end date");
            }
            
            // Check for very large date ranges
            if (startDate != null && endDate != null) {
                long daysBetween = java.time.temporal.ChronoUnit.DAYS.between(startDate, endDate);
                if (daysBetween > 1825) { // 5 years
                    errors.add("Date range cannot exceed 5 years");
                } else if (daysBetween > 365) { // 1 year
                    warnings.add("Large date range may result in slower export processing");
                }
            }
            
            // Validate format
            if (format != null && !java.util.Arrays.asList("pdf", "csv", "excel").contains(format.toLowerCase())) {
                errors.add("Invalid export format. Supported formats: PDF, CSV, Excel");
            }
            
            validation.put("valid", errors.isEmpty());
            validation.put("errors", errors);
            validation.put("warnings", warnings);
            
            if (startDate != null && endDate != null) {
                long daysBetween = java.time.temporal.ChronoUnit.DAYS.between(startDate, endDate);
                validation.put("estimatedProcessingTime", estimateProcessingTime(daysBetween));
                validation.put("estimatedFileSize", estimateExportSize(daysBetween));
            }
            
            return ResponseEntity.ok(validation);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("error", "Error validating export request: " + e.getMessage()));
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

    private String generateComprehensiveFilename(LocalDate startDate, LocalDate endDate) {
        StringBuilder filename = new StringBuilder("comprehensive-financial-report");
        
        if (startDate != null && endDate != null) {
            filename.append("-")
                    .append(startDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")))
                    .append("-to-")
                    .append(endDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        } else {
            filename.append("-")
                    .append(LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        }
        
        filename.append(".pdf");
        return filename.toString();
    }

    private String generateExcelFilename(LocalDate startDate, LocalDate endDate) {
        StringBuilder filename = new StringBuilder("financial-data");
        
        if (startDate != null && endDate != null) {
            filename.append("-")
                    .append(startDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")))
                    .append("-to-")
                    .append(endDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        } else {
            filename.append("-")
                    .append(LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        }
        
        filename.append(".xlsx");
        return filename.toString();
    }

    private String getMonthName(Integer month) {
        String[] months = {"", "January", "February", "March", "April", "May", "June",
                          "July", "August", "September", "October", "November", "December"};
        return months[month];
    }

    private String estimateExportSize(long days) {
        // Rough estimation based on average data per day
        long estimatedKB = days * 2; // Assume ~2KB per day on average
        
        if (estimatedKB < 1024) {
            return estimatedKB + " KB";
        } else if (estimatedKB < 1024 * 1024) {
            return String.format("%.1f MB", estimatedKB / 1024.0);
        } else {
            return String.format("%.1f GB", estimatedKB / (1024.0 * 1024.0));
        }
    }

    private String estimateProcessingTime(long days) {
        // Rough estimation based on data volume
        if (days <= 30) {
            return "< 30 seconds";
        } else if (days <= 365) {
            return "30-60 seconds";
        } else if (days <= 1825) {
            return "1-3 minutes";
        } else {
            return "> 3 minutes";
        }
    }
}