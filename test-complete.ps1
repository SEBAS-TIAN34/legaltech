# Get fresh login first
$loginBody = @{
    email = "admin1201710980@test.com"
    password = "admin123"
} | ConvertTo-Json

Write-Host "1. Logging in..."
$login = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $login.data.token
$headers = @{ Authorization = "Bearer $token" }
Write-Host "   Token obtained`n"

# Test all services
Write-Host "2. Testing services..."
$tests = @(
    @{Name="Auth Profile"; Url="http://localhost:3001/api/auth/profile"},
    @{Name="Cases List"; Url="http://localhost:3002/api/cases"},
    @{Name="Clients List"; Url="http://localhost:3003/api/clients"},
    @{Name="Documents List"; Url="http://localhost:3004/api/documents"},
    @{Name="Time Entries"; Url="http://localhost:3005/api/time-entries"},
    @{Name="Invoices List"; Url="http://localhost:3006/api/invoices"},
    @{Name="Notifications"; Url="http://localhost:3007/api/notifications"},
    @{Name="Dashboard"; Url="http://localhost:3008/api/dashboard/stats"}
)

$passed = 0
foreach ($t in $tests) {
    try {
        $r = Invoke-RestMethod -Uri $t.Url -Headers $headers -TimeoutSec 10
        Write-Host "OK   - $($t.Name)" -ForegroundColor Green
        $passed++
    } catch {
        Write-Host "FAIL - $($t.Name) : $($_.Exception.Message.Substring(0, [Math]::Min(50, $_.Exception.Message.Length)))" -ForegroundColor Red
    }
}

Write-Host "`n========== RESULT: $passed / $($tests.Count) ==========" -ForegroundColor Cyan
if ($passed -eq $tests.Count) { Write-Host "ALL SERVICES WORKING!" -ForegroundColor Green }
else { Write-Host "Some services need fixing" -ForegroundColor Yellow }