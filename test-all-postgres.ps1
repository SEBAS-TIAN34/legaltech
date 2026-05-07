$loginBody = @{
    email = "admin1201710980@test.com"
    password = "admin123"
} | ConvertTo-Json

$login = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $login.data.token

$headers = @{ Authorization = "Bearer $token" }

Write-Host "`n=== Testing All Services with PostgreSQL ===`n"

$services = @(
    @{Name="Auth (Profile)"; Url="http://localhost:3001/api/auth/profile"},
    @{Name="Cases"; Url="http://localhost:3002/api/cases"},
    @{Name="Clients"; Url="http://localhost:3003/api/clients"},
    @{Name="Documents"; Url="http://localhost:3004/api/documents"},
    @{Name="Time Tracking"; Url="http://localhost:3005/api/time-entries"},
    @{Name="Billing"; Url="http://localhost:3006/api/invoices"},
    @{Name="Notifications"; Url="http://localhost:3007/api/notifications"},
    @{Name="Dashboard"; Url="http://localhost:3008/api/dashboard/stats"}
)

$allOk = $true
foreach ($s in $services) {
    try {
        $r = Invoke-RestMethod -Uri $s.Url -Headers $headers
        Write-Host "OK   - $($s.Name)"
    } catch {
        Write-Host "FAIL - $($s.Name)"
        $allOk = $false
    }
}

Write-Host "`n=== Result ==="
if ($allOk) { Write-Host "ALL SERVICES WORKING WITH POSTGRESQL!" }
else { Write-Host "Some services need attention" }