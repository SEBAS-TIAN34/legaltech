# Get fresh login
$loginBody = @{ email = "admin1201710980@test.com"; password = "admin123" } | ConvertTo-Json
$login = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $login.data.token
Write-Host "Login OK, token: $($token.Substring(0,30))..."
Write-Host ""

# Test profile with token
Write-Host "Testing /api/auth/profile..."
$headers = @{ Authorization = "Bearer $token" }
try {
    $r = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/profile" -Headers $headers
    Write-Host "Profile result: $($r | ConvertTo-Json)"
} catch {
    Write-Host "Profile error: $($_.Exception.Message)"
    $_.Exception.Response.StatusCode
}

# Also test login
Write-Host "`nTesting fresh login..."
$login2 = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
Write-Host "Login success: $($login2.success)"
Write-Host "Token valid: $($login2.data.token.Substring(0,30))..."