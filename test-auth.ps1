$body = @{
    firstName = "Test"
    lastName = "User"
    email = "test@legaltech.com"
    password = "123456"
    role = "admin"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://127.0.0.1:3001/api/auth/register" -Method POST -Body $body -ContentType "application/json"
$response | ConvertTo-Json