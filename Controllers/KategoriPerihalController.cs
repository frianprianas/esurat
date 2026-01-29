using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AplikasiSurat.Data;
using AplikasiSurat.Models;
using Microsoft.AspNetCore.Authorization;

namespace AplikasiSurat.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class KategoriPerihalController : ControllerBase
    {
        private readonly AppDbContext _context;

        public KategoriPerihalController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<KategoriPerihal>>> GetAll()
        {
            return await _context.KategoriPerihal.ToListAsync();
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<KategoriPerihal>> Create([FromBody] KategoriPerihal item)
        {
            Console.WriteLine($"[DEBUG] Create Kategori: {item?.Nama}");
            _context.KategoriPerihal.Add(item);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAll), new { id = item.Id }, item);
        }

        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _context.KategoriPerihal.FindAsync(id);
            if (item == null) return NotFound();

            _context.KategoriPerihal.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Update(int id, [FromBody] KategoriPerihal item)
        {
            if (id != item.Id) return BadRequest();
            _context.Entry(item).State = EntityState.Modified;
            try { await _context.SaveChangesAsync(); }
            catch (DbUpdateConcurrencyException) { if (!_context.KategoriPerihal.Any(e => e.Id == id)) return NotFound(); else throw; }
            return NoContent();
        }
    }
}
