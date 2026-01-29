using System.ComponentModel.DataAnnotations;

namespace AplikasiSurat.Models
{
    public class SuratKeluar
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Nomor Surat wajib diisi")]
        public string NomorSurat { get; set; } = string.Empty;

        public DateTime TanggalKeluar { get; set; } = DateTime.Now;

        [Required(ErrorMessage = "Penerima wajib diisi")]
        public string Penerima { get; set; } = string.Empty;

        [Required(ErrorMessage = "Perihal wajib diisi")]
        public string Perihal { get; set; } = string.Empty;

        public string? FilePath { get; set; }
    }
}
