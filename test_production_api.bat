@echo off
echo ================================================
echo Testando API de Producao - Juvenal CRM
echo ================================================
echo.
echo URL Base: https://crm-programando-pensamentos.si2cu4.easypanel.host
echo.

echo 1. Testando endpoint raiz (sem autenticacao)...
curl -X GET "https://crm-programando-pensamentos.si2cu4.easypanel.host/" ^
  -H "Accept: application/json"
echo.
echo.

echo 2. Testando /api/health (com API Key)...
curl -X GET "https://crm-programando-pensamentos.si2cu4.easypanel.host/api/health" ^
  -H "Content-Type: application/json" ^
  -H "X-API-Key: vtmGTnqVqeL+dYSzyrNvcWtRxwgUxIe5Tn+gEWNKJyM="
echo.
echo.

echo 3. Testando busca de clientes (com API Key)...
curl -X GET "https://crm-programando-pensamentos.si2cu4.easypanel.host/api/clientes/search?q=teste" ^
  -H "Content-Type: application/json" ^
  -H "X-API-Key: vtmGTnqVqeL+dYSzyrNvcWtRxwgUxIe5Tn+gEWNKJyM="
echo.
echo.

echo 4. Testando listagem de clientes (com API Key)...
curl -X GET "https://crm-programando-pensamentos.si2cu4.easypanel.host/api/clientes" ^
  -H "Content-Type: application/json" ^
  -H "X-API-Key: vtmGTnqVqeL+dYSzyrNvcWtRxwgUxIe5Tn+gEWNKJyM="
echo.
echo.

echo 5. Testando stats de clientes (com API Key)...
curl -X GET "https://crm-programando-pensamentos.si2cu4.easypanel.host/api/clientes/stats" ^
  -H "Content-Type: application/json" ^
  -H "X-API-Key: vtmGTnqVqeL+dYSzyrNvcWtRxwgUxIe5Tn+gEWNKJyM="
echo.
echo.

echo ================================================
echo Testes concluidos!
echo ================================================
echo.
echo IMPORTANTE: Se receber erro 401, a API Key esta incorreta
echo IMPORTANTE: Se receber timeout, o servidor pode estar offline
echo IMPORTANTE: Se receber HTML, o endpoint pode estar incorreto
echo.
pause
