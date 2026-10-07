# Script para iniciar el Frontend Angular de Adventure Retail
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "Iniciando servidor de desarrollo Angular..." -ForegroundColor Green
Set-Location (Join-Path $scriptDir "apps\frontend")
npm start
