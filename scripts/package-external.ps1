[CmdletBinding()]
param(
  [Parameter(Mandatory = $true, Position = 0)]
  [ValidateNotNullOrEmpty()]
  [string] $Label,

  [switch] $Preflight,

  [UInt64] $MinimumFreeBytes = 1GB
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Fail([string] $Message) {
  Write-Error "External packaging aborted: $Message"
  exit 1
}

function Get-SafeSlug([string] $Value) {
  $slug = $Value.Trim().ToLowerInvariant() -replace '[^a-z0-9]+', '-'
  $slug = $slug.Trim('-')
  if ([string]::IsNullOrWhiteSpace($slug)) { Fail 'The feature/build label has no usable filename characters.' }
  return $slug.Substring(0, [Math]::Min($slug.Length, 64))
}

function Assert-ExternalPath([string] $Path) {
  $root = [IO.Path]::GetPathRoot($Path)
  if ($root -match '^[Cc]:\\') { Fail "C: is forbidden for packaging: $Path" }
}

function Assert-WritableDirectory([string] $Path) {
  Assert-ExternalPath $Path
  New-Item -ItemType Directory -Path $Path -Force | Out-Null
  $probe = Join-Path $Path ('.write-probe-' + [Guid]::NewGuid().ToString('N'))
  try {
    [IO.File]::WriteAllText($probe, 'write probe')
  } catch {
    Fail "Destination is not writable: $Path ($($_.Exception.Message))"
  } finally {
    if (Test-Path -LiteralPath $probe) { Remove-Item -LiteralPath $probe -Force }
  }
}

function Get-DirectoryStats([string] $Path) {
  $files = @(Get-ChildItem -LiteralPath $Path -File -Recurse -Force)
  [pscustomobject]@{
    FileCount = $files.Count
    Bytes = [UInt64](($files | Measure-Object -Property Length -Sum).Sum)
  }
}

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Assert-ExternalPath $repoRoot

$dRoot = 'D:\'
$eRoot = 'E:\'
$dBuilds = Join-Path $dRoot 'MuzicleBuilds'
$eBuilds = Join-Path $eRoot 'MuzicleBuilds'

foreach ($root in @($dRoot, $eRoot)) {
  if (-not (Test-Path -LiteralPath $root -PathType Container)) { Fail "$root is not mounted." }
  $drive = Get-PSDrive -Name $root.Substring(0, 1) -ErrorAction SilentlyContinue
  if ($null -eq $drive) { Fail "$root is not available as a filesystem drive." }
  if ($drive.Free -lt $MinimumFreeBytes) {
    Fail "$root has only $([Math]::Round($drive.Free / 1GB, 2)) GB free; at least $([Math]::Round($MinimumFreeBytes / 1GB, 2)) GB is required."
  }
}

Assert-WritableDirectory $dBuilds
Assert-WritableDirectory $eBuilds

$dVolume = Get-Volume -DriveLetter D -ErrorAction SilentlyContinue
if ($dVolume -and $dVolume.FileSystem -eq 'FAT32') {
  Write-Warning 'D: uses FAT32. Any generated file larger than 4 GB will fail; the completed output will be checked for this limit.'
}

$slug = Get-SafeSlug $Label
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$name = "win-unpacked-$slug-$timestamp"
$dFinal = Join-Path $dBuilds $name
$eFinal = Join-Path $eBuilds $name
$dStage = Join-Path $dBuilds ('.staging-sanctuary-$slug-$timestamp')
$eStage = Join-Path $eBuilds ('.staging-sanctuary-copy-$slug-$timestamp')

if ((Test-Path -LiteralPath $dFinal) -or (Test-Path -LiteralPath $eFinal)) { Fail "Timestamp collision detected for $name. No existing output was changed." }

$sourceStats = Get-DirectoryStats $repoRoot
$estimatedBytes = [UInt64]([Math]::Max(512MB, $sourceStats.Bytes * 3))
Write-Host "Repository: $repoRoot"
Write-Host "Label: $Label -> $slug"
Write-Host "Expected temporary/final disk impact: approximately $([Math]::Round($estimatedBytes / 1GB, 2)) GB per external destination, plus the Electron cache."
Write-Host "D: free: $([Math]::Round((Get-PSDrive D).Free / 1GB, 2)) GB; E: free: $([Math]::Round((Get-PSDrive E).Free / 1GB, 2)) GB"
Write-Host "Planned D: output: $dFinal"
Write-Host "Planned E: output: $eFinal"

if ($Preflight) {
  Write-Host 'Preflight passed. No package was created.'
  exit 0
}

New-Item -ItemType Directory -Path $dStage -Force | Out-Null
$env:TEMP = $dStage
$env:TMP = $dStage
$env:ELECTRON_BUILDER_CACHE = Join-Path $dBuilds '.electron-builder-cache'
$env:NPM_CONFIG_CACHE = Join-Path $dBuilds '.npm-cache'
New-Item -ItemType Directory -Path $env:ELECTRON_BUILDER_CACHE, $env:NPM_CONFIG_CACHE -Force | Out-Null

try {
  $builder = Join-Path $repoRoot 'node_modules\.bin\electron-builder.cmd'
  if (-not (Test-Path -LiteralPath $builder -PathType Leaf)) {
    Fail "electron-builder is not installed in this repository. Install dependencies from E: before packaging."
  }

  & $builder --win --dir --config "$repoRoot\electron-builder.yml" --config.directories.output="$dStage"
  if ($LASTEXITCODE -ne 0) { Fail "electron-builder returned exit code $LASTEXITCODE." }

  $built = Join-Path $dStage 'win-unpacked'
  if (-not (Test-Path -LiteralPath $built -PathType Container)) { Fail "Expected builder output was not found at $built." }

  $dStats = Get-DirectoryStats $built
  $oversized = @(Get-ChildItem -LiteralPath $built -File -Recurse | Where-Object { $_.Length -gt 4GB })
  if ($oversized.Count -gt 0) { Fail "D: FAT32 limit exceeded by: $($oversized.Name -join ', ')" }
  Move-Item -LiteralPath $built -Destination $dFinal

  New-Item -ItemType Directory -Path $eStage -Force | Out-Null
  Get-ChildItem -LiteralPath $dFinal -Force | Copy-Item -Destination $eStage -Recurse -Force
  $eStats = Get-DirectoryStats $eStage
  if ($dStats.FileCount -ne $eStats.FileCount -or $dStats.Bytes -ne $eStats.Bytes) {
    Fail "Secondary copy verification failed. D: $($dStats.FileCount) files/$($dStats.Bytes) bytes; E staging: $($eStats.FileCount) files/$($eStats.Bytes) bytes."
  }
  Move-Item -LiteralPath $eStage -Destination $eFinal

  Remove-Item -LiteralPath $dStage -Recurse -Force -ErrorAction SilentlyContinue
  $finalD = Get-DirectoryStats $dFinal
  $finalE = Get-DirectoryStats $eFinal
  Write-Host "D: final output: $dFinal ($($finalD.FileCount) files, $([Math]::Round($finalD.Bytes / 1MB, 2)) MB)"
  Write-Host "E: final output: $eFinal ($($finalE.FileCount) files, $([Math]::Round($finalE.Bytes / 1MB, 2)) MB)"
} catch {
  if (Test-Path -LiteralPath $dStage) { Remove-Item -LiteralPath $dStage -Recurse -Force -ErrorAction SilentlyContinue }
  if (Test-Path -LiteralPath $eStage) { Remove-Item -LiteralPath $eStage -Recurse -Force -ErrorAction SilentlyContinue }
  Write-Error $_
  exit 1
}
