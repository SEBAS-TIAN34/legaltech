$loginBody = @{ email = "admin1201710980@test.com"; password = "admin123" } | ConvertTo-Json

$login = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$login | ConvertTo-Json -Depth 5