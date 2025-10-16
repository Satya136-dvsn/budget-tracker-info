# Budget Tracker API Test Script - Simplified Version
# Run this script to test all Budget and Savings Goals APIs

Write-Host "`n===============================================" -ForegroundColor Cyan
Write-Host "    BUDGET TRACKER API TESTING SUITE" -ForegroundColor Cyan
Write-Host "===============================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:8080"
$token = ""
$passed = 0
$failed = 0

function Test-API {
    param($Method, $Endpoint, $Desc, $Body = $null, $Auth = $true)
    
    Write-Host "`nTesting: $Desc" -ForegroundColor Yellow
    Write-Host "  $Method $Endpoint" -ForegroundColor Gray
    
    try {
        $headers = @{"Content-Type" = "application/json"}
        if ($Auth -and $script:token) {
            $headers["Authorization"] = "Bearer $script:token"
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
        Write-Host "  SUCCESS" -ForegroundColor Green
        $script:passed++
        return $response
    }
    catch {
        Write-Host "  FAILED: $($_.Exception.Message)" -ForegroundColor Red
        $script:failed++
        return $null
    }
}

# TEST 1: Login
Write-Host "`n=== AUTHENTICATION ===" -ForegroundColor Cyan
$loginData = @{username = "testuser1"; password = "password123"}
$loginResp = Test-API -Method "POST" -Endpoint "/api/auth/login" -Desc "User Login" -Body $loginData -Auth $false

if ($loginResp -and $loginResp.token) {
    $token = $loginResp.token
    Write-Host "  Token: $($token.Substring(0,30))..." -ForegroundColor Cyan
    Write-Host "  User: $($loginResp.username), Email: $($loginResp.email)" -ForegroundColor Cyan
}

# TEST 2-9: Budget Management
Write-Host "`n=== BUDGET MANAGEMENT (8 tests) ===" -ForegroundColor Cyan

$b1 = @{category = "Food and Dining"; budgetAmount = 500.00; month = 1; year = 2025}
$budget1 = Test-API -Method "POST" -Endpoint "/api/budgets" -Desc "Create Budget 1" -Body $b1

$b2 = @{category = "Entertainment"; budgetAmount = 200.00; month = 1; year = 2025}
Test-API -Method "POST" -Endpoint "/api/budgets" -Desc "Create Budget 2" -Body $b2 | Out-Null

$b3 = @{category = "Transportation"; budgetAmount = 300.00; month = 1; year = 2025}
Test-API -Method "POST" -Endpoint "/api/budgets" -Desc "Create Budget 3" -Body $b3 | Out-Null

$allB = Test-API -Method "GET" -Endpoint "/api/budgets" -Desc "Get All Budgets"
if ($allB) { Write-Host "  Total Budgets: $($allB.Count)" -ForegroundColor Cyan }

Test-API -Method "GET" -Endpoint "/api/budgets/current-month" -Desc "Get Current Month Budgets" | Out-Null

Test-API -Method "GET" -Endpoint "/api/budgets/month/1/year/2025" -Desc "Get Jan 2025 Budgets" | Out-Null

if ($budget1 -and $budget1.id) {
    $upd = @{category = "Food and Dining"; budgetAmount = 600.00; month = 1; year = 2025}
    Test-API -Method "PUT" -Endpoint "/api/budgets/$($budget1.id)" -Desc "Update Budget" -Body $upd | Out-Null
}

Test-API -Method "POST" -Endpoint "/api/budgets/recalculate" -Desc "Recalculate Budgets" | Out-Null

# TEST 10-21: Savings Goals
Write-Host "`n=== SAVINGS GOALS (12 tests) ===" -ForegroundColor Cyan

$g1 = @{name = "Emergency Fund"; description = "6 months expenses"; targetAmount = 10000.00; targetDate = "2025-12-31"}
$goal1 = Test-API -Method "POST" -Endpoint "/api/savings-goals" -Desc "Create Goal 1" -Body $g1

$g2 = @{name = "Vacation Fund"; description = "Europe trip"; targetAmount = 5000.00; targetDate = "2025-08-01"}
$goal2 = Test-API -Method "POST" -Endpoint "/api/savings-goals" -Desc "Create Goal 2" -Body $g2

$g3 = @{name = "Car Down Payment"; description = "New car"; targetAmount = 15000.00; targetDate = "2026-06-30"}
Test-API -Method "POST" -Endpoint "/api/savings-goals" -Desc "Create Goal 3" -Body $g3 | Out-Null

$allG = Test-API -Method "GET" -Endpoint "/api/savings-goals" -Desc "Get All Goals"
if ($allG) { Write-Host "  Total Goals: $($allG.Count)" -ForegroundColor Cyan }

Test-API -Method "GET" -Endpoint "/api/savings-goals/active" -Desc "Get Active Goals" | Out-Null

Test-API -Method "GET" -Endpoint "/api/savings-goals/status/IN_PROGRESS" -Desc "Get In-Progress Goals" | Out-Null

if ($goal1 -and $goal1.id) {
    Test-API -Method "GET" -Endpoint "/api/savings-goals/$($goal1.id)" -Desc "Get Goal by ID" | Out-Null
    
    $updG = @{name = "Emergency Fund"; description = "12 months expenses"; targetAmount = 15000.00; targetDate = "2025-12-31"}
    Test-API -Method "PUT" -Endpoint "/api/savings-goals/$($goal1.id)" -Desc "Update Goal" -Body $updG | Out-Null
    
    Test-API -Method "PATCH" -Endpoint "/api/savings-goals/$($goal1.id)/progress" -Desc "Add 500" -Body @{amount = 500.00} | Out-Null
    Test-API -Method "PATCH" -Endpoint "/api/savings-goals/$($goal1.id)/progress" -Desc "Add 1000" -Body @{amount = 1000.00} | Out-Null
    Test-API -Method "PATCH" -Endpoint "/api/savings-goals/$($goal1.id)/amount" -Desc "Set Amount 2500" -Body @{amount = 2500.00} | Out-Null
}

if ($goal2 -and $goal2.id) {
    Test-API -Method "PATCH" -Endpoint "/api/savings-goals/$($goal2.id)/complete" -Desc "Complete Goal" | Out-Null
}

# Summary
Write-Host "`n===============================================" -ForegroundColor Cyan
Write-Host "                TEST SUMMARY" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
$total = $passed + $failed
$rate = if ($total -gt 0) { [math]::Round(($passed / $total) * 100, 2) } else { 0 }
Write-Host "`n  Total:   $total tests" -ForegroundColor White
Write-Host "  Passed:  $passed" -ForegroundColor Green
Write-Host "  Failed:  $failed" -ForegroundColor Red
Write-Host "  Success: $rate%" -ForegroundColor Cyan

if ($failed -eq 0) {
    Write-Host "`n  ALL TESTS PASSED!" -ForegroundColor Green
} else {
    Write-Host "`n  Some tests failed" -ForegroundColor Yellow
}
Write-Host "`n===============================================`n" -ForegroundColor Cyan
