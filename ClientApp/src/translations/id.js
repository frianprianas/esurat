export const id = {
    app_name: "E-Surat",
    subtitle: "Administrasi Persuratan Digital",
    menu: {
        dashboard: "Dashboard",
        surat_masuk: "Surat Masuk",
        surat_keluar: "Surat Keluar",
        master_data: "Master Data",
        kelola_perihal: "Kelola Perihal",
        visualisasi: "Visualisasi",
        visual_masuk: "Visual Surat Masuk",
        visual_keluar: "Visual Surat Keluar",
        sistem: "Sistem",
        manajemen_pengguna: "Manajemen Pengguna",
        notifikasi: "Notifikasi Bulanan"
    },
    common: {
        logged_in_as: "Login sebagai",
        logout: "Keluar",
        search_placeholder: "Cari surat...",
        loading: "Memuat...",
        action: "Aksi",
        save: "Simpan",
        cancel: "Batal",
        edit: "Edit",
        delete: "Hapus",
        add: "Tambah",
        send: "Kirim"
    },
    dashboard: {
        total_masuk: "Total Surat Masuk",
        total_keluar: "Total Surat Keluar",
        active_users: "Pengguna Aktif",
        categories: "Kategori Surat",
        recent_activity: "Aktivitas Terbaru",
        calendar_title: "Kalender Surat",
        letters: "Surat",
        more: "lainnya...",
        incoming: "Masuk",
        outgoing: "Keluar",
        welcome: "Selamat Datang, Admin!",
        overview: "Overview Statistik",
        shortcut_desc: "Shortcut untuk aktivitas surat"
    },
    categories: {
        title: "Kelola Kategori Perihal",
        add_title: "Tambah Kategori Baru",
        edit_title: "Edit Kategori",
        name_label: "Nama Perihal",
        placeholder: "Contoh: Undangan Rapat",
        save_changes: "Simpan Perubahan",
        list_title: "Daftar Kategori",
        table_name: "Nama Kategori",
        empty_list: "Belum ada kategori",
        alert_delete: "Hapus kategori ini?",
        alert_delete_fail: "Gagal menghapus kategori",
        alert_save_fail: "Gagal menyimpan kategori"
    },
    auth: {
        welcome_back: "Selamat Datang Kembali!",
        login_subtitle: "Silakan login untuk mengakses dashboard.",
        username: "Username",
        password: "Password",
        enter_username: "Masukkan username",
        enter_password: "Masukkan password",
        login_button: "LOGIN",
        error_invalid: "Username atau password salah",
        footer: "Aplikasi Surat Sekolah",
        click_to_login: "Klik di sini untuk Login"
    },
    users: {
        title: "Manajemen Pengguna",
        add_user: "Tambah Pengguna",
        table: {
            username: "Username",
            role: "Peran",
            access: "Hak Akses",
            action: "Aksi"
        },
        access: {
            surat_masuk: "Surat Masuk",
            surat_keluar: "Surat Keluar",
            perihal: "Perihal"
        },
        modal: {
            edit_title: "Edit Pengguna",
            add_title: "Tambah Pengguna Baru",
            manage_masuk: "Kelola Surat Masuk",
            manage_keluar: "Kelola Surat Keluar",
            manage_perihal: "Kelola Perihal",
            save: "Simpan Perubahan",
            cancel: "Batal"
        },
        alert: {
            save_fail: "Gagal menyimpan data pengguna",
            delete_confirm: "Yakin ingin menghapus pengguna ini?",
            delete_fail: "Gagal menghapus pengguna"
        }
    },
    notifications: {
        title: "Daftar Notifikasi Bulanan",
        send_now: "Kirim Sekarang",
        add_recipient: "Tambah Penerima",
        table: {
            name: "Nama",
            whatsapp: "WhatsApp",
            email: "Email",
            action: "Aksi",
            empty: "Belum ada data penerima notifikasi"
        },
        send_modal: {
            title: "Konfirmasi Kirim Notifikasi",
            instruction: "Masukkan password admin untuk mengirim notifikasi secara manual sekarang.",
            placeholder: "Password Admin",
            sending: "Mengirim...",
            send: "Kirim",
            cancel: "Batal"
        },
        recipient_modal: {
            edit_title: "Edit Penerima",
            add_title: "Tambah Penerima Baru",
            full_name: "Nama Lengkap",
            whatsapp_label: "No. WhatsApp",
            whatsapp_placeholder: "Contoh: 08123456789",
            email_label: "Alamat Email",
            helper_text: "Notifikasi akan dikirim ke email ini setiap tanggal 1.",
            save: "Simpan",
            cancel: "Batal"
        },
        alert: {
            password_empty: "Password tidak boleh kosong",
            success_queued: "Notifikasi berhasil dikirim ke antrian!",
            send_fail: "Gagal mengirim notifikasi.",
            save_fail: "Gagal menyimpan data",
            delete_confirm: "Hapus data ini?",
            delete_fail: "Gagal menghapus data",
            timeout: "Tidak ada respon dari server (Timeout). Kemungkinan proses masih berjalan di background.",
            auth_fail: "Password salah. Akses ditolak."
        }
    },
    letters: {
        incoming: {
            title: "Surat Masuk",
            add: "+ Tambah Baru",
            cancel: "Batal",
            table: {
                no_surat: "No Surat",
                sender: "Pengirim",
                subject: "Perihal",
                date: "Tanggal",
                file: "File",
                actions: "Aksi",
                empty: "Belum ada data surat masuk."
            }
        },
        outgoing: {
            title: "Surat Keluar",
            add: "+ Tambah Baru",
            cancel: "Batal",
            table: {
                no_surat: "No Surat",
                receiver: "Penerima",
                subject: "Perihal",
                date: "Tanggal",
                file: "File",
                actions: "Aksi",
                empty: "Belum ada data surat keluar."
            }
        },
        form: {
            number: "Nomor Surat",
            sender: "Pengirim",
            receiver: "Penerima",
            subject: "Perihal",
            select_subject: "-- Pilih Perihal --",
            date: "Tanggal Surat",
            upload: "Upload Dokumen",
            format_hint: "Format: PDF, DOC, DOCX, ODT, JPEG",
            save: "Simpan Surat"
        },
        alert: {
            save_success_offline: "Data berhasil disimpan (Mode Offline/Demo)",
            save_success: "Data berhasil disimpan!",
            save_fail: "Gagal menyimpan data",
            delete_confirm: "Hapus data ini?"
        },
        preview: {
            view: "Lihat Preview",
            download: "Unduh",
            download_file: "Unduh File",
            download_now: "Download Sekarang",
            unavailable_title: "Preview Tidak Tersedia",
            unavailable_desc: "Browser tidak mendukung preview untuk format ini secara langsung. Silakan unduh file untuk melihat isinya.",
            unavailable_desc_short: "Format file ini tidak dapat ditampilkan secara langsung."
        }
    },
    pagination: {
        showing: "Menampilkan",
        to: "-",
        from: "dari",
        data: "data"
    },
    visual: {
        title: "Visual Arsip: Surat",
        incoming: "Masuk",
        outgoing: "Keluar",
        hint: "Klik ujung halaman untuk membalik",
        empty: "Belum ada data untuk ditampilkan.",
        page: "Halaman",
        cover: {
            app_name: "ARSIP DIGITAL",
            year: "Tahun",
            end_title: "Akhir Dokumen",
            end_desc: "Seluruh arsip telah ditampilkan.",
            back_to_start: "Kembali ke Awal"
        },
        detail: {
            sender: "Pengirim: ",
            receiver: "Penerima: ",
            view: "Lihat Detail",
            no_doc: "Belum ada dokumen"
        }
    },
    addin: {
        title: "Upload ke E-Surat",
        status: {
            ready: "Siap.",
            connected: "Terhubung dengan MS Word.",
            not_in_word: "Silakan buka halaman ini di dalam MS Word.",
            reading: "Membaca dokumen...",
            uploading: "Mengupload ke server...",
            success: "✅ SUKSES! Surat terkirim.",
            fail: "❌ Gagal upload",
            error_read: "Gagal membaca file",
            error_slice: "Gagal mengambil slice."
        },
        button: {
            upload: "Upload PDF",
            sending: "Mengirim..."
        },
        alert: {
            must_in_word: "Harus dijalankan di dalam MS Word!"
        },
        footer: {
            server_hint: "Pastikan API Server berjalan.",
            convert_hint: "Dokumen akan dikonversi otomatis ke PDF."
        },
        data: {
            sender_default: "Pengguna MS Word",
            subject_default: "Dokumen dari MS Word Add-in"
        }
    },
    layout: {
        no_results: "Tidak ditemukan data.",
        to_recipient: "Kpd:"
    }
}
