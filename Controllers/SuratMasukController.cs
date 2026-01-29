using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AplikasiSurat.Models;
using AplikasiSurat.Services;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace AplikasiSurat.Controllers
{
    // [Authorize] 
    [ApiController]
    [Route("api/[controller]")]
    public class SuratMasukController : ControllerBase
    {
        private readonly MailService _mailService;
        private readonly IWebHostEnvironment _env;

        public SuratMasukController(MailService mailService, IWebHostEnvironment env)
        {
            _mailService = mailService;
            _env = env;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<List<SuratMasuk>>> GetAll()
        {
            return await _mailService.GetSuratMasukAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SuratMasuk>> GetById(int id)
        {
            var item = await _mailService.GetSuratMasukByIdAsync(id);
            if (item == null) return NotFound();
            return item;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SuratMasuk surat)
        {
            await _mailService.AddSuratMasukAsync(surat);
            return CreatedAtAction(nameof(GetById), new { id = surat.Id }, surat);
        }

        [HttpPost("upload")]
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> CreateWithUpload([FromForm] UploadDto dto)
        {
            Console.WriteLine($"[UPLOAD DEBUG] Request Received. Nomor: {dto.NomorSurat}");
            
            try 
            {
                var surat = new SuratMasuk
                {
                    NomorSurat = dto.NomorSurat ?? "-",
                    Pengirim = dto.Pengirim ?? "-",
                    Perihal = dto.Perihal ?? "-",
                    TanggalMasuk = dto.TanggalSurat
                };

                if (dto.File != null && dto.File.Length > 0)
                {
                    Console.WriteLine($"[UPLOAD DEBUG] Saving File: {dto.File.FileName} (Size: {dto.File.Length} bytes)");
                    
                    // Use WebRootPath from IWebHostEnvironment which is safer
                    var uploadDir = Path.Combine(_env.WebRootPath, "uploads");
                    if (!Directory.Exists(uploadDir)) 
                    {
                        Console.WriteLine($"[UPLOAD DEBUG] Creating directory: {uploadDir}");
                        Directory.CreateDirectory(uploadDir);
                    }

                    var safeFileName = Path.GetFileName(dto.File.FileName);
                    var fileName = $"{Guid.NewGuid()}_{safeFileName}"; 
                    var filePath = Path.Combine(uploadDir, fileName);
                    
                    Console.WriteLine($"[UPLOAD DEBUG] Writing to: {filePath}");

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await dto.File.CopyToAsync(stream);
                    }

                    // Verify file size after write
                    var fileInfo = new FileInfo(filePath);
                    Console.WriteLine($"[UPLOAD DEBUG] File written successfully. Disk Size: {fileInfo.Length} bytes");

                    surat.FilePath = fileName;
                }
                else
                {
                     Console.WriteLine($"[UPLOAD DEBUG] No file attached or empty file.");
                }

                await _mailService.AddSuratMasukAsync(surat);
                Console.WriteLine("[UPLOAD DEBUG] Success saved to DB");
                return Ok(new { message = "Sukses upload surat", data = surat });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[UPLOAD DEBUG] Error: {ex.Message}");
                if (ex.InnerException != null) Console.WriteLine($"Inner: {ex.InnerException.Message}");
                // Log stack trace for deeper debug
                 Console.WriteLine($"Stack: {ex.StackTrace}");
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] SuratMasuk surat)
        {
            if (id != surat.Id) return BadRequest();
            await _mailService.UpdateSuratMasukAsync(surat);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _mailService.DeleteSuratMasukAsync(id);
            return NoContent();
        }
    }

    public class UploadDto
    {
        public string? NomorSurat { get; set; }
        public string? Pengirim { get; set; }
        public string? Perihal { get; set; }
        public DateTime TanggalSurat { get; set; } = DateTime.Now;
        public IFormFile? File { get; set; }
    }
}
