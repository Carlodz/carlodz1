@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo This version uses Node.js 18+ and no npm packages.
)
start "CARLODZ SERVER" cmd /k node server.js
 timeout /t 2 >nul
start "" http://localhost:5500
