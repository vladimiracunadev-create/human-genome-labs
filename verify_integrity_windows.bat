@echo off
setlocal
cd /d "%~dp0"
node tools\verify-integrity.mjs
if errorlevel 1 pause
endlocal
