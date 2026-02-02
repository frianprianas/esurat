using Microsoft.EntityFrameworkCore;
using AplikasiSurat.Data;

namespace AplikasiSurat.Services
{
    public interface INotificationService
    {
        Task SendNotificationsAsync(bool force = false);
    }

    public class NotificationService : INotificationService
    {
        private readonly AppDbContext _context;
        private readonly IEmailSenderService _emailService;
        private readonly IWhatsAppSenderService _waService;

        public NotificationService(AppDbContext context, IEmailSenderService emailService, IWhatsAppSenderService waService)
        {
            _context = context;
            _emailService = emailService;
            _waService = waService;
        }

        public async Task SendNotificationsAsync(bool force = false)
        {
            try
            {
                var recipients = await _context.Notifikasis.ToListAsync();
                
                // Get Stats
                var countMasuk = await _context.SuratMasuk.CountAsync();
                var countKeluar = await _context.SuratKeluar.CountAsync();

                // Get Current Month Year in ID
                var culture = new System.Globalization.CultureInfo("id-ID");
                var bulanTahun = DateTime.Now.ToString("MMMM yyyy", culture);

                foreach (var recipient in recipients)
                {
                    // If not forced (scheduled run), check if we already sent this month
                    if (!force)
                    {
                        if (recipient.LastSent.HasValue && 
                            recipient.LastSent.Value.Month == DateTime.Now.Month && 
                            recipient.LastSent.Value.Year == DateTime.Now.Year)
                        {
                            continue;
                        }
                    }

                    var subject = $"Notifikasi Bulanan E-Surat - {bulanTahun}";
                    var body = $@"
                        <h3>Selamat Pagi Bapak / Ibu {recipient.Nama}</h3>
                        <p>Berikut adalah laporan statistik surat untuk bulan <strong>{bulanTahun}</strong>:</p>
                        <p>Kami informasikan bahwa jumlah surat masuk yang terekap adalah <strong>{countMasuk}</strong> dan surat keluar adalah <strong>{countKeluar}</strong>.</p>
                        <p>E-Surat SMK Bakti Nusantara 666</p>
                    ";

                    await _emailService.SendEmailAsync(recipient.Email, subject, body);

                    // Send WhatsApp
                    if (!string.IsNullOrEmpty(recipient.NoWa))
                    {
                        var waMessage = $@"Selamat Pagi Bapak / Ibu {recipient.Nama}

Berikut adalah laporan statistik surat untuk bulan {bulanTahun}:
Kami informasikan bahwa jumlah surat masuk yang terekap adalah {countMasuk} dan surat keluar adalah {countKeluar}.

E-Surat SMK Bakti Nusantara 666";
                        await _waService.SendWhatsAppAsync(recipient.NoWa, waMessage);
                    }
                    
                    recipient.LastSent = DateTime.Now;
                }
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in notification service: {ex.Message}");
                throw;
            }
        }
    }
}
