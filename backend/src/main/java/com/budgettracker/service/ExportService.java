package com.budgettracker.service;

import com.budgettracker.model.Transaction;
import com.budgettracker.model.User;
import com.budgettracker.repository.TransactionRepository;
import com.budgettracker.repository.UserRepository;
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
    private TransactionService transactionService;

    public byte[] exportTransactionsToPdf(String username, LocalDate startDate, LocalDate endDate) throws IOException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

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
        return baos.toByteArray();
    }

    public String exportTransactionsToCsv(String username, LocalDate startDate, LocalDate endDate) throws IOException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

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
        }

        return stringWriter.toString();
    }

    public byte[] exportAnalyticsToPdf(String username) throws IOException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

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
        return baos.toByteArray();
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