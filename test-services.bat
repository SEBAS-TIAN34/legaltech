@echo off
REM ============================================
REM Script de Pruebas - LegalTech Microservices
REM ============================================

echo.
echo ============================================
echo   PRUEBAS DE MICROSERVICIOS - LEGALTECH
echo ============================================
echo.

REM Variables
set BASE_URL=http://localhost
set AUTH_URL=%BASE_URL%:3001/api/auth
set CASES_URL=%BASE_URL%:3002/api/cases
set CLIENTS_URL=%BASE_URL%:3003/api/clients
set DOCUMENTS_URL=%BASE_URL%:3004/api/documents
set TIMETRACKING_URL=%BASE_URL%:3005/api/time-entries
set BILLING_URL=%BASE_URL%:3006/api/invoices
set NOTIFICATIONS_URL=%BASE_URL%:3007/api/notifications
set DASHBOARD_URL=%BASE_URL%:3008/api/dashboard

REM ============================================
echo [1] Verificando salud de todos los servicios
echo ============================================
curl -s http://localhost:3001/health
echo.
curl -s http://localhost:3002/health
echo.
curl -s http://localhost:3003/health
echo.
curl -s http://localhost:3004/health
echo.
curl -s http://localhost:3005/health
echo.
curl -s http://localhost:3006/health
echo.
curl -s http://localhost:3007/health
echo.
curl -s http://localhost:3008/health
echo.

echo.
echo ============================================
echo [2] PRUEBA: Registro de Usuario
echo ============================================
curl -X POST %AUTH_URL%/register ^
  -H "Content-Type: application/json" ^
  -d "{\"firstName\":\"Juan\",\"lastName\":\"Perez\",\"email\":\"juan@test.com\",\"password\":\"123456\",\"role\":\"lawyer\"}"
echo.

echo.
echo ============================================
echo [3] PRUEBA: Login
echo ============================================
curl -X POST %AUTH_URL%/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"juan@test.com\",\"password\":\"123456\"}"
echo.
echo.
echo [Copia el token de arriba y reemplaza TU_TOKEN en las siguientes pruebas]
echo.

REM ============================================
echo [4] PRUEBA: Crear Cliente
echo ============================================
curl -X POST %CLIENTS_URL%/ ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer TU_TOKEN" ^
  -d "{\"firstName\":\"Carlos\",\"lastName\":\"Garcia\",\"documentType\":\"CC\",\"documentNumber\":\"1234567890\",\"email\":\"carlos@test.com\",\"phone\":\"3001234567\",\"clientType\":\"individual\"}"
echo.

echo.
echo ============================================
echo [5] PRUEBA: Listar Clientes
echo ============================================
curl -X GET %CLIENTS_URL%/ ^
  -H "Authorization: Bearer TU_TOKEN"
echo.

echo.
echo ============================================
echo [6] PRUEBA: Crear Caso
echo ============================================
curl -X POST %CASES_URL%/ ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer TU_TOKEN" ^
  -d "{\"caseNumber\":\"CASE-2024-001\",\"title\":\"Demanda Civil\",\"description\":\"Demanda por incumplimiento de contrato\",\"caseType\":\"civil\",\"priority\":\"high\",\"clientId\":\"CLIENT_ID\",\"assignedTo\":\"Abogado1\",\"startDate\":\"2024-01-15\",\"budget\":5000000}"
echo.

echo.
echo ============================================
echo [7] PRUEBA: Listar Casos
echo ============================================
curl -X GET %CASES_URL%/ ^
  -H "Authorization: Bearer TU_TOKEN"
echo.

echo.
echo ============================================
echo [8] PRUEBA: Crear Notificacion
echo ============================================
curl -X POST %NOTIFICATIONS_URL%/ ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer TU_TOKEN" ^
  -d "{\"userId\":\"USER_ID\",\"title\":\"Nuevo caso\",\"message\":\"Se ha creado un nuevo caso\",\"type\":\"info\"}"
echo.

echo.
echo ============================================
echo [9] PRUEBA: Dashboard Stats
echo ============================================
curl -X GET %DASHBOARD_URL%/stats ^
  -H "Authorization: Bearer TU_TOKEN"
echo.

echo.
echo ============================================
echo   PRUEBAS COMPLETADAS
echo ============================================
pause