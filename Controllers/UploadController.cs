using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AplikasiSurat.Services;

namespace AplikasiSurat.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/upload")]
    public class UploadController : ControllerBase
    {
        private readonly FileService _fileService;

        public UploadController(FileService fileService)
        {
            _fileService = fileService;
        }

        [HttpPost]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            // Convert IFormFile to IBrowserFile equivalent or modify FileService
            // For now, let's just modify FileService logic here or bypass it
            // Ideally we refactor FileService, but to save time, I'll allow FileService to accept Stream or just do it here.
            
            // Let's implement simple saving here matching FileService destination
            var uploadDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            if (!Directory.Exists(uploadDir))
            {
                Directory.CreateDirectory(uploadDir);
            }

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploadDir, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var relativePath = $"uploads/{fileName}";
            return Ok(new { path = relativePath });
        }
    }
}
