$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWY4ZTdkMjliMzUyZTAwODM0MDFiOTUiLCJpYXQiOjE3Nzc5MTk5NTQsImV4cCI6MTc3ODUyNDc1NH0.IeBAYOeHius5hNnuZvVN5zDYVw_wBkKZuliMNYPMgxw"
$headers = @{ Authorization = "Bearer $token" }

Write-Host "`n=== Testing Dashboard Stats ==="
try {
    $r = Invoke-RestMethod -Uri "http://127.0.0.1:3008/api/dashboard/stats" -Headers $headers
    Write-Host "SUCCESS: $($r | ConvertTo-Json -Depth 3)"
} catch {
    Write-Host "FAILED: $($_.Exception.Message)"
}

Write-Host "`n=== Testing Dashboard Cases ==="
try {
    $r = Invoke-RestMethod -Uri "http://127.0.0.1:3008/api/dashboard/cases" -Headers $headers
    Write-Host "SUCCESS: $($r | ConvertTo-Json)"
} catch {
    Write-Host "FAILED: $($_.Exception.Message)"
}