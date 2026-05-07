$loginBody = @{ email = "admin1201710980@test.com"; password = "admin123" } | ConvertTo-Json

try {
    $login = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $login.data.token
    $headers = @{ Authorization = "Bearer $token" }
    
    Write-Host "Token OK - Testing services...`n"
    
    $services = @(
        @{Name="Auth Profile"; Url="http://localhost:3001/api/auth/profile"},
        @{Name="Cases"; Url="http://localhost:3002/api/cases"},
        @{Name="Clients"; Url="http://localhost:3003/api/clients"},
        @{Name="Documents"; Url="http://localhost:3004/api/documents"},
        @{Name="TimeEntries"; Url="http://localhost:3005/api/time-entries"},
        @{Name="Invoices"; Url="http://localhost:3006/api/invoices"},
        @{Name="Notifications"; Url="http://localhost:3007/api/notifications"},
        @{Name="Dashboard"; Url="http://localhost:3008/api/dashboard/stats"}
    )
    
    $ok = 0
    foreach ($s in $services) {
        try {
            $r = Invoke-RestMethod -Uri $s.Url -Headers $headers -ErrorAction Stop
            Write-Host "OK   - $($s.Name)" -ForegroundColor Green
            $ok++
        } catch {
            Write-Host "FAIL - $($s.Name)" -ForegroundColor Red
        }
    }
    
    Write-Host "`nTotal: $ok / $($services.Count) services working"
    
} catch {
    Write-Host "LOGIN FAILED: $($_.Exception.Message)"
}