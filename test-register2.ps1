$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$body = @{
    firstName = "Admin"
    lastName = "LegalTech"
    email = "admin$timestamp@legaltech.com"
    password = "admin123"
    role = "admin"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://127.0.0.1:3001/api/auth/register" -Method POST -Body $body -ContentType "application/json"
    Write-Host "REGISTER SUCCESS:"
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "REGISTER FAILED: $_"
}