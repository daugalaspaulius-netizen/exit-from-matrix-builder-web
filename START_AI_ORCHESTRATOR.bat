@echo off
setlocal

echo ==============================================
echo   Exit From Matrix - AI Orchestrator
echo ==============================================
echo Repo monitoring starts (default: every 30 sec)
echo Press Ctrl+C to stop.
echo.

cd /d "%~dp0"
python "tools\ai_orchestrator.py"

endlocal
