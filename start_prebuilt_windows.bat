@echo off
setlocal
where node >nul 2>nul || (
  echo Node.js 20 o superior no esta disponible.
  exit /b 1
)
node tools\server.mjs dist
