using Microsoft.EntityFrameworkCore;
using AplikasiSurat.Data;
using AplikasiSurat.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);
// builder.WebHost.UseUrls("http://0.0.0.0:5000"); // Allow default launch settings or explicit https
builder.WebHost.UseUrls("https://0.0.0.0:5001", "http://0.0.0.0:5000");

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddDbContext<AppDbContext>(op => op.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<MailService>();
builder.Services.AddScoped<FileService>();
builder.Services.AddScoped<IEmailSenderService, EmailSenderService>();
builder.Services.AddScoped<IWhatsAppSenderService, FonnteWhatsAppService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddHostedService<NotificationSchedulerService>();

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(o => {
    o.ExpireTimeSpan = TimeSpan.FromDays(1);
    o.SlidingExpiration = true;
    o.Cookie.HttpOnly = true;
    o.Cookie.SameSite = SameSiteMode.Lax;
});
builder.Services.AddAuthorization();

builder.Services.AddCors(o => o.AddPolicy("AllowAll", b => b.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));
builder.Services.AddAntiforgery(o => o.SuppressXFrameOptionsHeader = true); 

var app = builder.Build();

// app.UseHttpsRedirection(); // Enable HTTPS
app.UseStaticFiles(); // Serves files from wwwroot
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
        Path.Combine(builder.Environment.ContentRootPath, "ClientApp", "dist")),
    RequestPath = ""
});

app.UseRouting();

// ... existing middleware ...

app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
// app.UseAntiforgery(); // Often causes issues with simple upload APIs if not handled carefully

app.MapControllers();
app.MapGet("/api/ping", () => "pong-v2");

// Fallback to index.html for SPA
app.MapFallbackToFile("index.html", new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
        Path.Combine(builder.Environment.ContentRootPath, "ClientApp", "dist"))
});

try {
    using var scope = app.Services.CreateScope();
    var ctx = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await ctx.Database.MigrateAsync();

   // Seed Kategori Perihal
   if (!ctx.KategoriPerihal.Any())
   {
       ctx.KategoriPerihal.AddRange(
           new AplikasiSurat.Models.KategoriPerihal { Nama = "Pengumuman" },
           new AplikasiSurat.Models.KategoriPerihal { Nama = "Undangan Rapat" },
           new AplikasiSurat.Models.KategoriPerihal { Nama = "Surat Tugas" },
           new AplikasiSurat.Models.KategoriPerihal { Nama = "Pemberitahuan Libur" }
       );
       await ctx.SaveChangesAsync();
   }
} catch (Exception ex) {
    Console.WriteLine("DB Init Error: " + ex.Message);
}

app.Run();
