$body = @{
    firstName = "Admin"
    lastName = "Test"
    email = "admin$(Get-Random)@test.com"
    password = "admin123"
    role = "admin"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/register" -Method POST -Body $body -ContentType "application/json"
    Write-Host "REGISTER SUCCESS:"
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "REGISTER FAILED: $($_.Exception.Message)"
}