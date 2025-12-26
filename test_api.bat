@echo off
echo ================================================
echo Testando API de Clientes - Juvenal CRM
echo ================================================
echo.

echo 1. Testando Health Check (sem autenticacao)...
curl -X GET "http://localhost:3001/" -H "Content-Type: application/json"
echo.
echo.

echo 2. Testando busca de clientes (com API Key)...
curl -X GET "http://localhost:3001/api/clientes/search?q=teste" ^
  -H "Content-Type: application/json" ^
  -H "X-API-Key: vtmGTnqVqeL+dYSzyrNvcWtRxwgUxIe5Tn+gEWNKJyM="
echo.
echo.

echo 3. Testando listagem de clientes (com API Key)...
curl -X GET "http://localhost:3001/api/clientes" ^
  -H "Content-Type: application/json" ^
  -H "X-API-Key: vtmGTnqVqeL+dYSzyrNvcWtRxwgUxIe5Tn+gEWNKJyM="
echo.
echo.

echo ================================================
echo Testes concluidos!
echo ================================================
pause
