@echo off
chcp 936 > nul
echo ================================================
echo    Code Explorer
echo ================================================
echo.
echo Starting project...
echo.
echo Current directory: %cd%
echo.

echo [1/3] Checking Node.js...
node -v > nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Node.js not found!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js is ready
echo.

echo [2/3] Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies, please wait...
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo [ERROR] Failed to install dependencies!
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed
) else (
    echo [OK] Dependencies exist
)
echo.

echo [3/3] Starting dev server...
echo.
echo ================================================
echo Server started!
echo ================================================
echo.
echo Open browser and visit: http://localhost:5173
echo.
echo Press Ctrl+C to stop server
echo.

call npm run dev

pause
