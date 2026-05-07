@echo off
echo ========================================
echo    EJECUTANDO PRUEBAS UNITARIAS
echo ========================================
echo.

echo [1/4] Auth Service...
cd auth-service
call npm test -- --testPathPattern="tests/unit"
if %ERRORLEVEL% NEQ 0 echo    ⚠️ Auth Service unit tests failed
cd ..

echo [2/4] Cases Service...
cd cases-service
call npm test -- --testPathPattern="tests/unit"
if %ERRORLEVEL% NEQ 0 echo    ⚠️ Cases Service unit tests failed
cd ..

echo [3/4] Notifications Service...
cd notifications-service
call npm test -- --testPathPattern="tests/unit"
if %ERRORLEVEL% NEQ 0 echo    ⚠️ Notifications Service unit tests failed
cd ..

echo [4/4] Clients Service...
cd clients-service
call npm test -- --testPathPattern="tests/unit"
if %ERRORLEVEL% NEQ 0 echo    ⚠️ Clients Service unit tests failed
cd ..

echo.
echo ========================================
echo    EJECUTANDO PRUEBAS DE INTEGRACION
echo ========================================
echo.

echo [1/4] Auth Service Integration...
cd auth-service
call npm test -- --testPathPattern="tests/integration"
if %ERRORLEVEL% NEQ 0 echo    ⚠️ Auth Service integration failed
cd ..

echo [2/4] Cases Service Integration...
cd cases-service
call npm test -- --testPathPattern="tests/integration"
if %ERRORLEVEL% NEQ 0 echo    ⚠️ Cases Service integration failed
cd ..

echo [3/4] Notifications Service Integration...
cd notifications-service
call npm test -- --testPathPattern="tests/integration"
if %ERRORLEVEL% NEQ 0 echo    ⚠️ Notifications Service integration failed
cd ..

echo.
echo ========================================
echo    EJECUTANDO PRUEBA DE ESTRES
echo ========================================
echo.
node stress-test.js

echo.
echo ========================================
echo    EJECUTANDO JMETER (si esta instalado)
echo ========================================
echo.
where jmeter >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    jmeter -n -t jmeter-stress-test.jmx -l results.jtl -e -o html-report
    echo ✅ Reporte JMeter generado en html-report
) else (
    echo ⚠️ JMeter no esta instalado. Use el script stress-test.js como alternativa.
)

echo.
echo ========================================
echo    RESUMEN COMPLETADO
echo ========================================
pause