@echo off
echo ========================================
echo    SecureInvest AI - Demo Launcher
echo ========================================
echo.
echo Starting demo presentation...
echo.

REM Check if demo.html exists
if not exist "demo.html" (
    echo Error: demo.html not found!
    pause
    exit /b 1
)

REM Open demo.html in default browser
start "" "demo.html"

echo Demo opened in your default browser!
echo.
echo To run the full application:
echo 1. Install Node.js and MongoDB
echo 2. Run: npm install
echo 3. Run: cd client && npm install
echo 4. Run: npm run dev
echo.
echo Press any key to exit...
pause >nul