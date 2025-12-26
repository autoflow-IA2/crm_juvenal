@echo off
echo ============================================
echo Testando API de Filtro de Clientes
echo ============================================

REM Configure sua API Key aqui
set API_KEY=sua-chave-api-super-secreta-aqui
set BASE_URL=http://localhost:3001

echo.
echo [1] Buscar por telefone:
echo GET %BASE_URL%/api/clientes/filter?phone=11999999999
echo.
curl -X GET "%BASE_URL%/api/clientes/filter?phone=11999999999" ^
  -H "Content-Type: application/json" ^
  -H "X-API-Key: %API_KEY%"

echo.
echo.
echo ============================================
echo [2] Buscar por nome:
echo GET %BASE_URL%/api/clientes/filter?name=João Silva
echo.
curl -X GET "%BASE_URL%/api/clientes/filter?name=João Silva" ^
  -H "Content-Type: application/json" ^
  -H "X-API-Key: %API_KEY%"

echo.
echo.
echo ============================================
echo [3] Buscar por nome OU telefone:
echo GET %BASE_URL%/api/clientes/filter?name=João Silva^&phone=11999999999
echo.
curl -X GET "%BASE_URL%/api/clientes/filter?name=João Silva&phone=11999999999" ^
  -H "Content-Type: application/json" ^
  -H "X-API-Key: %API_KEY%"

echo.
echo.
echo ============================================
echo [4] Buscar por telefone + status ativo:
echo GET %BASE_URL%/api/clientes/filter?phone=11999999999^&status=active
echo.
curl -X GET "%BASE_URL%/api/clientes/filter?phone=11999999999&status=active" ^
  -H "Content-Type: application/json" ^
  -H "X-API-Key: %API_KEY%"

echo.
echo.
echo ============================================
echo [5] Listar apenas clientes ativos:
echo GET %BASE_URL%/api/clientes/filter?status=active
echo.
curl -X GET "%BASE_URL%/api/clientes/filter?status=active" ^
  -H "Content-Type: application/json" ^
  -H "X-API-Key: %API_KEY%"

echo.
echo.
echo ============================================
echo [6] Listar todos os clientes (sem filtros):
echo GET %BASE_URL%/api/clientes/filter
echo.
curl -X GET "%BASE_URL%/api/clientes/filter" ^
  -H "Content-Type: application/json" ^
  -H "X-API-Key: %API_KEY%"

echo.
echo.
echo ============================================
echo Testes concluidos!
echo ============================================
pause
