using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AplikasiSurat.Models;
using AplikasiSurat.Services;

namespace AplikasiSurat.Controllers
{
    // [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SuratKeluarController : ControllerBase
    {
        private readonly MailService _mailService;

        private readonly IWebHostEnvironment _env;

        public SuratKeluarController(MailService mailService, IWebHostEnvironment env)
        {
            _mailService = mailService;
            _env = env;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<List<SuratKeluar>>> GetAll()
        {
            return await _mailService.GetSuratKeluarAsync();
        }

        [HttpGet("test")]
        [AllowAnonymous]
        public string Test()
        {
            return "Controller Accessible";
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SuratKeluar>> GetById(int id)
        {
            var item = await _mailService.GetSuratKeluarByIdAsync(id);
            if (item == null) return NotFound();
            return item;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Create([FromBody] SuratKeluar surat)
        {
            await _mailService.AddSuratKeluarAsync(surat);
            return CreatedAtAction(nameof(GetById), new { id = surat.Id }, surat);
        }

        [HttpPost("upload")]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> CreateWithUpload([FromForm] SuratKeluarUploadDto dto)
        {
            Console.WriteLine($"[UPLOAD OUT DEBUG] Request Received. Nomor: {dto.NomorSurat}");
            
            try 
            {
                var surat = new SuratKeluar
                {
                    NomorSurat = dto.NomorSurat ?? "-",
                    Penerima = dto.Penerima ?? "-",
                    Perihal = dto.Perihal ?? "-",
                    TanggalKeluar = dto.TanggalSurat
                };

                if (dto.File != null && dto.File.Length > 0)
                {
                    Console.WriteLine($"[UPLOAD OUT DEBUG] Saving File: {dto.File.FileName} (Size: {dto.File.Length} bytes)");
                    
                    var uploadDir = Path.Combine(_env.WebRootPath, "uploads");
                    if (!Directory.Exists(uploadDir)) 
                    {
                        Directory.CreateDirectory(uploadDir);
                    }

                    var safeFileName = Path.GetFileName(dto.File.FileName);
                    var fileName = $"{Guid.NewGuid()}_{safeFileName}"; 
                    var filePath = Path.Combine(uploadDir, fileName);
                    
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await dto.File.CopyToAsync(stream);
                    }

                    surat.FilePath = fileName;
                }

                await _mailService.AddSuratKeluarAsync(surat);
                return Ok(new { message = "Sukses upload surat keluar", data = surat });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[UPLOAD OUT DEBUG] Error: {ex.Message}");
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Update(int id, [FromBody] SuratKeluar surat)
        {
            if (id != surat.Id) return BadRequest();
            await _mailService.UpdateSuratKeluarAsync(surat);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Delete(int id)
        {
            await _mailService.DeleteSuratKeluarAsync(id);
            return NoContent();
        }
    }

    public class SuratKeluarUploadDto
    {
        public string? NomorSurat { get; set; }
        public string? Penerima { get; set; }
        public string? Perihal { get; set; }
        public DateTime TanggalSurat { get; set; } = DateTime.Now;
        public IFormFile? File { get; set; }
    }
}
