@echo off
setlocal

echo ==============================================
echo   Exit From Matrix - Relay Bridge
echo ==============================================
echo Polling every 30 seconds by default.
echo Press Ctrl+C to stop.
echo.

cd /d "%~dp0"
python "tools\relay_bridge.py"

endlocal
