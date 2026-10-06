[CmdletBinding()]
param(
  [Parameter(Mandatory = $true, Position = 0)]
  [ValidateNotNullOrEmpty()]
  [string]$Label,

  [switch]$Preflight,

  [UInt64]$MinimumFreeBytes = 5GB
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path.TrimEnd('\')
$expectedRepoRoot = 'E:\Sanctuary Studies'
$buildRootE = 'E:\MuzicleBuilds'
$buildRootD = 'D:\MuzicleBuilds'
$fat32MaximumFileBytes = 4GB

function Fail([string]$Message) {
  Write-Error "External packaging aborted: $Message"
  exit 1
}

function Get-SafeSlug([string]$Value) {
  $slug = $Value.Trim().ToLowerInvariant() -replace '[^a-z0-9]+', '-'
  $slug = $slug.Trim('-')
  if ([string]::IsNullOrWhiteSpace($slug)) { Fail 'The feature/build label has no usable filename characters.' }
  return $slug.Substring(0, [Math]::Min($slug.Length, 64))
}

function Assert-ExternalPath([string]$Path, [string]$ExpectedDrive) {
  $fullPath = [IO.Path]::GetFullPath($Path)
  if (-not $fullPath.StartsWith("$ExpectedDrive`:\", [StringComparison]::OrdinalIgnoreCase)) {
    Fail "Safety failure: '$fullPath' is not on the required $ExpectedDrive`: drive."
  }
  if ($fullPath.StartsWith('C:\', [StringComparison]::OrdinalIgnoreCase)) {
    Fail "C: is forbidden for packaging: $fullPath"
  }
}

function Assert-WritableDirectory([string]$Path, [string]$DriveLetter) {
  Assert-ExternalPath $Path $DriveLetter
  if (-not (Test-Path -LiteralPath "$DriveLetter`:\" -PathType Container)) {
    Fail "$DriveLetter`: is not mounted. Packaging will not fall back to C:."
  }
  $drive = [IO.DriveInfo]::new("$DriveLetter`:\")
  if (-not $drive.IsReady) { Fail "$DriveLetter`: is not ready." }
  if ($drive.AvailableFreeSpace -lt $MinimumFreeBytes) {
    Fail "$DriveLetter`: has only $([Math]::Round($drive.AvailableFreeSpace / 1GB, 2)) GB free; at least $([Math]::Round($MinimumFreeBytes / 1GB, 2)) GB is required."
  }
  if (-not (Test-Path -LiteralPath $Path -PathType Container)) {
    New-Item -ItemType Directory -Path $Path | Out-Null
  }
  $probe = Join-Path $Path ('.write-probe-' + [Guid]::NewGuid().ToString('N'))
  try {
    [IO.File]::WriteAllText($probe, 'external-only packaging probe')
  }
  catch {
    Fail "$DriveLetter`: destination is not writable: $Path ($($_.Exception.Message))"
  }
  finally {
    if (Test-Path -LiteralPath $probe -PathType Leaf) { Remove-Item -LiteralPath $probe -Force }
  }
  return $drive
}

function Get-DirectoryStats([string]$Path) {
  $files = @(Get-ChildItem -LiteralPath $Path -File -Recurse -Force)
  $sum = ($files | Measure-Object -Property Length -Sum).Sum
  if ($null -eq $sum) { $sum = 0 }
  [pscustomobject]@{
    FileCount = $files.Count
    Bytes = [UInt64]$sum
  }
}

if (-not [String]::Equals($repoRoot, $expectedRepoRoot, [StringComparison]::OrdinalIgnoreCase)) {
  Fail "The resolved repository root '$repoRoot' is not the canonical E: working copy '$expectedRepoRoot'."
}

$slug = Get-SafeSlug $Label
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$name = "win-unpacked-$slug-$timestamp"
$eFinal = Join-Path $buildRootE $name
$dFinal = Join-Path $buildRootD $name
$eStage = Join-Path $buildRootE ".staging-$name"
$dStage = Join-Path $buildRootD ".staging-$name"

Assert-ExternalPath $eFinal 'E'
Assert-ExternalPath $dFinal 'D'
Assert-ExternalPath $eStage 'E'
Assert-ExternalPath $dStage 'D'

Write-Host "External packaging policy preflight: $name"
$eDrive = Assert-WritableDirectory $buildRootE 'E'
$dDrive = Assert-WritableDirectory $buildRootD 'D'
if ($dDrive.DriveFormat -eq 'FAT32') {
  Write-Warning "D: uses FAT32. Any generated file larger than 4 GB will fail before the mirror is finalized."
}
if (Test-Path -LiteralPath $eFinal) { Fail "Timestamp collision detected for E: output $eFinal. No existing output was changed." }
if (Test-Path -LiteralPath $dFinal) { Fail "Timestamp collision detected for D: output $dFinal. No existing output was changed." }

$sourceStats = Get-DirectoryStats $repoRoot
$estimatedBytes = [UInt64]([Math]::Max(1GB, $sourceStats.Bytes * 3))
Write-Host "Repository: $repoRoot"
Write-Host "Label: $Label -> $slug"
Write-Host "Expected disk impact: approximately $([Math]::Round($estimatedBytes / 1GB, 2)) GB on E: during staging, plus one final package on each drive and the external Electron cache."
Write-Host "E: free: $([Math]::Round($eDrive.AvailableFreeSpace / 1GB, 2)) GB; D: free: $([Math]::Round($dDrive.AvailableFreeSpace / 1GB, 2)) GB"
Write-Host "Planned E: output: $eFinal"
Write-Host "Planned D: mirror: $dFinal"

$builder = Join-Path $repoRoot 'node_modules\.bin\electron-builder.cmd'
if ($Preflight) {
  if (-not (Test-Path -LiteralPath $builder -PathType Leaf)) {
    Write-Warning "electron-builder is not installed in E:\Sanctuary Studies. A real package will fail closed until E: dependencies are installed."
  }
  Write-Host 'Preflight passed. No package or staging directory was created.' -ForegroundColor Green
  exit 0
}

if (-not (Test-Path -LiteralPath $builder -PathType Leaf)) {
  Fail "electron-builder is not installed in this repository. Install dependencies from E: before packaging."
}

try {
  New-Item -ItemType Directory -Path $eStage -Force | Out-Null
  $env:TEMP = $eStage
  $env:TMP = $eStage
  $env:ELECTRON_BUILDER_CACHE = Join-Path $buildRootE '.electron-builder-cache'
  $env:NPM_CONFIG_CACHE = Join-Path $buildRootE '.npm-cache'
  New-Item -ItemType Directory -Path $env:ELECTRON_BUILDER_CACHE, $env:NPM_CONFIG_CACHE -Force | Out-Null

  & $builder --win --dir --config (Join-Path $repoRoot 'electron-builder.yml') --config.directories.output=$eStage
  if ($LASTEXITCODE -ne 0) { Fail "electron-builder returned exit code $LASTEXITCODE." }

  $built = Join-Path $eStage 'win-unpacked'
  if (-not (Test-Path -LiteralPath $built -PathType Container)) { Fail "Expected E: builder output was not found at $built." }
  $eStats = Get-DirectoryStats $built
  $oversized = @(Get-ChildItem -LiteralPath $built -File -Recurse | Where-Object { $_.Length -gt $fat32MaximumFileBytes })
  if ($oversized.Count -gt 0) { Fail "FAT32 safety failure: $($oversized[0].FullName) exceeds 4 GB." }
  Move-Item -LiteralPath $built -Destination $eFinal

  New-Item -ItemType Directory -Path $dStage -Force | Out-Null
  Get-ChildItem -LiteralPath $eFinal -Force | Copy-Item -Destination $dStage -Recurse -Force
  $dStageStats = Get-DirectoryStats $dStage
  if ($eStats.FileCount -ne $dStageStats.FileCount -or $eStats.Bytes -ne $dStageStats.Bytes) {
    Fail "D: mirror verification failed before finalizing. E: $($eStats.FileCount) files/$($eStats.Bytes) bytes; D staging: $($dStageStats.FileCount) files/$($dStageStats.Bytes) bytes."
  }
  Move-Item -LiteralPath $dStage -Destination $dFinal

  $finalE = Get-DirectoryStats $eFinal
  $finalD = Get-DirectoryStats $dFinal
  if ($finalE.FileCount -ne $finalD.FileCount -or $finalE.Bytes -ne $finalD.Bytes) {
    Fail "D:/E: final file-count or total-byte mismatch. E: $($finalE.FileCount) files/$($finalE.Bytes) bytes; D: $($finalD.FileCount) files/$($finalD.Bytes) bytes."
  }
  Write-Host "E: final output: $eFinal ($($finalE.FileCount) files, $([Math]::Round($finalE.Bytes / 1MB, 2)) MB)" -ForegroundColor Green
  Write-Host "D: final mirror: $dFinal ($($finalD.FileCount) files, $([Math]::Round($finalD.Bytes / 1MB, 2)) MB)" -ForegroundColor Green
}
catch {
  if (Test-Path -LiteralPath $eStage) { Remove-Item -LiteralPath $eStage -Recurse -Force -ErrorAction SilentlyContinue }
  if (Test-Path -LiteralPath $dStage) { Remove-Item -LiteralPath $dStage -Recurse -Force -ErrorAction SilentlyContinue }
  Write-Error $_
  exit 1
}
