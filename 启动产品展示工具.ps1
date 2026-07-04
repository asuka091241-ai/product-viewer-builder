$ErrorActionPreference = "Stop"

$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 5182
$url = "http://127.0.0.1:$port/"
$bundledPython = "C:\Users\46767\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"

function Test-LocalPort {
  param([int]$Port)

  try {
    $client = [Net.Sockets.TcpClient]::new()
    $connect = $client.BeginConnect("127.0.0.1", $Port, $null, $null)
    $isOpen = $connect.AsyncWaitHandle.WaitOne(250)
    if ($isOpen) {
      $client.EndConnect($connect)
    }
    $client.Close()
    return $isOpen
  } catch {
    return $false
  }
}

if (-not (Test-LocalPort -Port $port)) {
  $python = if (Test-Path -LiteralPath $bundledPython) { $bundledPython } else { "python" }
  Start-Process -FilePath $python -ArgumentList @("-m", "http.server", $port, "--bind", "127.0.0.1", "-d", $projectDir) -WindowStyle Hidden
  Start-Sleep -Milliseconds 800
}

Start-Process $url
