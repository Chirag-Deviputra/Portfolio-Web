@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>nul
if errorlevel 1 (
  echo Python was not found. Install Python 3.10 or later with the Python launcher.
  pause
  exit /b 1
)
if not exist .venv\Scripts\python.exe py -3 -m venv .venv
if errorlevel 1 goto failed
.venv\Scripts\python.exe -m pip install -r requirements.txt
if errorlevel 1 goto failed
echo.
echo Open http://127.0.0.1:5000 in your browser. Ctrl+C stops the server.
.venv\Scripts\python.exe app.py
pause
exit /b
:failed
echo Setup failed. Check the error above and try again.
pause
exit /b 1
