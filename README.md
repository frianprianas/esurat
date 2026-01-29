# Aplikasi Surat SMK Bakti Nusantara 666

Aplikasi manajemen surat masuk dan surat keluar berbasis web menggunakan ASP.NET Core Blazor dan SQL Server.

## Fitur
- **Dashboard**: Statistik jumlah surat masuk dan keluar.
- **Surat Masuk**: Pencatatan surat masuk, edit, hapus, dan upload file scan surat.
- **Surat Keluar**: Pencatatan surat keluar, edit, hapus, dan upload file scan surat.
- **Upload File**: Mendukung upload file (PDF/Gambar) untuk arsip digital.

## Persyaratan Sistem
- .NET 8.0 SDK atau lebih baru.
- SQL Server Express (LocalDB atau instance `.\SQLEXPRESS`).

## Konfigurasi Database
Connection string dikonfigurasi di `appsettings.json`:
```json
"DefaultConnection": "Server=.\\SQLEXPRESS;Database=AplikasiSuratDB;User Id=admin;Password=on5laught;TrustServerCertificate=True;MultipleActiveResultSets=true"
```
Pastikan user `admin` dengan password `on5laught` sudah dibuat di SQL Server, atau sesuaikan connection string dengan otentikasi Windows jika diperlukan.

## Cara Menjalankan Aplikasi
1. Buka terminal di folder proyek.
2. Jalankan perintah:
   ```bash
   dotnet run
   ```
3. Buka browser dan akses alamat yang muncul (biasanya `http://localhost:5000` atau `https://localhost:5001`).

## Struktur Proyek
- **Components/Pages**: Halaman antarmuka (UI) Blazor.
- **Services**: Logika bisnis dan akses data.
- **Models**: Definisi struktur data (SuratMasuk, SuratKeluar).
- **Data**: Konfigurasi Entity Framework Core.
- **wwwroot/uploads**: Direktori penyimpanan file yang diupload.
