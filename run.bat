@echo off
setlocal
title E-Predict Launcher

echo ==========================================
echo 🚀 E-Predict Setup and Run
echo ==========================================

REM 1. Backend Setup
echo.
echo [1/3] Setting up Backend...
if not exist .venv (
    echo    - Creating virtual environment...
    python -m venv .venv
) else (
    echo    - Virtual environment found.
)

REM Activate venv
call .venv\Scripts\activate

echo    - Installing dependencies...
pip install -r flask-server\requirements.txt --quiet --disable-pip-version-check

REM 2. Frontend Setup
echo.
echo [2/3] Setting up Frontend...
cd client
if not exist node_modules (
    echo    - Installing node modules...
    call npm install
) else (
    echo    - Node modules found.
)
cd ..

REM 3. Start Servers
echo.
echo [3/3] Starting Servers...
echo.
echo ⚡ Launching Backend (Flask) in new window...
start "E-Predict Backend" /D flask-server cmd /k "..\.venv\Scripts\python.exe app.py"

echo ⚡ Launching Frontend (Next.js) in new window...
start "E-Predict Frontend" /D client cmd /k "npm run dev"

echo.
echo ✅ Done! application is starting up.
echo    - Backend:  http://localhost:5000
echo    - Frontend: http://localhost:3000
echo.
pause
