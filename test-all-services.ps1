$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Nzc5NTU4MzcsImV4cCI6MTc3ODU2MDYzN30.zMSrRjg4xrB9rRZBlWvWrOXL217Md33lMMUmQioLiIo"
$headers = @{ Authorization = "Bearer $token" }

Write-Host "`n=== Testing Services with PostgreSQL ===`n"

Write-Host "Auth (Profile):"
try { $r = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/profile" -Headers $headers; Write-Host "  OK - $($r.success)" } catch { Write-Host "  FAIL" }

Write-Host "Cases:"
try { $r = Invoke-RestMethod -Uri "http://localhost:3002/api/cases" -Headers $headers; Write-Host "  OK - $($r.success)" } catch { Write-Host "  FAIL" }

Write-Host "Clients:"
try { $r = Invoke-RestMethod -Uri "http://localhost:3003/api/clients" -Headers $headers; Write-Host "  OK - $($r.success)" } catch { Write-Host "  FAIL" }

Write-Host "Documents:"
try { $r = Invoke-RestMethod -Uri "http://localhost:3004/api/documents" -Headers $headers; Write-Host "  OK - $($r.success)" } catch { Write-Host "  FAIL" }

Write-Host "Time Tracking:"
try { $r = Invoke-RestMethod -Uri "http://localhost:3005/api/time-entries" -Headers $headers; Write-Host "  OK - $($r.success)" } catch { Write-Host "  FAIL" }

Write-Host "Billing:"
try { $r = Invoke-RestMethod -Uri "http://localhost:3006/api/invoices" -Headers $headers; Write-Host "  OK - $($r.success)" } catch { Write-Host "  FAIL" }

Write-Host "Notifications:"
try { $r = Invoke-RestMethod -Uri "http://localhost:3007/api/notifications" -Headers $headers; Write-Host "  OK - $($r.success)" } catch { Write-Host "  FAIL" }

Write-Host "Dashboard:"
try { $r = Invoke-RestMethod -Uri "http://localhost:3008/api/dashboard/stats" -Headers $headers; Write-Host "  OK - $($r.success)" } catch { Write-Host "  FAIL" }

Write-Host "`n=== All Services Tested ==="