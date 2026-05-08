while ($true) {
    $process = Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*server.js*" }
    if (-not $process) {
        Write-Host "Starting frontend server..."
        Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory "C:\Users\SEBASTIAN\OneDrive\Documentos\8 SEMESTRE ING DE SISTEMAS\legaltech" -WindowStyle Hidden
    }
    Start-Sleep -Seconds 10
}