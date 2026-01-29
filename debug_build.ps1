dotnet build AplikasiSurat.csproj > build.log 2>&1
Get-Content build.log | Select-Object -First 50
