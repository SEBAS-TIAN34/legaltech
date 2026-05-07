$body = @{
    email = "test@legaltech.com"
    password = "123456"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://127.0.0.1:3001/api/auth/login" -Method POST -Body $body -ContentType "application/json"
    Write-Host "LOGIN SUCCESS:"
    $response | ConvertTo-Json
} catch {
    Write-Host "LOGIN FAILED: $_"
}