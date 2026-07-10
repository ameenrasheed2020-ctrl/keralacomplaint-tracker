$content = Get-Content 'diagram.mmd' -Raw
$bytes = [System.Text.Encoding]::UTF8.GetBytes($content)
$b64 = [Convert]::ToBase64String($bytes)
$b64 = $b64 -replace '\+', '-' -replace '/', '_' -replace '=', ''

$url = "https://kroki.io/mermaid/png/$b64"
Write-Host "Fetching from kroki.io..."
try {
    Invoke-WebRequest -Uri $url -OutFile 'data_flow_diagram.png'
    $f = Get-Item 'data_flow_diagram.png'
    Write-Host "OK: $($f.Length) bytes"
} catch {
    Write-Host "Kroki failed: $_"
    # Try POST method
    $body = @{ diagram_source = $content; format = 'png' } | ConvertTo-Json
    Invoke-WebRequest -Uri 'https://kroki.io/mermaid/png' -Method POST -Body $body -ContentType 'application/json' -OutFile 'data_flow_diagram.png'
    $f = Get-Item 'data_flow_diagram.png'
    Write-Host "POST OK: $($f.Length) bytes"
}
