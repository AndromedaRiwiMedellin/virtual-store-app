# Production build for andromeda.andrescortes.dev (static nginx on VPS)
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot\..

$env:VITE_API_BASE_URL = 'https://service.andromeda.andrescortes.dev'
$env:VITE_MEDIA_BASE_URL = 'https://admin.andromeda.andrescortes.dev/storage'

if (-not (Test-Path node_modules)) {
  npm install
}

npm run build
Write-Host "Build output: dist/ (copy to nginx root for andromeda.andrescortes.dev)"
