package com.budgettracker.service;

import com.budgettracker.model.Budget;
import com.budgettracker.model.SavingsGoal;
import com.budgettracker.model.Transaction;
import com.budgettracker.model.User;
import com.budgettracker.repository.BudgetRepository;
import com.budgettracker.repository.SavingsGoalRepository;
import com.budgettracker.repository.TransactionRepository;
import com.budgettracker.repository.UserRepository;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.StringWriter;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
public class ExportService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private SavingsGoalRepository savingsGoalRepository;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private AnalyticsService analyticsService;

    public byte[] exportTransactionsToPdf(String username, LocalDate startDate, LocalDate endDate) throws IOException {
        // Validate inputs
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be null or empty");
        }
        
        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date cannot be after end date");
        }
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        try {
            List<Transaction> transactions = getTransactionsInDateRange(user.getId(), startDate, endDate);
        
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Add title
        document.add(new Paragraph("Financial Report")
                .setFontSize(20)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER));

        // Add date range
        String dateRange;
        if (startDate != null && endDate != null) {
            dateRange = String.format("Period: %s to %s", 
                    startDate.format(DateTimeFormatter.ofPattern("MMM dd, yyyy")),
                    endDate.format(DateTimeFormatter.ofPattern("MMM dd, yyyy")));
        } else {
            dateRange = "Period: All Time";
        }
        document.add(new Paragraph(dateRange)
                .setFontSize(12)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(20));

        // Add summary statistics
        addSummarySection(document, user.getId(), startDate, endDate);

        // Add transactions table
        addTransactionsTable(document, transactions);

            // Add category breakdown
            addCategoryBreakdown(document, user.getId());

            document.close();
            
            byte[] result = baos.toByteArray();
            
            // Validate file size
            if (result.length > 25 * 1024 * 1024) { // 25MB limit for transaction PDFs
                throw new IOException("Generated PDF exceeds maximum file size limit");
            }
            
            return result;
        } catch (Exception e) {
            throw new IOException("Error generating transaction PDF: " + e.getMessage(), e);
        }
    }

    public String exportTransactionsToCsv(String username, LocalDate startDate, LocalDate endDate) throws IOException {
        // Validate inputs
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be null or empty");
        }
        
        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date cannot be after end date");
        }
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        try {
            List<Transaction> transactions = getTransactionsInDateRange(user.getId(), startDate, endDate);

        StringWriter stringWriter = new StringWriter();
        CSVFormat csvFormat = CSVFormat.DEFAULT.builder()
                .setHeader("Date", "Title", "Category", "Type", "Amount", "Description")
                .build();

        try (CSVPrinter csvPrinter = new CSVPrinter(stringWriter, csvFormat)) {
            for (Transaction transaction : transactions) {
                csvPrinter.printRecord(
                        transaction.getTransactionDate().toLocalDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")),
                        transaction.getTitle(),
                        transaction.getCategory(),
                        transaction.getType().toString(),
                        transaction.getAmount().toString(),
                        transaction.getDescription() != null ? transaction.getDescription() : ""
                );
            }
            
            String result = stringWriter.toString();
            
            // Validate CSV size (10MB limit)
            if (result.length() > 10 * 1024 * 1024) {
                throw new IOException("Generated CSV exceeds maximum file size limit");
            }
            
            return result;
        } catch (Exception e) {
            throw new IOException("Error generating CSV export: " + e.getMessage(), e);
        }
    }

    public byte[] exportAnalyticsToPdf(String username) throws IOException {
        // Validate inputs
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be null or empty");
        }
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        try {

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Add title
        document.add(new Paragraph("Financial Analytics Report")
                .setFontSize(20)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER));

        // Add generation date
        document.add(new Paragraph("Generated on: " + LocalDate.now().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")))
                .setFontSize(12)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(20));

        // Add financial summary
        Map<String, Object> summary = transactionService.getFinancialSummary(username);
        addFinancialSummary(document, summary);

        // Add expense breakdown
        List<Map<String, Object>> breakdown = transactionService.getExpenseBreakdown(username);
        addExpenseBreakdownTable(document, breakdown);

            // Add monthly trends
            List<Map<String, Object>> trends = transactionService.getMonthlyTrends(6, username);
            addMonthlyTrendsTable(document, trends);

            document.close();
            
            byte[] result = baos.toByteArray();
            
            // Validate file size
            if (result.length > 25 * 1024 * 1024) { // 25MB limit
                throw new IOException("Generated analytics PDF exceeds maximum file size limit");
            }
            
            return result;
        } catch (Exception e) {
            throw new IOException("Error generating analytics PDF: " + e.getMessage(), e);
        }
    }

    // NEW COMPREHENSIVE REPORTING METHODS

    /**
     * Generate a comprehensive financial report with charts and detailed analysis
     */
    public byte[] generateComprehensiveReport(String username, LocalDate startDate, LocalDate endDate) throws IOException {
        // Validate inputs
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be null or empty");
        }
        
        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date cannot be after end date");
        }
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

        // Enhanced title with better formatting
        document.add(new Paragraph("COMPREHENSIVE FINANCIAL REPORT")
                .setFontSize(24)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER)
                .setFontColor(ColorConstants.DARK_GRAY));

        // Report metadata
        addReportMetadata(document, user, startDate, endDate);

        // Executive Summary
        addExecutiveSummary(document, user, startDate, endDate);

        // Financial Health Analysis
        addFinancialHealthAnalysis(document, user);

        // Transaction Analysis
        addTransactionAnalysis(document, user, startDate, endDate);

        // Budget Performance
        addBudgetPerformanceAnalysis(document, user);

        // Savings Goals Progress
        addSavingsGoalsAnalysis(document, user);

        // Monthly Trends Analysis
        addMonthlyTrendsAnalysis(document, user);

        // Category Analysis
        addCategoryAnalysis(document, user, startDate, endDate);

            // Recommendations
            addRecommendations(document, user);

            document.close();
            
            byte[] result = baos.toByteArray();
            
            // Validate file size (50MB limit)
            if (result.length > 50 * 1024 * 1024) {
                throw new IOException("Generated report exceeds maximum file size limit");
            }
            
            return result;
        } catch (Exception e) {
            throw new IOException("Error generating comprehensive report: " + e.getMessage(), e);
        }
    }

    /**
     * Export data to Excel with multiple sheets and formatting
     */
    public byte[] exportToExcel(String username, LocalDate startDate, LocalDate endDate) throws IOException {
        // Validate inputs
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be null or empty");
        }
        
        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date cannot be after end date");
        }
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        try (Workbook workbook = new XSSFWorkbook()) {
            // Create styles
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle currencyStyle = createCurrencyStyle(workbook);
            CellStyle dateStyle = createDateStyle(workbook);

            // Create sheets
            createTransactionsSheet(workbook, user, startDate, endDate, headerStyle, currencyStyle, dateStyle);
            createBudgetSheet(workbook, user, headerStyle, currencyStyle);
            createSavingsGoalsSheet(workbook, user, headerStyle, currencyStyle, dateStyle);
            createSummarySheet(workbook, user, startDate, endDate, headerStyle, currencyStyle);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            workbook.write(baos);
            
            byte[] result = baos.toByteArray();
            
            // Validate file size (100MB limit for Excel)
            if (result.length > 100 * 1024 * 1024) {
                throw new IOException("Generated Excel file exceeds maximum file size limit");
            }
            
            return result;
        } catch (Exception e) {
            throw new IOException("Error generating Excel export: " + e.getMessage(), e);
        }
    }

    /**
     * Generate budget-specific report
     */
    public byte[] generateBudgetReport(String username, Integer month, Integer year) throws IOException {
        // Validate inputs
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be null or empty");
        }
        
        if (month != null && (month < 1 || month > 12)) {
            throw new IllegalArgumentException("Month must be between 1 and 12");
        }
        
        if (year != null && (year < 2000 || year > LocalDate.now().getYear() + 1)) {
            throw new IllegalArgumentException("Year must be between 2000 and " + (LocalDate.now().getYear() + 1));
        }
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Title
        document.add(new Paragraph("BUDGET PERFORMANCE REPORT")
                .setFontSize(20)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER));

        // Period
        String period = String.format("%s %d", getMonthName(month), year);
        document.add(new Paragraph("Period: " + period)
                .setFontSize(14)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(20));

        // Budget analysis
        addDetailedBudgetAnalysis(document, user, month, year);

        document.close();
        return baos.toByteArray();
    }

    /**
     * Generate savings goals report
     */
    public byte[] generateSavingsGoalsReport(String username) throws IOException {
        // Validate inputs
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be null or empty");
        }
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Title
        document.add(new Paragraph("SAVINGS GOALS PROGRESS REPORT")
                .setFontSize(20)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER));

        // Generation date
        document.add(new Paragraph("Generated on: " + LocalDate.now().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy")))
                .setFontSize(12)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(20));

        // Savings goals analysis
        addDetailedSavingsGoalsAnalysis(document, user);

        document.close();
        return baos.toByteArray();
    }

    // PRIVATE HELPER METHODS FOR COMPREHENSIVE REPORTING

    private void addReportMetadata(Document document, User user, LocalDate startDate, LocalDate endDate) {
        String dateRange;
        if (startDate != null && endDate != null) {
            dateRange = String.format("Period: %s to %s", 
                    startDate.format(DateTimeFormatter.ofPattern("MMMM dd, yyyy")),
                    endDate.format(DateTimeFormatter.ofPattern("MMMM dd, yyyy")));
        } else {
            dateRange = "Period: All Time";
        }
        
        document.add(new Paragraph(dateRange)
                .setFontSize(14)
                .setTextAlignment(TextAlignment.CENTER));
        
        document.add(new Paragraph("Generated on: " + LocalDate.now().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy")))
                .setFontSize(12)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(30));
    }

    private void addExecutiveSummary(Document document, User user, LocalDate startDate, LocalDate endDate) {
        document.add(new Paragraph("EXECUTIVE SUMMARY")
                .setFontSize(18)
                .setBold()
                .setMarginTop(20)
                .setMarginBottom(10));

        // Get financial summary data
        Map<String, Object> summary = transactionService.getFinancialSummary(user.getUsername());
        
        Table summaryTable = new Table(UnitValue.createPercentArray(new float[]{1, 1}))
                .setWidth(UnitValue.createPercentValue(100));

        // Add summary data with better formatting
        addSummaryRow(summaryTable, "Total Income", "₹" + summary.get("totalIncome").toString(), ColorConstants.GREEN);
        addSummaryRow(summaryTable, "Total Expenses", "₹" + summary.get("totalExpenses").toString(), ColorConstants.RED);
        addSummaryRow(summaryTable, "Net Balance", "₹" + summary.get("balance").toString(), 
                     ((BigDecimal) summary.get("balance")).compareTo(BigDecimal.ZERO) >= 0 ? ColorConstants.GREEN : ColorConstants.RED);
        addSummaryRow(summaryTable, "Total Transactions", summary.get("transactionCount").toString(), ColorConstants.BLACK);

        document.add(summaryTable);
    }

    private void addSummaryRow(Table table, String label, String value, com.itextpdf.kernel.colors.Color color) {
        table.addCell(new Cell().add(new Paragraph(label)).setBold());
        table.addCell(new Cell().add(new Paragraph(value)).setFontColor(color).setBold());
    }

    private void addFinancialHealthAnalysis(Document document, User user) {
        try {
            document.add(new Paragraph("FINANCIAL HEALTH ANALYSIS")
                    .setFontSize(18)
                    .setBold()
                    .setMarginTop(20)
                    .setMarginBottom(10));

            Map<String, Object> healthData = analyticsService.getFinancialHealth(user.getUsername());
            
            // Health score
            Integer healthScore = (Integer) healthData.get("healthScore");
            document.add(new Paragraph("Overall Health Score: " + healthScore + "/100")
                    .setFontSize(14)
                    .setBold()
                    .setFontColor(getHealthScoreColor(healthScore)));

            // Factor scores
            @SuppressWarnings("unchecked")
            Map<String, Integer> factorScores = (Map<String, Integer>) healthData.get("factorScores");
            if (factorScores != null) {
                Table factorTable = new Table(UnitValue.createPercentArray(new float[]{1, 1}))
                        .setWidth(UnitValue.createPercentValue(100));
                
                for (Map.Entry<String, Integer> entry : factorScores.entrySet()) {
                    factorTable.addCell(new Cell().add(new Paragraph(formatFactorName(entry.getKey()))));
                    factorTable.addCell(new Cell().add(new Paragraph(entry.getValue() + "/100"))
                            .setFontColor(getHealthScoreColor(entry.getValue())));
                }
                
                document.add(factorTable);
            }

        } catch (Exception e) {
            document.add(new Paragraph("Financial health data unavailable."));
        }
    }

    private com.itextpdf.kernel.colors.Color getHealthScoreColor(Integer score) {
        if (score >= 80) return ColorConstants.GREEN;
        if (score >= 60) return ColorConstants.ORANGE;
        return ColorConstants.RED;
    }

    private String formatFactorName(String factorName) {
        return factorName.replaceAll("([A-Z])", " $1")
                        .replaceAll("^.", m -> m.group().toUpperCase())
                        .trim();
    }

    private void addTransactionAnalysis(Document document, User user, LocalDate startDate, LocalDate endDate) {
        document.add(new Paragraph("TRANSACTION ANALYSIS")
                .setFontSize(18)
                .setBold()
                .setMarginTop(20)
                .setMarginBottom(10));

        List<Transaction> transactions = getTransactionsInDateRange(user.getId(), startDate, endDate);
        
        if (transactions.isEmpty()) {
            document.add(new Paragraph("No transactions found for the selected period."));
            return;
        }

        // Transaction statistics
        long incomeCount = transactions.stream().filter(t -> t.getType() == Transaction.TransactionType.INCOME).count();
        long expenseCount = transactions.stream().filter(t -> t.getType() == Transaction.TransactionType.EXPENSE).count();
        
        Table statsTable = new Table(UnitValue.createPercentArray(new float[]{1, 1}))
                .setWidth(UnitValue.createPercentValue(100));
        
        statsTable.addCell(new Cell().add(new Paragraph("Total Transactions")).setBold());
        statsTable.addCell(new Cell().add(new Paragraph(String.valueOf(transactions.size()))));
        statsTable.addCell(new Cell().add(new Paragraph("Income Transactions")).setBold());
        statsTable.addCell(new Cell().add(new Paragraph(String.valueOf(incomeCount))));
        statsTable.addCell(new Cell().add(new Paragraph("Expense Transactions")).setBold());
        statsTable.addCell(new Cell().add(new Paragraph(String.valueOf(expenseCount))));
        
        document.add(statsTable);
        
        // Recent transactions table (limited to 10)
        document.add(new Paragraph("Recent Transactions")
                .setFontSize(14)
                .setBold()
                .setMarginTop(15));
        
        addTransactionsTable(document, transactions.stream().limit(10).toList());
    }

    private void addBudgetPerformanceAnalysis(Document document, User user) {
        document.add(new Paragraph("BUDGET PERFORMANCE")
                .setFontSize(18)
                .setBold()
                .setMarginTop(20)
                .setMarginBottom(10));

        LocalDate now = LocalDate.now();
        List<Budget> currentBudgets = budgetRepository.findByUserAndMonthAndYearOrderByCategoryAsc(
                user, now.getMonthValue(), now.getYear());

        if (currentBudgets.isEmpty()) {
            document.add(new Paragraph("No budgets set for the current month."));
            return;
        }

        Table budgetTable = new Table(UnitValue.createPercentArray(new float[]{2, 1, 1, 1, 1}))
                .setWidth(UnitValue.createPercentValue(100));

        // Headers
        budgetTable.addHeaderCell(new Cell().add(new Paragraph("Category")).setBold());
        budgetTable.addHeaderCell(new Cell().add(new Paragraph("Budget")).setBold());
        budgetTable.addHeaderCell(new Cell().add(new Paragraph("Spent")).setBold());
        budgetTable.addHeaderCell(new Cell().add(new Paragraph("Remaining")).setBold());
        budgetTable.addHeaderCell(new Cell().add(new Paragraph("Status")).setBold());

        for (Budget budget : currentBudgets) {
            budgetTable.addCell(new Cell().add(new Paragraph(budget.getCategory())));
            budgetTable.addCell(new Cell().add(new Paragraph("₹" + budget.getBudgetAmount())));
            budgetTable.addCell(new Cell().add(new Paragraph("₹" + budget.getSpentAmount())));
            budgetTable.addCell(new Cell().add(new Paragraph("₹" + budget.getRemainingAmount())));
            
            String status = budget.isOverBudget() ? "Over Budget" : "On Track";
            com.itextpdf.kernel.colors.Color statusColor = budget.isOverBudget() ? ColorConstants.RED : ColorConstants.GREEN;
            budgetTable.addCell(new Cell().add(new Paragraph(status)).setFontColor(statusColor));
        }

        document.add(budgetTable);
    }

    private void addSavingsGoalsAnalysis(Document document, User user) {
        document.add(new Paragraph("SAVINGS GOALS PROGRESS")
                .setFontSize(18)
                .setBold()
                .setMarginTop(20)
                .setMarginBottom(10));

        List<SavingsGoal> savingsGoals = savingsGoalRepository.findByUserOrderByCreatedAtDesc(user);

        if (savingsGoals.isEmpty()) {
            document.add(new Paragraph("No savings goals found."));
            return;
        }

        Table goalsTable = new Table(UnitValue.createPercentArray(new float[]{2, 1, 1, 1, 1, 1}))
                .setWidth(UnitValue.createPercentValue(100));

        // Headers
        goalsTable.addHeaderCell(new Cell().add(new Paragraph("Goal")).setBold());
        goalsTable.addHeaderCell(new Cell().add(new Paragraph("Target")).setBold());
        goalsTable.addHeaderCell(new Cell().add(new Paragraph("Current")).setBold());
        goalsTable.addHeaderCell(new Cell().add(new Paragraph("Progress")).setBold());
        goalsTable.addHeaderCell(new Cell().add(new Paragraph("Target Date")).setBold());
        goalsTable.addHeaderCell(new Cell().add(new Paragraph("Status")).setBold());

        for (SavingsGoal goal : savingsGoals) {
            goalsTable.addCell(new Cell().add(new Paragraph(goal.getName())));
            goalsTable.addCell(new Cell().add(new Paragraph("₹" + goal.getTargetAmount())));
            goalsTable.addCell(new Cell().add(new Paragraph("₹" + goal.getCurrentAmount())));
            goalsTable.addCell(new Cell().add(new Paragraph(String.format("%.1f%%", goal.getProgressPercentage()))));
            goalsTable.addCell(new Cell().add(new Paragraph(
                    goal.getTargetDate() != null ? goal.getTargetDate().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")) : "No deadline")));
            
            String status = goal.getStatus().toString();
            com.itextpdf.kernel.colors.Color statusColor = goal.getStatus() == SavingsGoal.GoalStatus.COMPLETED ? 
                    ColorConstants.GREEN : ColorConstants.BLUE;
            goalsTable.addCell(new Cell().add(new Paragraph(status)).setFontColor(statusColor));
        }

        document.add(goalsTable);
    }

    private void addMonthlyTrendsAnalysis(Document document, User user) {
        try {
            document.add(new Paragraph("MONTHLY TRENDS ANALYSIS")
                    .setFontSize(18)
                    .setBold()
                    .setMarginTop(20)
                    .setMarginBottom(10));

            Map<String, Object> trendsData = analyticsService.getMonthlyTrends(user.getUsername(), 6);
            
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> trends = (List<Map<String, Object>>) trendsData.get("trends");
            
            if (trends == null || trends.isEmpty()) {
                document.add(new Paragraph("No monthly trends data available."));
                return;
            }

            addMonthlyTrendsTable(document, trends);

        } catch (Exception e) {
            document.add(new Paragraph("Monthly trends data unavailable."));
        }
    }

    private void addCategoryAnalysis(Document document, User user, LocalDate startDate, LocalDate endDate) {
        try {
            document.add(new Paragraph("CATEGORY ANALYSIS")
                    .setFontSize(18)
                    .setBold()
                    .setMarginTop(20)
                    .setMarginBottom(10));

            Map<String, Object> categoryData = analyticsService.getCategoryBreakdown(user.getUsername(), startDate, endDate);
            
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> categories = (List<Map<String, Object>>) categoryData.get("categories");
            
            if (categories == null || categories.isEmpty()) {
                document.add(new Paragraph("No category data available."));
                return;
            }

            Table categoryTable = new Table(UnitValue.createPercentArray(new float[]{2, 1, 1, 1}))
                    .setWidth(UnitValue.createPercentValue(100));

            categoryTable.addHeaderCell(new Cell().add(new Paragraph("Category")).setBold());
            categoryTable.addHeaderCell(new Cell().add(new Paragraph("Amount")).setBold());
            categoryTable.addHeaderCell(new Cell().add(new Paragraph("Transactions")).setBold());
            categoryTable.addHeaderCell(new Cell().add(new Paragraph("Percentage")).setBold());

            BigDecimal totalAmount = categories.stream()
                    .map(cat -> (BigDecimal) cat.get("totalAmount"))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            for (Map<String, Object> category : categories) {
                BigDecimal amount = (BigDecimal) category.get("totalAmount");
                Integer count = (Integer) category.get("transactionCount");
                double percentage = totalAmount.compareTo(BigDecimal.ZERO) > 0 ? 
                        amount.divide(totalAmount, 4, java.math.RoundingMode.HALF_UP).multiply(new BigDecimal("100")).doubleValue() : 0;

                categoryTable.addCell(new Cell().add(new Paragraph((String) category.get("categoryName"))));
                categoryTable.addCell(new Cell().add(new Paragraph("₹" + amount)));
                categoryTable.addCell(new Cell().add(new Paragraph(count.toString())));
                categoryTable.addCell(new Cell().add(new Paragraph(String.format("%.1f%%", percentage))));
            }

            document.add(categoryTable);

        } catch (Exception e) {
            document.add(new Paragraph("Category analysis data unavailable."));
        }
    }

    private void addRecommendations(Document document, User user) {
        document.add(new Paragraph("FINANCIAL RECOMMENDATIONS")
                .setFontSize(18)
                .setBold()
                .setMarginTop(20)
                .setMarginBottom(10));

        try {
            Map<String, Object> healthData = analyticsService.getFinancialHealth(user.getUsername());
            @SuppressWarnings("unchecked")
            List<String> recommendations = (List<String>) healthData.get("recommendations");
            
            if (recommendations != null && !recommendations.isEmpty()) {
                for (int i = 0; i < recommendations.size(); i++) {
                    document.add(new Paragraph((i + 1) + ". " + recommendations.get(i))
                            .setMarginLeft(20));
                }
            } else {
                document.add(new Paragraph("No specific recommendations available. Keep up the good work!"));
            }
        } catch (Exception e) {
            document.add(new Paragraph("• Review your spending patterns regularly"));
            document.add(new Paragraph("• Set realistic budgets for each category"));
            document.add(new Paragraph("• Track progress towards your savings goals"));
            document.add(new Paragraph("• Consider increasing your emergency fund"));
        }
    }

    // Excel helper methods
    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        return style;
    }

    private CellStyle createCurrencyStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        DataFormat format = workbook.createDataFormat();
        style.setDataFormat(format.getFormat("₹#,##0.00"));
        return style;
    }

    private CellStyle createDateStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        DataFormat format = workbook.createDataFormat();
        style.setDataFormat(format.getFormat("dd/mm/yyyy"));
        return style;
    }

    private void createTransactionsSheet(Workbook workbook, User user, LocalDate startDate, LocalDate endDate,
                                       CellStyle headerStyle, CellStyle currencyStyle, CellStyle dateStyle) {
        Sheet sheet = workbook.createSheet("Transactions");
        List<Transaction> transactions = getTransactionsInDateRange(user.getId(), startDate, endDate);

        // Create header row
        Row headerRow = sheet.createRow(0);
        String[] headers = {"Date", "Title", "Category", "Type", "Amount", "Description"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        // Add data rows
        int rowNum = 1;
        for (Transaction transaction : transactions) {
            Row row = sheet.createRow(rowNum++);
            
            Cell dateCell = row.createCell(0);
            dateCell.setCellValue(transaction.getTransactionDate().toLocalDate());
            dateCell.setCellStyle(dateStyle);
            
            row.createCell(1).setCellValue(transaction.getTitle());
            row.createCell(2).setCellValue(transaction.getCategory());
            row.createCell(3).setCellValue(transaction.getType().toString());
            
            Cell amountCell = row.createCell(4);
            amountCell.setCellValue(transaction.getAmount().doubleValue());
            amountCell.setCellStyle(currencyStyle);
            
            row.createCell(5).setCellValue(transaction.getDescription() != null ? transaction.getDescription() : "");
        }

        // Auto-size columns
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }
    }

    private void createBudgetSheet(Workbook workbook, User user, CellStyle headerStyle, CellStyle currencyStyle) {
        Sheet sheet = workbook.createSheet("Budgets");
        List<Budget> budgets = budgetRepository.findByUserOrderByYearDescMonthDescCategoryAsc(user);

        // Create header row
        Row headerRow = sheet.createRow(0);
        String[] headers = {"Category", "Month", "Year", "Budget Amount", "Spent Amount", "Remaining", "Progress %"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        // Add data rows
        int rowNum = 1;
        for (Budget budget : budgets) {
            Row row = sheet.createRow(rowNum++);
            
            row.createCell(0).setCellValue(budget.getCategory());
            row.createCell(1).setCellValue(getMonthName(budget.getMonth()));
            row.createCell(2).setCellValue(budget.getYear());
            
            Cell budgetAmountCell = row.createCell(3);
            budgetAmountCell.setCellValue(budget.getBudgetAmount().doubleValue());
            budgetAmountCell.setCellStyle(currencyStyle);
            
            Cell spentAmountCell = row.createCell(4);
            spentAmountCell.setCellValue(budget.getSpentAmount().doubleValue());
            spentAmountCell.setCellStyle(currencyStyle);
            
            Cell remainingCell = row.createCell(5);
            remainingCell.setCellValue(budget.getRemainingAmount().doubleValue());
            remainingCell.setCellStyle(currencyStyle);
            
            row.createCell(6).setCellValue(budget.getProgressPercentage());
        }

        // Auto-size columns
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }
    }

    private void createSavingsGoalsSheet(Workbook workbook, User user, CellStyle headerStyle, 
                                       CellStyle currencyStyle, CellStyle dateStyle) {
        Sheet sheet = workbook.createSheet("Savings Goals");
        List<SavingsGoal> goals = savingsGoalRepository.findByUserOrderByCreatedAtDesc(user);

        // Create header row
        Row headerRow = sheet.createRow(0);
        String[] headers = {"Goal Name", "Description", "Target Amount", "Current Amount", "Progress %", "Target Date", "Status"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        // Add data rows
        int rowNum = 1;
        for (SavingsGoal goal : goals) {
            Row row = sheet.createRow(rowNum++);
            
            row.createCell(0).setCellValue(goal.getName());
            row.createCell(1).setCellValue(goal.getDescription() != null ? goal.getDescription() : "");
            
            Cell targetAmountCell = row.createCell(2);
            targetAmountCell.setCellValue(goal.getTargetAmount().doubleValue());
            targetAmountCell.setCellStyle(currencyStyle);
            
            Cell currentAmountCell = row.createCell(3);
            currentAmountCell.setCellValue(goal.getCurrentAmount().doubleValue());
            currentAmountCell.setCellStyle(currencyStyle);
            
            row.createCell(4).setCellValue(goal.getProgressPercentage());
            
            if (goal.getTargetDate() != null) {
                Cell dateCell = row.createCell(5);
                dateCell.setCellValue(goal.getTargetDate());
                dateCell.setCellStyle(dateStyle);
            } else {
                row.createCell(5).setCellValue("No deadline");
            }
            
            row.createCell(6).setCellValue(goal.getStatus().toString());
        }

        // Auto-size columns
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }
    }

    private void createSummarySheet(Workbook workbook, User user, LocalDate startDate, LocalDate endDate,
                                  CellStyle headerStyle, CellStyle currencyStyle) {
        Sheet sheet = workbook.createSheet("Summary");
        
        // Financial summary
        Map<String, Object> summary = transactionService.getFinancialSummary(user.getUsername());
        
        Row titleRow = sheet.createRow(0);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("FINANCIAL SUMMARY");
        titleCell.setCellStyle(headerStyle);
        
        int rowNum = 2;
        
        // Add summary data
        addSummaryRowToExcel(sheet, rowNum++, "Total Income", (BigDecimal) summary.get("totalIncome"), currencyStyle);
        addSummaryRowToExcel(sheet, rowNum++, "Total Expenses", (BigDecimal) summary.get("totalExpenses"), currencyStyle);
        addSummaryRowToExcel(sheet, rowNum++, "Net Balance", (BigDecimal) summary.get("balance"), currencyStyle);
        
        Row transactionCountRow = sheet.createRow(rowNum++);
        transactionCountRow.createCell(0).setCellValue("Total Transactions");
        transactionCountRow.createCell(1).setCellValue(((Number) summary.get("transactionCount")).doubleValue());
        
        // Auto-size columns
        sheet.autoSizeColumn(0);
        sheet.autoSizeColumn(1);
    }

    private void addSummaryRowToExcel(Sheet sheet, int rowNum, String label, BigDecimal value, CellStyle currencyStyle) {
        Row row = sheet.createRow(rowNum);
        row.createCell(0).setCellValue(label);
        Cell valueCell = row.createCell(1);
        valueCell.setCellValue(value.doubleValue());
        valueCell.setCellStyle(currencyStyle);
    }

    private void addDetailedBudgetAnalysis(Document document, User user, Integer month, Integer year) {
        List<Budget> budgets = budgetRepository.findByUserAndMonthAndYearOrderByCategoryAsc(user, month, year);
        
        if (budgets.isEmpty()) {
            document.add(new Paragraph("No budgets found for the selected period."));
            return;
        }

        // Budget performance table
        Table budgetTable = new Table(UnitValue.createPercentArray(new float[]{2, 1, 1, 1, 1, 1}))
                .setWidth(UnitValue.createPercentValue(100));

        budgetTable.addHeaderCell(new Cell().add(new Paragraph("Category")).setBold());
        budgetTable.addHeaderCell(new Cell().add(new Paragraph("Budget")).setBold());
        budgetTable.addHeaderCell(new Cell().add(new Paragraph("Spent")).setBold());
        budgetTable.addHeaderCell(new Cell().add(new Paragraph("Remaining")).setBold());
        budgetTable.addHeaderCell(new Cell().add(new Paragraph("Progress")).setBold());
        budgetTable.addHeaderCell(new Cell().add(new Paragraph("Status")).setBold());

        BigDecimal totalBudget = BigDecimal.ZERO;
        BigDecimal totalSpent = BigDecimal.ZERO;

        for (Budget budget : budgets) {
            totalBudget = totalBudget.add(budget.getBudgetAmount());
            totalSpent = totalSpent.add(budget.getSpentAmount());

            budgetTable.addCell(new Cell().add(new Paragraph(budget.getCategory())));
            budgetTable.addCell(new Cell().add(new Paragraph("₹" + budget.getBudgetAmount())));
            budgetTable.addCell(new Cell().add(new Paragraph("₹" + budget.getSpentAmount())));
            budgetTable.addCell(new Cell().add(new Paragraph("₹" + budget.getRemainingAmount())));
            budgetTable.addCell(new Cell().add(new Paragraph(String.format("%.1f%%", budget.getProgressPercentage()))));
            
            String status = budget.isOverBudget() ? "Over Budget" : "On Track";
            com.itextpdf.kernel.colors.Color statusColor = budget.isOverBudget() ? ColorConstants.RED : ColorConstants.GREEN;
            budgetTable.addCell(new Cell().add(new Paragraph(status)).setFontColor(statusColor));
        }

        document.add(budgetTable);

        // Overall budget summary
        document.add(new Paragraph("Overall Budget Performance")
                .setFontSize(14)
                .setBold()
                .setMarginTop(15));

        Table overallTable = new Table(UnitValue.createPercentArray(new float[]{1, 1}))
                .setWidth(UnitValue.createPercentValue(100));

        overallTable.addCell(new Cell().add(new Paragraph("Total Budget")).setBold());
        overallTable.addCell(new Cell().add(new Paragraph("₹" + totalBudget)));
        overallTable.addCell(new Cell().add(new Paragraph("Total Spent")).setBold());
        overallTable.addCell(new Cell().add(new Paragraph("₹" + totalSpent)));
        overallTable.addCell(new Cell().add(new Paragraph("Remaining")).setBold());
        overallTable.addCell(new Cell().add(new Paragraph("₹" + totalBudget.subtract(totalSpent))));

        document.add(overallTable);
    }

    private void addDetailedSavingsGoalsAnalysis(Document document, User user) {
        List<SavingsGoal> goals = savingsGoalRepository.findByUserOrderByCreatedAtDesc(user);
        
        if (goals.isEmpty()) {
            document.add(new Paragraph("No savings goals found."));
            return;
        }

        // Goals overview
        long activeGoals = goals.stream().filter(g -> g.getStatus() == SavingsGoal.GoalStatus.IN_PROGRESS).count();
        long completedGoals = goals.stream().filter(g -> g.getStatus() == SavingsGoal.GoalStatus.COMPLETED).count();
        
        document.add(new Paragraph("Goals Overview")
                .setFontSize(14)
                .setBold());

        Table overviewTable = new Table(UnitValue.createPercentArray(new float[]{1, 1}))
                .setWidth(UnitValue.createPercentValue(100));

        overviewTable.addCell(new Cell().add(new Paragraph("Total Goals")).setBold());
        overviewTable.addCell(new Cell().add(new Paragraph(String.valueOf(goals.size()))));
        overviewTable.addCell(new Cell().add(new Paragraph("Active Goals")).setBold());
        overviewTable.addCell(new Cell().add(new Paragraph(String.valueOf(activeGoals))));
        overviewTable.addCell(new Cell().add(new Paragraph("Completed Goals")).setBold());
        overviewTable.addCell(new Cell().add(new Paragraph(String.valueOf(completedGoals))));

        document.add(overviewTable);

        // Detailed goals table
        document.add(new Paragraph("Goal Details")
                .setFontSize(14)
                .setBold()
                .setMarginTop(15));

        Table goalsTable = new Table(UnitValue.createPercentArray(new float[]{2, 1, 1, 1, 1, 1, 1}))
                .setWidth(UnitValue.createPercentValue(100));

        goalsTable.addHeaderCell(new Cell().add(new Paragraph("Goal")).setBold());
        goalsTable.addHeaderCell(new Cell().add(new Paragraph("Target")).setBold());
        goalsTable.addHeaderCell(new Cell().add(new Paragraph("Current")).setBold());
        goalsTable.addHeaderCell(new Cell().add(new Paragraph("Remaining")).setBold());
        goalsTable.addHeaderCell(new Cell().add(new Paragraph("Progress")).setBold());
        goalsTable.addHeaderCell(new Cell().add(new Paragraph("Target Date")).setBold());
        goalsTable.addHeaderCell(new Cell().add(new Paragraph("Status")).setBold());

        for (SavingsGoal goal : goals) {
            goalsTable.addCell(new Cell().add(new Paragraph(goal.getName())));
            goalsTable.addCell(new Cell().add(new Paragraph("₹" + goal.getTargetAmount())));
            goalsTable.addCell(new Cell().add(new Paragraph("₹" + goal.getCurrentAmount())));
            goalsTable.addCell(new Cell().add(new Paragraph("₹" + goal.getRemainingAmount())));
            goalsTable.addCell(new Cell().add(new Paragraph(String.format("%.1f%%", goal.getProgressPercentage()))));
            goalsTable.addCell(new Cell().add(new Paragraph(
                    goal.getTargetDate() != null ? goal.getTargetDate().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")) : "No deadline")));
            
            String status = goal.getStatus().toString();
            com.itextpdf.kernel.colors.Color statusColor = goal.getStatus() == SavingsGoal.GoalStatus.COMPLETED ? 
                    ColorConstants.GREEN : ColorConstants.BLUE;
            goalsTable.addCell(new Cell().add(new Paragraph(status)).setFontColor(statusColor));
        }

        document.add(goalsTable);
    }

    private String getMonthName(Integer month) {
        String[] months = {"", "January", "February", "March", "April", "May", "June",
                          "July", "August", "September", "October", "November", "December"};
        return months[month];
    }

    private List<Transaction> getTransactionsInDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        if (startDate != null && endDate != null) {
            return transactionRepository.findByUserIdAndTransactionDateBetween(userId, startDate, endDate);
        } else {
            return transactionRepository.findByUserIdOrderByTransactionDateDesc(userId);
        }
    }

    private void addSummarySection(Document document, Long userId, LocalDate startDate, LocalDate endDate) {
        BigDecimal totalIncome = transactionRepository.getTotalIncomeByUser(userId);
        BigDecimal totalExpenses = transactionRepository.getTotalExpensesByUser(userId);
        BigDecimal balance = totalIncome.subtract(totalExpenses);
        Long transactionCount = transactionRepository.getTransactionCountByUser(userId);

        document.add(new Paragraph("Financial Summary")
                .setFontSize(16)
                .setBold()
                .setMarginTop(20));

        Table summaryTable = new Table(UnitValue.createPercentArray(new float[]{1, 1}))
                .setWidth(UnitValue.createPercentValue(100));

        summaryTable.addCell(new Cell().add(new Paragraph("Total Income:")).setBold());
        summaryTable.addCell(new Cell().add(new Paragraph("₹" + totalIncome.toString())));
        summaryTable.addCell(new Cell().add(new Paragraph("Total Expenses:")).setBold());
        summaryTable.addCell(new Cell().add(new Paragraph("₹" + totalExpenses.toString())));
        summaryTable.addCell(new Cell().add(new Paragraph("Net Balance:")).setBold());
        summaryTable.addCell(new Cell().add(new Paragraph("₹" + balance.toString())));
        summaryTable.addCell(new Cell().add(new Paragraph("Total Transactions:")).setBold());
        summaryTable.addCell(new Cell().add(new Paragraph(transactionCount.toString())));

        document.add(summaryTable);
    }

    private void addTransactionsTable(Document document, List<Transaction> transactions) {
        document.add(new Paragraph("Transaction Details")
                .setFontSize(16)
                .setBold()
                .setMarginTop(20));

        if (transactions.isEmpty()) {
            document.add(new Paragraph("No transactions found for the selected period."));
            return;
        }

        Table table = new Table(UnitValue.createPercentArray(new float[]{2, 3, 2, 1, 2}))
                .setWidth(UnitValue.createPercentValue(100));

        // Add headers
        table.addHeaderCell(new Cell().add(new Paragraph("Date")).setBold());
        table.addHeaderCell(new Cell().add(new Paragraph("Title")).setBold());
        table.addHeaderCell(new Cell().add(new Paragraph("Category")).setBold());
        table.addHeaderCell(new Cell().add(new Paragraph("Type")).setBold());
        table.addHeaderCell(new Cell().add(new Paragraph("Amount")).setBold());

        // Add data rows
        for (Transaction transaction : transactions) {
            table.addCell(new Cell().add(new Paragraph(transaction.getTransactionDate().toLocalDate().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")))));
            table.addCell(new Cell().add(new Paragraph(transaction.getTitle())));
            table.addCell(new Cell().add(new Paragraph(transaction.getCategory())));
            table.addCell(new Cell().add(new Paragraph(transaction.getType().toString())));
            table.addCell(new Cell().add(new Paragraph("₹" + transaction.getAmount().toString())));
        }

        document.add(table);
    }

    private void addCategoryBreakdown(Document document, Long userId) {
        List<Map<String, Object>> breakdown = transactionRepository.getExpenseBreakdownByCategory(userId);
        
        document.add(new Paragraph("Expense Breakdown by Category")
                .setFontSize(16)
                .setBold()
                .setMarginTop(20));

        if (breakdown.isEmpty()) {
            document.add(new Paragraph("No expense data available."));
            return;
        }

        Table table = new Table(UnitValue.createPercentArray(new float[]{1, 1}))
                .setWidth(UnitValue.createPercentValue(100));

        table.addHeaderCell(new Cell().add(new Paragraph("Category")).setBold());
        table.addHeaderCell(new Cell().add(new Paragraph("Total Amount")).setBold());

        for (Map<String, Object> item : breakdown) {
            table.addCell(new Cell().add(new Paragraph(item.get("category").toString())));
            table.addCell(new Cell().add(new Paragraph("₹" + item.get("totalAmount").toString())));
        }

        document.add(table);
    }

    private void addFinancialSummary(Document document, Map<String, Object> summary) {
        document.add(new Paragraph("Financial Overview")
                .setFontSize(16)
                .setBold()
                .setMarginTop(20));

        Table table = new Table(UnitValue.createPercentArray(new float[]{1, 1}))
                .setWidth(UnitValue.createPercentValue(100));

        table.addCell(new Cell().add(new Paragraph("Total Income:")).setBold());
        table.addCell(new Cell().add(new Paragraph("₹" + summary.get("totalIncome").toString())));
        table.addCell(new Cell().add(new Paragraph("Total Expenses:")).setBold());
        table.addCell(new Cell().add(new Paragraph("₹" + summary.get("totalExpenses").toString())));
        table.addCell(new Cell().add(new Paragraph("Balance:")).setBold());
        table.addCell(new Cell().add(new Paragraph("₹" + summary.get("balance").toString())));
        table.addCell(new Cell().add(new Paragraph("Transaction Count:")).setBold());
        table.addCell(new Cell().add(new Paragraph(summary.get("transactionCount").toString())));

        document.add(table);
    }

    private void addExpenseBreakdownTable(Document document, List<Map<String, Object>> breakdown) {
        document.add(new Paragraph("Expense Breakdown")
                .setFontSize(16)
                .setBold()
                .setMarginTop(20));

        Table table = new Table(UnitValue.createPercentArray(new float[]{1, 1}))
                .setWidth(UnitValue.createPercentValue(100));

        table.addHeaderCell(new Cell().add(new Paragraph("Category")).setBold());
        table.addHeaderCell(new Cell().add(new Paragraph("Amount")).setBold());

        for (Map<String, Object> item : breakdown) {
            table.addCell(new Cell().add(new Paragraph(item.get("category").toString())));
            table.addCell(new Cell().add(new Paragraph("₹" + item.get("totalAmount").toString())));
        }

        document.add(table);
    }

    private void addMonthlyTrendsTable(Document document, List<Map<String, Object>> trends) {
        document.add(new Paragraph("Monthly Trends")
                .setFontSize(16)
                .setBold()
                .setMarginTop(20));

        Table table = new Table(UnitValue.createPercentArray(new float[]{1, 1, 1, 1}))
                .setWidth(UnitValue.createPercentValue(100));

        table.addHeaderCell(new Cell().add(new Paragraph("Month")).setBold());
        table.addHeaderCell(new Cell().add(new Paragraph("Income")).setBold());
        table.addHeaderCell(new Cell().add(new Paragraph("Expenses")).setBold());
        table.addHeaderCell(new Cell().add(new Paragraph("Net")).setBold());

        for (Map<String, Object> trend : trends) {
            String month = trend.get("month") + "/" + trend.get("year");
            BigDecimal income = (BigDecimal) trend.get("totalIncome");
            BigDecimal expenses = (BigDecimal) trend.get("totalExpenses");
            BigDecimal net = income.subtract(expenses);

            table.addCell(new Cell().add(new Paragraph(month)));
            table.addCell(new Cell().add(new Paragraph("₹" + income.toString())));
            table.addCell(new Cell().add(new Paragraph("₹" + expenses.toString())));
            table.addCell(new Cell().add(new Paragraph("₹" + net.toString())));
        }

        document.add(table);
    }
}