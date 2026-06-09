# ENABLE_LONG_PATHS.ps1
# Run this script as Administrator to enable Windows long path support (260+ character paths).
# Required for TensorFlow/Keras to load .h5 model files from deep directory structures.

$ErrorActionPreference = "Stop"

# Check for admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator." -ForegroundColor Red
    Write-Host "Right-click PowerShell -> Run as Administrator, then run:" -ForegroundColor Yellow
    Write-Host "  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor Cyan
    Write-Host "  cd '$PSScriptRoot'" -ForegroundColor Cyan
    Write-Host "  .\ENABLE_LONG_PATHS.ps1" -ForegroundColor Cyan
    exit 1
}

$keyPath = "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem"
$valueName = "LongPathsEnabled"

try {
    $current = Get-ItemProperty -Path $keyPath -Name $valueName -ErrorAction SilentlyContinue
    if ($current.$valueName -eq 1) {
        Write-Host "Long paths are already enabled." -ForegroundColor Green
        exit 0
    }
} catch {
    # Value may not exist
}

Set-ItemProperty -Path $keyPath -Name $valueName -Value 1 -Type DWord -Force
Write-Host "Long paths have been enabled. You may need to restart your terminal or PC for it to take effect." -ForegroundColor Green
Write-Host "Then: pip install tensorflow (or tensorflow-cpu), and add .h5 model files to the models/ folder." -ForegroundColor Cyan
