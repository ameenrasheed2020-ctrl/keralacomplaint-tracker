$content = Get-Content 'diagram_workflow.mmd' -Raw
$body = @{ diagram_source = $content; format = 'png' } | ConvertTo-Json
Write-Host "Fetching from kroki.io..."
Invoke-WebRequest -Uri 'https://kroki.io/mermaid/png' -Method POST -Body $body -ContentType 'application/json' -OutFile 'workflow_diagram.png'
$f = Get-Item 'workflow_diagram.png'
Write-Host "OK: $($f.Length) bytes"
