$loginBody = @{ email = "admin1201710980@test.com"; password = "admin123" } | ConvertTo-Json

# Login
$login = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $login.data.token
$userId = $login.data.user._id

Write-Host "User ID from login: $userId"
Write-Host "Token: $($token.Substring(0,30))..."

# Try to get profile with this userId
$headers = @{ Authorization = "Bearer $token" }

# First decode the token to see what's inside
$tokenParts = $token.Split('.')
$payload = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($tokenParts[1]))
Write-Host "`nToken payload: $payload"

# Try profile
try {
    $profile = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/profile" -Headers $headers
    Write-Host "`nProfile: SUCCESS"
} catch {
    Write-Host "`nProfile: FAILED - $($_.Exception.Message)"
}