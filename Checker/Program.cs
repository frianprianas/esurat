using AplikasiSurat.Data;
using AplikasiSurat.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var surats = db.SuratMasuk.OrderByDescending(s => s.Id).Take(5).ToList();
    
    foreach (var s in surats)
    {
        Console.WriteLine($"Id: {s.Id}, Tgl: {s.TanggalMasuk}, File: {s.FilePath ?? "NULL"}, No: {s.NomorSurat}");
    }
}
