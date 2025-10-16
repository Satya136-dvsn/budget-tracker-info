# Budget Tracker API Test Script
# This script tests all the Budget and Savings Goals APIs

Write-Host "`n╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     BUDGET TRACKER API TESTING SUITE                    ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:8080"
$token = ""
$testsPassed = 0
$testsFailed = 0

# Helper function to make API calls
function Invoke-ApiTest {
    param(
        [string]$Method,
        [string]$Endpoint,
        [string]$Description,
        [object]$Body = $null,
        [bool]$RequireAuth = $true
    )
    
    Write-Host "`n▶ Testing: " -NoNewline -ForegroundColor Yellow
    Write-Host $Description -ForegroundColor White
    Write-Host "  $Method $Endpoint" -ForegroundColor Gray
    
    try {
        $headers = @{
            "Content-Type" = "application/json"
        }
        
        if ($RequireAuth -and $token) {
            $headers["Authorization"] = "Bearer $token"
        }
        
        $params = @{
            Uri = "$baseUrl$Endpoint"
            Method = $Method
            Headers = $headers
            ErrorAction = "Stop"
        }
        
        if ($Body) {
            $params["Body"] = ($Body | ConvertTo-Json -Depth 10)
        }
        
        $response = Invoke-RestMethod @params
        
        Write-Host "  ✅ SUCCESS" -ForegroundColor Green
        $script:testsPassed++
        return $response
        
    } catch {
        Write-Host "  ❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
        $script:testsFailed++
        return $null
    }
}

# Test 1: Login
Write-Host "`n┌──────────────────────────────────────────┐" -ForegroundColor Cyan
Write-Host "│  🔐 AUTHENTICATION TESTS                │" -ForegroundColor Cyan
Write-Host "└──────────────────────────────────────────┘" -ForegroundColor Cyan

$loginBody = @{
    username = "testuser1"
    password = "password123"
}

$loginResponse = Invoke-ApiTest -Method "POST" -Endpoint "/api/auth/login" -Description "User Login" -Body $loginBody -RequireAuth $false

if ($loginResponse -and $loginResponse.token) {
    $token = $loginResponse.token
    Write-Host "  🎫 Token: $($token.Substring(0,30))..." -ForegroundColor Cyan
    Write-Host "  👤 User: $($loginResponse.username)" -ForegroundColor Cyan
    Write-Host "  📧 Email: $($loginResponse.email)" -ForegroundColor Cyan
}

# Test 2-9: Budget Management
Write-Host "`n┌──────────────────────────────────────────┐" -ForegroundColor Cyan
Write-Host "│  💰 BUDGET MANAGEMENT TESTS (8)         │" -ForegroundColor Cyan
Write-Host "└──────────────────────────────────────────┘" -ForegroundColor Cyan

# Create Budget 1
$budgetBody1 = @{
    category = "Food and Dining"
    budgetAmount = 500.00
    month = 1
    year = 2025
}
$budget1 = Invoke-ApiTest -Method "POST" -Endpoint "/api/budgets" -Description "Create Budget: Food and Dining" -Body $budgetBody1

# Create Budget 2
$budgetBody2 = @{
    category = "Entertainment"
    budgetAmount = 200.00
    month = 1
    year = 2025
}
$budget2 = Invoke-ApiTest -Method "POST" -Endpoint "/api/budgets" -Description "Create Budget: Entertainment" -Body $budgetBody2

# Create Budget 3
$budgetBody3 = @{
    category = "Transportation"
    budgetAmount = 300.00
    month = 1
    year = 2025
}
$budget3 = Invoke-ApiTest -Method "POST" -Endpoint "/api/budgets" -Description "Create Budget: Transportation" -Body $budgetBody3

# Get All Budgets
$allBudgets = Invoke-ApiTest -Method "GET" -Endpoint "/api/budgets" -Description "Get All Budgets"
if ($allBudgets) {
    Write-Host "  📊 Total Budgets: $($allBudgets.Count)" -ForegroundColor Cyan
}

# Get Current Month Budgets
$currentBudgets = Invoke-ApiTest -Method "GET" -Endpoint "/api/budgets/current-month" -Description "Get Current Month Budgets"

# Get Budgets by Month/Year
$monthBudgets = Invoke-ApiTest -Method "GET" -Endpoint "/api/budgets/month/1/year/2025" -Description "Get Budgets for January 2025"

# Update Budget
if ($budget1 -and $budget1.id) {
    $updateBody = @{
        category = "Food and Dining"
        budgetAmount = 600.00
        month = 1
        year = 2025
    }
    Invoke-ApiTest -Method "PUT" -Endpoint "/api/budgets/$($budget1.id)" -Description "Update Budget (increase to 600)" -Body $updateBody
}

# Recalculate Budgets
Invoke-ApiTest -Method "POST" -Endpoint "/api/budgets/recalculate" -Description "Recalculate All Budgets"

# Test 10-21: Savings Goals
Write-Host "`n┌──────────────────────────────────────────┐" -ForegroundColor Cyan
Write-Host "│  🎯 SAVINGS GOALS TESTS (12)            │" -ForegroundColor Cyan
Write-Host "└──────────────────────────────────────────┘" -ForegroundColor Cyan

# Create Savings Goal 1
$goalBody1 = @{
    name = "Emergency Fund"
    description = "Build 6 months of expenses"
    targetAmount = 10000.00
    targetDate = "2025-12-31"
}
$goal1 = Invoke-ApiTest -Method "POST" -Endpoint "/api/savings-goals" -Description "Create Goal: Emergency Fund" -Body $goalBody1

# Create Savings Goal 2
$goalBody2 = @{
    name = "Vacation Fund"
    description = "Trip to Europe"
    targetAmount = 5000.00
    targetDate = "2025-08-01"
}
$goal2 = Invoke-ApiTest -Method "POST" -Endpoint "/api/savings-goals" -Description "Create Goal: Vacation Fund" -Body $goalBody2

# Create Savings Goal 3
$goalBody3 = @{
    name = "New Car Down Payment"
    description = "Save for down payment"
    targetAmount = 15000.00
    targetDate = "2026-06-30"
}
$goal3 = Invoke-ApiTest -Method "POST" -Endpoint "/api/savings-goals" -Description "Create Goal: New Car" -Body $goalBody3

# Get All Savings Goals
$allGoals = Invoke-ApiTest -Method "GET" -Endpoint "/api/savings-goals" -Description "Get All Savings Goals"
if ($allGoals) {
    Write-Host "  🎯 Total Goals: $($allGoals.Count)" -ForegroundColor Cyan
}

# Get Active Goals
$activeGoals = Invoke-ApiTest -Method "GET" -Endpoint "/api/savings-goals/active" -Description "Get Active Goals Only"

# Get Goals by Status - IN_PROGRESS
$inProgressGoals = Invoke-ApiTest -Method "GET" -Endpoint "/api/savings-goals/status/IN_PROGRESS" -Description "Get Goals: IN_PROGRESS Status"

# Get Goal by ID
if ($goal1 -and $goal1.id) {
    $goalDetail = Invoke-ApiTest -Method "GET" -Endpoint "/api/savings-goals/$($goal1.id)" -Description "Get Goal by ID"
}

# Update Savings Goal
if ($goal1 -and $goal1.id) {
    $updateGoalBody = @{
        name = "Emergency Fund"
        description = "Updated: Build 12 months of expenses"
        targetAmount = 15000.00
        targetDate = "2025-12-31"
    }
    Invoke-ApiTest -Method "PUT" -Endpoint "/api/savings-goals/$($goal1.id)" -Description "Update Goal (increase target)" -Body $updateGoalBody
}

# Add Funds to Goal
if ($goal1 -and $goal1.id) {
    $addFundsBody = @{
        amount = 500.00
    }
    Invoke-ApiTest -Method "PATCH" -Endpoint "/api/savings-goals/$($goal1.id)/progress" -Description "Add Funds: +500" -Body $addFundsBody
    
    # Add more funds
    $addFundsBody2 = @{
        amount = 1000.00
    }
    Invoke-ApiTest -Method "PATCH" -Endpoint "/api/savings-goals/$($goal1.id)/progress" -Description "Add More Funds: +1000" -Body $addFundsBody2
    
    # Set absolute amount
    $setAmountBody = @{
        amount = 2500.00
    }
    Invoke-ApiTest -Method "PATCH" -Endpoint "/api/savings-goals/$($goal1.id)/amount" -Description "Set Current Amount: 2500" -Body $setAmountBody
}

# Complete Goal (if goal2 exists)
if ($goal2 -and $goal2.id) {
    Invoke-ApiTest -Method "PATCH" -Endpoint "/api/savings-goals/$($goal2.id)/complete" -Description "Complete Savings Goal"
}

# Test Summary
Write-Host "`n╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                   TEST SUMMARY                           ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

$totalTests = $testsPassed + $testsFailed
$successRate = if ($totalTests -gt 0) { [math]::Round(($testsPassed / $totalTests) * 100, 2) } else { 0 }

Write-Host "`n  Total Tests:   $totalTests" -ForegroundColor White
Write-Host "  ✅ Passed:     $testsPassed" -ForegroundColor Green
Write-Host "  ❌ Failed:     $testsFailed" -ForegroundColor Red
Write-Host "  📊 Success:    $successRate%" -ForegroundColor Cyan

if ($testsFailed -eq 0) {
    Write-Host "`n  🎉 ALL TESTS PASSED! 🎉" -ForegroundColor Green
} else {
    Write-Host "`n  ⚠️  Some tests failed. Check the output above." -ForegroundColor Yellow
}

Write-Host "`n════════════════════════════════════════════════════════════`n" -ForegroundColor Cyan

# Additional test details
Write-Host "💡 TIP: To test individual endpoints, use the REST Client extension" -ForegroundColor Yellow
Write-Host "   in VS Code with the api-tests.http file." -ForegroundColor Yellow
Write-Host "`n🌐 Frontend: http://localhost:5173/" -ForegroundColor Cyan
Write-Host "🔧 Backend:  http://localhost:8080" -ForegroundColor Cyan
Write-Host ""
