# Script para iniciar el Backend de Adventure Retail cargando .env automáticamente
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$envFile = Join-Path $scriptDir ".env"

if (Test-Path $envFile) {
    Write-Host "Cargando variables desde $envFile..." -ForegroundColor Cyan
    Get-Content $envFile | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#") -and $line.Contains("=")) {
            $parts = $line.Split("=", 2)
            $name = $parts[0].Trim()
            $value = $parts[1].Trim()
            [System.Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
} else {
    Write-Warning "No se encontró el archivo .env en $scriptDir"
}

$env:SPRING_PROFILES_ACTIVE = "dev"

Write-Host "Iniciando Spring Boot..." -ForegroundColor Green
Set-Location (Join-Path $scriptDir "apps\backend")
mvn spring-boot:run
