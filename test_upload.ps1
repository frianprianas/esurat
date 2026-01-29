$filePath = "test.txt"
"test content" | Set-Content $filePath

$uri = "http://localhost:5000/api/suratmasuk/upload"
$form = @{
    NomorSurat = "123"
    Pengirim = "TestUser"
    Perihal = "TestSubject"
    TanggalSurat = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
    file = Get-Item $filePath
}

try {
    $response = Invoke-RestMethod -Uri $uri -Method Post -Form $form -Verbose
    $response
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader $_.Exception.Response.GetResponseStream()
        $body = $reader.ReadToEnd()
        Write-Host "Response Body: $body"
    }
}
