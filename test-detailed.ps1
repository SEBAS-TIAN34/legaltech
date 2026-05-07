$loginBody = @{
    email = "admin1201710980@test.com"
    password = "admin123"
} | ConvertTo-Json

$login = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $login.data.token
Write-Host "Token obtained: $($token.Substring(0, 50))..."

$headers = @{ Authorization = "Bearer $token" }

# Test each service
$tests = @(
    @{Name="Auth Profile"; Url="http://localhost:3001/api/auth/profile"},
    @{Name="Cases"; Url="http://localhost:3002/api/cases"},
    @{Name="Clients"; Url="http://localhost:3003/api/clients"},
    @{Name="Documents"; Url="http://localhost:3004/api/documents"},
    @{Name="TimeEntries"; Url="http://localhost:3005/api/time-entries"},
    @{Name="Invoices"; Url="http://localhost:3006/api/invoices"},
    @{Name="Notifications"; Url="http://localhost:3007/api/notifications"},
    @{Name="Dashboard"; Url="http://localhost:3008/api/dashboard/stats"}
)

$results = @()
foreach ($t in $tests) {
    try {
        $r = Invoke-RestMethod -Uri $t.Url -Headers $headers -ErrorAction Stop
        $results += @{Name=$t.Name; Status="OK"; Response=$r.success}
    } catch {
        $results += @{Name=$t.Name; Status="FAIL"; Error=$_.Exception.Message}
    }
}

$results | ForEach-Object { 
    $color = if ($_.Status -eq "OK") { "Green" } else { "Red" }
    Write-Host "$($_.Status) - $($_.Name)" -ForegroundColor $color
    if ($_.Error) { Write-Host "  Error: $($_.Error)" }
}

Write-Host "`nTotal: $(($results | Where-Object {$_.Status -eq 'OK'}).Count) / $($results.Count) working"