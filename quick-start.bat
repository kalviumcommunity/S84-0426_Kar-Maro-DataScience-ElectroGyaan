@echo off
REM ElectroGyaan Quick Start Script for Windows
REM This script helps you set up and run the entire platform

echo.
echo ========================================
echo   ElectroGyaan Platform - Quick Start
echo ========================================
echo.

REM Check prerequisites
echo Checking prerequisites...
echo.

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed
    pause
    exit /b 1
) else (
    echo [OK] Node.js found
)

where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed
    pause
    exit /b 1
) else (
    echo [OK] npm found
)

where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python is not installed
    pause
    exit /b 1
) else (
    echo [OK] Python found
)

where pip >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] pip is not installed
    pause
    exit /b 1
) else (
    echo [OK] pip found
)

echo.
echo ========================================
echo.

REM Menu
echo What would you like to do?
echo.
echo 1) Install all dependencies
echo 2) Generate dataset and train ML models
echo 3) Show commands to start all services
echo 4) Start IoT simulator
echo 5) Run complete setup (1 + 2)
echo 6) Exit
echo.

set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto install_deps
if "%choice%"=="2" goto train_models
if "%choice%"=="3" goto show_commands
if "%choice%"=="4" goto start_simulator
if "%choice%"=="5" goto complete_setup
if "%choice%"=="6" goto end
goto invalid_choice

:install_deps
echo.
echo Installing dependencies...
echo.

echo [1/3] Installing backend dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)
echo [OK] Backend dependencies installed
echo.

echo [2/3] Installing frontend dependencies...
cd ..\frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)
echo [OK] Frontend dependencies installed
echo.

echo [3/3] Installing ML service dependencies...
cd ..\ml-service
pip install -r requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install ML service dependencies
    cd ..
    pause
    exit /b 1
)
echo [OK] ML service dependencies installed
echo.

cd ..
echo ========================================
echo All dependencies installed successfully!
echo ========================================
goto end

:train_models
echo.
echo Generating dataset and training models...
echo.

echo [1/2] Generating synthetic energy dataset...
cd backend
node generate_dataset.js
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to generate dataset
    cd ..
    pause
    exit /b 1
)
echo [OK] Dataset generated: electrogyaan_dataset.csv
echo.

echo [2/2] Training ML models...
cd ..\ml-service
python train_models.py
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to train models
    cd ..
    pause
    exit /b 1
)
echo [OK] Models trained and saved
echo.

cd ..
echo ========================================
echo Dataset and models ready!
echo ========================================
goto end

:show_commands
echo.
echo ========================================
echo   Commands to Start All Services
echo ========================================
echo.
echo Open 3 separate terminals and run:
echo.
echo Terminal 1 - ML Service (port 8000):
echo   cd S84-0426_Kar-Maro-DataScience-ElectroGyaan\ml-service
echo   uvicorn main:app --reload --port 8000
echo.
echo Terminal 2 - Backend API (port 5000):
echo   cd S84-0426_Kar-Maro-DataScience-ElectroGyaan\backend
echo   npm run dev
echo.
echo Terminal 3 - Frontend (port 5173):
echo   cd S84-0426_Kar-Maro-DataScience-ElectroGyaan\frontend
echo   npm run dev
echo.
echo After starting all services, open:
echo   http://localhost:5173
echo.
echo ========================================
goto end

:start_simulator
echo.
echo Starting IoT simulator...
echo.
echo [WARNING] Make sure backend is running first!
echo.
cd backend
npm run simulate
cd ..
goto end

:complete_setup
echo.
echo Running complete setup...
echo.

echo [1/5] Installing backend dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)
echo [OK] Backend dependencies installed
echo.

echo [2/5] Installing frontend dependencies...
cd ..\frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)
echo [OK] Frontend dependencies installed
echo.

echo [3/5] Installing ML service dependencies...
cd ..\ml-service
pip install -r requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install ML service dependencies
    cd ..
    pause
    exit /b 1
)
echo [OK] ML service dependencies installed
echo.

echo [4/5] Generating dataset...
cd ..\backend
node generate_dataset.js
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to generate dataset
    cd ..
    pause
    exit /b 1
)
echo [OK] Dataset generated
echo.

echo [5/5] Training ML models...
cd ..\ml-service
python train_models.py
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to train models
    cd ..
    pause
    exit /b 1
)
echo [OK] Models trained
echo.

cd ..
echo ========================================
echo Complete setup finished!
echo ========================================
echo.
echo Next steps:
echo 1. Start ML service: cd ml-service ^&^& uvicorn main:app --reload --port 8000
echo 2. Start backend: cd backend ^&^& npm run dev
echo 3. Start frontend: cd frontend ^&^& npm run dev
echo 4. Open browser: http://localhost:5173
echo.
goto end

:invalid_choice
echo.
echo [ERROR] Invalid choice. Please run the script again.
pause
exit /b 1

:end
echo.
echo ========================================
echo Done!
echo ========================================
pause
