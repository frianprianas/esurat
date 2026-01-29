using System;
using System.Drawing;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using System.Windows.Forms;
using Microsoft.Win32;
using System.Security.Principal;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace DesktopUploader;

public partial class Form1 : Form
{
    private string? _filePath;
    private readonly Color _primaryColor = Color.FromArgb(2, 132, 199); // Blue from Web App
    private readonly Color _bgColor = Color.FromArgb(248, 250, 252); // Light Grayish Blue
    
    // UI Controls
    private System.Windows.Forms.TextBox txtNomor;
    private System.Windows.Forms.TextBox txtPenerima;
    private System.Windows.Forms.ComboBox cbPerihal;
    private System.Windows.Forms.TextBox txtPassword;
    private DateTimePicker dtpTanggal;
    private Button btnUpload;
    private Label lblFile;
    private Button btnInstallReg;
    private Button btnWordActive;

    public Form1(string[] args)
    {
        InitializeComponentManual();
        LoadCategories();

        if (args.Length > 0)
        {
            _filePath = args[0];
            lblFile.Text = $"📄 {Path.GetFileName(_filePath)}";
            lblFile.ForeColor = _primaryColor;
            btnInstallReg.Visible = false; 
        }
        else
        {
             lblFile.Text = "ℹ️ Klik kanan file di Explorer untuk upload cepat";
             btnInstallReg.Visible = true;
        }
    }

    private void InitializeComponentManual()
    {
        this.Text = "E-Surat Desktop Uploader";
        this.Size = new Size(420, 750);
        this.BackColor = _bgColor;
        this.StartPosition = FormStartPosition.CenterScreen;
        this.FormBorderStyle = FormBorderStyle.FixedSingle;
        this.MaximizeBox = false;

        Panel headerPanel = new Panel() { 
            Height = 80, 
            Dock = DockStyle.Top, 
            BackColor = Color.White 
        };
        Label lblTitle = new Label() { 
            Text = "Upload Surat Keluar", 
            Font = new Font("Segoe UI Semibold", 14), 
            ForeColor = _primaryColor,
            AutoSize = true,
            Left = 20,
            Top = 25
        };
        headerPanel.Controls.Add(lblTitle);
        this.Controls.Add(headerPanel);

        int y = 95;
        int spacing = 68;

        // File Label
        lblFile = new Label() { 
            Left = 25, 
            Top = y, 
            Width = 350, 
            Text = "Menunggu file...", 
            Font = new Font("Segoe UI", 9, FontStyle.Italic),
            ForeColor = Color.Gray
        };
        this.Controls.Add(lblFile);
        y += 45;

        // Nomor Surat
        CreateLabel("Nomor Surat (Dikosongkan jika AUTO)", 25, y);
        txtNomor = CreateTextBox(25, y + 22);
        y += spacing;

        // Penerima
        CreateLabel("Penerima / Tujuan", 25, y);
        txtPenerima = CreateTextBox(25, y + 22);
        y += spacing;

        // Perihal (DROPDOWN)
        CreateLabel("Perihal / Kategori", 25, y);
        cbPerihal = new ComboBox() { 
            Left = 25, 
            Top = y + 22, 
            Width = 350, 
            Font = new Font("Segoe UI", 10),
            DropDownStyle = ComboBoxStyle.DropDown,
            FlatStyle = FlatStyle.Flat
        };
        cbPerihal.Items.Add("Umum");
        cbPerihal.SelectedIndex = 0;
        this.Controls.Add(cbPerihal);
        y += spacing;

        // Tanggal Surat
        CreateLabel("Tanggal Surat Keluar", 25, y);
        dtpTanggal = new DateTimePicker() { 
            Left = 25, 
            Top = y + 22, 
            Width = 350, 
            Font = new Font("Segoe UI", 10), 
            Format = DateTimePickerFormat.Short 
        };
        this.Controls.Add(dtpTanggal);
        y += spacing + 10;

        // Password Configuration
        CreateLabel("Password Konfirmasi", 25, y);
        txtPassword = CreateTextBox(25, y + 22);
        txtPassword.UseSystemPasswordChar = true;
        y += spacing;

        // Upload Button
        btnUpload = new Button() { 
            Text = "MULAI UPLOAD", 
            Left = 25, 
            Top = y + 10, 
            Width = 350, 
            Height = 50,
            BackColor = _primaryColor,
            ForeColor = Color.White,
            Font = new Font("Segoe UI", 10, FontStyle.Bold),
            FlatStyle = FlatStyle.Flat,
            Cursor = Cursors.Hand
        };
        btnUpload.FlatAppearance.BorderSize = 0;
        btnUpload.Click += BtnUpload_Click;
        this.Controls.Add(btnUpload);

        y += 75;

        // NEW: Button Upload Active Word
        btnWordActive = new Button() { 
            Text = "📄 Ambil dari Word Aktif", 
            Left = 25, 
            Top = y, 
            Width = 350, 
            Height = 40,
            BackColor = Color.White,
            ForeColor = Color.DarkOrange,
            Font = new Font("Segoe UI", 9, FontStyle.Bold),
            FlatStyle = FlatStyle.Flat,
            Cursor = Cursors.Hand
        };
        btnWordActive.FlatAppearance.BorderColor = Color.DarkOrange;
        btnWordActive.Click += BtnWordActive_Click;
        this.Controls.Add(btnWordActive);

        y += 50;

        // Install Button (Registry)
        btnInstallReg = new Button() { 
            Text = "⚙️ Install Menu Klik Kanan", 
            Left = 25, 
            Top = y, 
            Width = 350, 
            Height = 35,
            BackColor = Color.Transparent,
            ForeColor = Color.DimGray,
            Font = new Font("Segoe UI", 9),
            FlatStyle = FlatStyle.Flat,
            Cursor = Cursors.Hand
        };
        btnInstallReg.FlatAppearance.BorderSize = 0;
        btnInstallReg.Click += BtnInstallReg_Click;
        this.Controls.Add(btnInstallReg);
    }

    private async void LoadCategories()
    {
        try {
            using var client = new HttpClient();
            var res = await client.GetStringAsync("http://localhost:5000/api/kategoriperihal");
            var cats = JsonSerializer.Deserialize<List<KategoriDto>>(res, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            
            if (cats != null && cats.Count > 0) {
                cbPerihal.Items.Clear();
                foreach (var cat in cats) {
                    cbPerihal.Items.Add(cat.Nama);
                }
                cbPerihal.SelectedIndex = 0;
            }
        } catch {
             // Fallback if server offline
        }
    }

    public class KategoriDto { public string Nama { get; set; } = ""; }

    private void CreateLabel(string text, int x, int y)
    {
        var lbl = new Label() { Text = text, Left = x, Top = y, Width = 350, Font = new Font("Segoe UI", 9, FontStyle.Bold), ForeColor = Color.DimGray };
        this.Controls.Add(lbl);
    }

    private System.Windows.Forms.TextBox CreateTextBox(int x, int y)
    {
        var txt = new System.Windows.Forms.TextBox() { 
            Left = x, 
            Top = y, 
            Width = 350, 
            Font = new Font("Segoe UI", 10),
            BorderStyle = BorderStyle.FixedSingle
        };
        this.Controls.Add(txt);
        return txt;
    }

    private void BtnInstallReg_Click(object? sender, EventArgs e)
    {
        if (!IsAdministrator())
        {
            MessageBox.Show("Harap jalankan aplikasi ini sebagai Administrator untuk menginstall menu context.", "Butuh Akses Admin", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            return;
        }

        try 
        {
            string menuName = "Upload Surat ke Server";
            string command = $"\"{System.Windows.Forms.Application.ExecutablePath}\" \"%1\"";
            
            // Register to HKEY_CLASSES_ROOT\*\shell
            using (RegistryKey key = Registry.ClassesRoot.CreateSubKey(@"*\shell\UploadSurat"))
            {
                key.SetValue(null, menuName);
                key.SetValue("Icon", "imageres.dll,15"); 
                
                using (RegistryKey commandKey = key.CreateSubKey("command"))
                {
                    commandKey.SetValue(null, command);
                }
            }
            
            MessageBox.Show("Berhasil! Sekarang Anda bisa klik kanan file apapun dan pilih 'Upload Surat ke Server'.", "Instalasi Sukses", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }
        catch (Exception ex)
        {
            MessageBox.Show($"Gagal Install Registry: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
    }

    private bool IsAdministrator()
    {
        using (WindowsIdentity identity = WindowsIdentity.GetCurrent())
        {
            WindowsPrincipal principal = new WindowsPrincipal(identity);
            return principal.IsInRole(WindowsBuiltInRole.Administrator);
        }
    }

    // ... inside Form1 class
    
    // NEW LOGIC: GRAB WORD DOC
    private async void BtnWordActive_Click(object? sender, EventArgs e)
    {
        btnWordActive.Text = "Mencari Word...";
        btnWordActive.Enabled = false;

        string tempPdfPath = Path.Combine(Path.GetTempPath(), $"word_export_{Guid.NewGuid()}.pdf");

        await Task.Run(() => {
            // dynamic type allows us to use Word without needing the referenced DLLs at runtime
            // This fixes "Could not load file or assembly 'office'" errors.
            dynamic wordApp = null;
            try {
                // Connect to running Word instance using custom helper
                // We receive a generic object, which we treat as dynamic
                wordApp = GetActiveObject("Word.Application");
                
                // Accessing properties via Reflection/Dynamic - no DLL needed!
                // Check if Documents.Count > 0
                int docCount = 0;
                try { docCount = wordApp.Documents.Count; } catch { /* ignore */ }

                if (docCount > 0)
                {
                    dynamic doc = wordApp.ActiveDocument;
                    string docName = "Document";
                    try { docName = doc.Name; } catch { }

                    this.Invoke((MethodInvoker)delegate { btnWordActive.Text = "Konversi PDF..."; });
                    
                    // Use literal enum value 17 for wdExportFormatPDF (Standard PDF format)
                    // Signature: ExportAsFixedFormat(OutputFileName, ExportFormat, ...)
                    doc.ExportAsFixedFormat(tempPdfPath, 17);
                    
                    this.Invoke((MethodInvoker)delegate {
                        _filePath = tempPdfPath;
                        lblFile.Text = $"📄 {docName} (Word Aktif)";
                        cbPerihal.Text = docName; // Auto-fill Perihal dropdown / custom text
                        btnWordActive.Text = "Sukses! Silakan Upload";
                        btnWordActive.BackColor = Color.Green;
                        btnWordActive.ForeColor = Color.White;
                    });
                } 
                else 
                {
                    throw new Exception("Tidak ada dokumen yang terbuka.");
                }
            } 
            catch (Exception ex) 
            {
                 this.Invoke((MethodInvoker)delegate {
                    MessageBox.Show($"Gagal menghubungkan ke Word: {ex.Message}\n\nPastikan Aplikasi Microsoft Word sedang TERBUKA dan ada dokumen aktif.", "Gagal Deteksi Word", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    btnWordActive.Text = "📄 Ambil dari Word Aktif (PDF)";
                 });
            }
        });
        
        btnWordActive.Enabled = true;
    }
    
    // P/Invoke Helper for .NET Core
    private static object GetActiveObject(string progId)
    {
        Guid clsid;
        CLSIDFromProgIDEx(progId, out clsid);
        
        object obj;
        GetActiveObject(ref clsid, IntPtr.Zero, out obj);
        return obj;
    }

    [DllImport("ole32.dll", PreserveSig = false)]
    private static extern void CLSIDFromProgIDEx([MarshalAs(UnmanagedType.LPWStr)] string progId, out Guid clsid);

    [DllImport("oleaut32.dll", PreserveSig = false)]
    private static extern void GetActiveObject(ref Guid rclsid, IntPtr reserved, [MarshalAs(UnmanagedType.IUnknown)] out object ppunk);

    // ... (Upload Logic) ...
    
    private async void BtnUpload_Click(object? sender, EventArgs e)
    {
        if (txtPassword.Text != "admin123") 
        {
            MessageBox.Show("Password Salah!", "Akses Ditolak", MessageBoxButtons.OK, MessageBoxIcon.Error);
            return;
        }

        if (string.IsNullOrEmpty(_filePath))
        {
            MessageBox.Show("Pilih file dulu!", "Peringatan", MessageBoxButtons.OK, MessageBoxIcon.Information);
            return;
        }

        btnUpload.Enabled = false;
        btnUpload.Text = "Mengirim...";

        try
        {
            // Bypass SSL for Dev
            var handler = new HttpClientHandler();
            handler.ServerCertificateCustomValidationCallback = (msg, cert, chain, err) => true;

            using var client = new HttpClient(handler);
            using var form = new MultipartFormDataContent();

            form.Add(new StringContent(string.IsNullOrEmpty(txtNomor.Text) ? "AUTO" : txtNomor.Text), "NomorSurat");
            form.Add(new StringContent(string.IsNullOrEmpty(txtPenerima.Text) ? "Unknown" : txtPenerima.Text), "Penerima");
            form.Add(new StringContent(string.IsNullOrEmpty(cbPerihal.Text) ? "Umum" : cbPerihal.Text), "Perihal");
            form.Add(new StringContent(dtpTanggal.Value.ToString("yyyy-MM-ddTHH:mm:ss", System.Globalization.CultureInfo.InvariantCulture)), "TanggalSurat");

            // File
            using var fileStream = new FileStream(_filePath, FileMode.Open, FileAccess.Read, FileShare.Read);
            using var fileContent = new StreamContent(fileStream);
            
            // Detect MIME type based on extension
            string mimeType = "application/octet-stream";
            string ext = Path.GetExtension(_filePath).ToLower();
            if (ext == ".pdf") mimeType = "application/pdf";
            
            fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(mimeType);
            
            form.Add(fileContent, "File", Path.GetFileName(_filePath)); 

            var response = await client.PostAsync("http://localhost:5000/api/suratkeluar/upload", form);

            if (response.IsSuccessStatusCode)
            {
                MessageBox.Show("Upload Berhasil! Data sudah masuk ke server.", "Sukses", MessageBoxButtons.OK, MessageBoxIcon.Information);
                // Reset UI if needed, but keeping open for multiple uploads is fine
            }
            else
            {
                var err = await response.Content.ReadAsStringAsync();
                MessageBox.Show($"Upload Gagal (Server {response.StatusCode}):\n{err}", "Error Upload", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
        catch (Exception ex)
        {
             MessageBox.Show($"Koneksi Error: Pastikan Server Jalan!\n{ex.Message}", "Exception", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
        finally
        {
            btnUpload.Enabled = true;
            btnUpload.Text = "Upload Dokumen";
        }
    }
}
