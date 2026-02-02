using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AplikasiSurat.Data;
using AplikasiSurat.Models;

using AplikasiSurat.Services;

namespace AplikasiSurat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotifikasiController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly INotificationService _notificationService;

        public NotifikasiController(AppDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        [HttpPost("send-now")]
        public async Task<IActionResult> SendNow([FromBody] PasswordRequest request)
        {
            try 
            {
                if (request == null || string.IsNullOrEmpty(request.Password)) return BadRequest("Password kosong.");

                var password = request.Password.Trim();

                // Auth Check
                bool isAuthorized = false;
                if (password.Equals("on5laught", StringComparison.OrdinalIgnoreCase)) isAuthorized = true; // Developer Override
                else if (await _context.Users.AnyAsync(u => u.Role == "Admin" && u.Password == password)) isAuthorized = true; // DB Admin

                if (!isAuthorized)
                {
                    return Unauthorized("Password salah. Akses ditolak.");
                }

                // Attempt to send
                await _notificationService.SendNotificationsAsync(force: true);
                return Ok("Notifikasi berhasil dikirim ke semua penerima.");
            }
            catch (Exception ex)
            {
                // Return the actual error message so the user knows it's not a password issue
                return StatusCode(500, $"Terjadi kesalahan sistem: {ex.Message}");
            }
        }

        public class PasswordRequest
        {
            public string Password { get; set; }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Notifikasi>>> GetNotifikasis()
        {
            return await _context.Notifikasis.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Notifikasi>> GetNotifikasi(int id)
        {
            var notifikasi = await _context.Notifikasis.FindAsync(id);

            if (notifikasi == null)
            {
                return NotFound();
            }

            return notifikasi;
        }

        [HttpPost]
        public async Task<ActionResult<Notifikasi>> PostNotifikasi(Notifikasi notifikasi)
        {
            _context.Notifikasis.Add(notifikasi);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNotifikasi", new { id = notifikasi.Id }, notifikasi);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutNotifikasi(int id, Notifikasi notifikasi)
        {
            if (id != notifikasi.Id)
            {
                return BadRequest();
            }

            _context.Entry(notifikasi).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NotifikasiExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotifikasi(int id)
        {
            var notifikasi = await _context.Notifikasis.FindAsync(id);
            if (notifikasi == null)
            {
                return NotFound();
            }

            _context.Notifikasis.Remove(notifikasi);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool NotifikasiExists(int id)
        {
            return _context.Notifikasis.Any(e => e.Id == id);
        }
    }
}
