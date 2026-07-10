@echo off
setlocal
where corepack >nul 2>nul || (
  echo Corepack no esta disponible. Instala Node.js 20 o superior.
  exit /b 1
)
corepack enable
corepack prepare pnpm@11.0.0 --activate
pnpm install --frozen-lockfile
pnpm dev
