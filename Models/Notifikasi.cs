using System.ComponentModel.DataAnnotations;

namespace AplikasiSurat.Models
{
    public class Notifikasi
    {
        public int Id { get; set; }

        [Required]
        public string Nama { get; set; } = string.Empty;

        public string NoWa { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public DateTime? LastSent { get; set; }
    }
}
