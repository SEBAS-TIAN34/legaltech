$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWY4ZTdkMjliMzUyZTAwODM0MDFiOTUiLCJpYXQiOjE3Nzc5MTk5NTQsImV4cCI6MTc3ODUyNDc1NH0.IeBAYOeHius5hNnuZvVN5zDYVw_wBkKZuliMNYPMgxw"
$headers = @{ Authorization = "Bearer $token" }

Write-Host "`n=== Testing Auth Service (Profile) ==="
try {
    $r = Invoke-RestMethod -Uri "http://127.0.0.1:3001/api/auth/profile" -Headers $headers
    Write-Host "Profile: SUCCESS"
} catch { Write-Host "Profile: FAILED" }

Write-Host "`n=== Testing Cases Service ==="
try {
    $r = Invoke-RestMethod -Uri "http://127.0.0.1:3002/api/cases" -Headers $headers
    Write-Host "Cases: SUCCESS - $($r.success)"
} catch { Write-Host "Cases: FAILED" }

Write-Host "`n=== Testing Clients Service ==="
try {
    $r = Invoke-RestMethod -Uri "http://127.0.0.1:3003/api/clients" -Headers $headers
    Write-Host "Clients: SUCCESS - $($r.success)"
} catch { Write-Host "Clients: FAILED" }

Write-Host "`n=== Testing Documents Service ==="
try {
    $r = Invoke-RestMethod -Uri "http://127.0.0.1:3004/api/documents" -Headers $headers
    Write-Host "Documents: SUCCESS - $($r.success)"
} catch { Write-Host "Documents: FAILED" }

Write-Host "`n=== Testing Time Tracking Service ==="
try {
    $r = Invoke-RestMethod -Uri "http://127.0.0.1:3005/api/time-entries" -Headers $headers
    Write-Host "Time Tracking: SUCCESS - $($r.success)"
} catch { Write-Host "Time Tracking: FAILED" }

Write-Host "`n=== Testing Billing Service ==="
try {
    $r = Invoke-RestMethod -Uri "http://127.0.0.1:3006/api/invoices" -Headers $headers
    Write-Host "Billing: SUCCESS - $($r.success)"
} catch { Write-Host "Billing: FAILED" }

Write-Host "`n=== Testing Notifications Service ==="
try {
    $r = Invoke-RestMethod -Uri "http://127.0.0.1:3007/api/notifications" -Headers $headers
    Write-Host "Notifications: SUCCESS - $($r.success)"
} catch { Write-Host "Notifications: FAILED" }

Write-Host "`n=== Testing Dashboard Service ==="
try {
    $r = Invoke-RestMethod -Uri "http://127.0.0.1:3008/api/dashboard" -Headers $headers
    Write-Host "Dashboard: SUCCESS - $($r.success)"
} catch { Write-Host "Dashboard: FAILED" }

Write-Host "`n=== All Tests Complete ==="