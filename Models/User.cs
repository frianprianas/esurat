using System.ComponentModel.DataAnnotations;

namespace AplikasiSurat.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = "User"; // Admin, User
        public bool CanManageSuratMasuk { get; set; } = true;
        public bool CanManageSuratKeluar { get; set; } = true;
        public bool CanManagePerihal { get; set; } = true;
    }
}
