using Microsoft.AspNetCore.Components.Forms;

namespace AplikasiSurat.Services
{
    public class FileService
    {
        private readonly IWebHostEnvironment _environment;

        public FileService(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        public async Task<string?> UploadFileAsync(IBrowserFile file)
        {
            if (file == null) return null;

            var uploadDir = Path.Combine(_environment.WebRootPath, "uploads");
            if (!Directory.Exists(uploadDir))
            {
                Directory.CreateDirectory(uploadDir);
            }

            // Generate safe filename
            var extension = Path.GetExtension(file.Name);
            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadDir, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                // Limit to 10MB
                await file.OpenReadStream(maxAllowedSize: 10 * 1024 * 1024).CopyToAsync(stream);
            }

            return $"/uploads/{fileName}";
        }
    }
}
