using AplikasiSurat.Data;
using AplikasiSurat.Models;
using Microsoft.EntityFrameworkCore;

namespace AplikasiSurat.Services
{
    public class MailService
    {
        private readonly AppDbContext _context;

        public MailService(AppDbContext context)
        {
            _context = context;
        }

        // Surat Masuk
        public async Task<List<SuratMasuk>> GetSuratMasukAsync()
        {
            return await _context.SuratMasuk.OrderByDescending(s => s.TanggalMasuk).ToListAsync();
        }

        public async Task<SuratMasuk?> GetSuratMasukByIdAsync(int id)
        {
            return await _context.SuratMasuk.FindAsync(id);
        }

        public async Task AddSuratMasukAsync(SuratMasuk surat)
        {
            _context.SuratMasuk.Add(surat);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateSuratMasukAsync(SuratMasuk surat)
        {
            _context.SuratMasuk.Update(surat);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteSuratMasukAsync(int id)
        {
            var surat = await _context.SuratMasuk.FindAsync(id);
            if (surat != null)
            {
                _context.SuratMasuk.Remove(surat);
                await _context.SaveChangesAsync();
            }
        }

        // Surat Keluar
        public async Task<List<SuratKeluar>> GetSuratKeluarAsync()
        {
            return await _context.SuratKeluar.OrderByDescending(s => s.TanggalKeluar).ToListAsync();
        }

        public async Task<SuratKeluar?> GetSuratKeluarByIdAsync(int id)
        {
            return await _context.SuratKeluar.FindAsync(id);
        }

        public async Task AddSuratKeluarAsync(SuratKeluar surat)
        {
            _context.SuratKeluar.Add(surat);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateSuratKeluarAsync(SuratKeluar surat)
        {
            _context.SuratKeluar.Update(surat);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteSuratKeluarAsync(int id)
        {
            var surat = await _context.SuratKeluar.FindAsync(id);
            if (surat != null)
            {
                _context.SuratKeluar.Remove(surat);
                await _context.SaveChangesAsync();
            }
        }
    }
}
