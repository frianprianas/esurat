using System.ComponentModel.DataAnnotations;

namespace AplikasiSurat.Models
{
    public class SuratMasuk
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "Nomor Surat wajib diisi")]
        public string NomorSurat { get; set; } = string.Empty;

        public DateTime TanggalMasuk { get; set; } = DateTime.Now;

        [Required(ErrorMessage = "Pengirim wajib diisi")]
        public string Pengirim { get; set; } = string.Empty;

        [Required(ErrorMessage = "Perihal wajib diisi")]
        public string Perihal { get; set; } = string.Empty;

        public string? FilePath { get; set; }
    }
}
