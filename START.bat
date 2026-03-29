@echo off
REM Smart Office Routing Agent - Windows Startup Script
echo.
echo ============================================================
echo Smart Office Routing Agent - Integrated Setup
echo ============================================================
echo.
echo Installing dependencies and building application...
echo.

REM Run the Python setup script
python run.py

if errorlevel 1 (
    echo.
    echo Error running setup. Please check the output above.
    pause
    exit /b 1
)

pause
