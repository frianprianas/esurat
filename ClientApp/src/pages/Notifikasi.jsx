import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Notifikasi() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingItem, setEditingItem] = useState(null)
    const [formData, setFormData] = useState({
        nama: '',
        noWa: '',
        email: ''
    })
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [adminPassword, setAdminPassword] = useState('')
    const [isSending, setIsSending] = useState(false)

    const handleSendNow = async () => {
        if (!adminPassword) return alert("Password tidak boleh kosong")

        setIsSending(true)
        try {
            await axios.post('/api/notifikasi/send-now', { password: adminPassword })
            alert('Notifikasi berhasil dikirim ke antrian!')
            setShowPasswordModal(false)
            setAdminPassword('')
        } catch (e) {
            console.error("SendNow Error:", e)

            let errorMsg = 'Gagal mengirim notifikasi.'

            if (e.response) {
                if (e.response.status === 401) {
                    errorMsg = typeof e.response.data === 'string' ? e.response.data : "Password salah. Akses ditolak.";
                } else if (e.response.data) {
                    errorMsg = typeof e.response.data === 'string' ? e.response.data : JSON.stringify(e.response.data);
                } else {
                    errorMsg += ` Status: ${e.response.status}`;
                }
            } else if (e.request) {
                errorMsg = "Tidak ada respon dari server (Timeout). Kemungkinan proses masih berjalan di background.";
            } else {
                errorMsg = e.message;
            }

            alert(errorMsg)
        } finally {
            setIsSending(false)
        }
    }

    useEffect(() => {
        fetchItems()
    }, [])

    const fetchItems = async () => {
        try {
            const res = await axios.get('/api/notifikasi')
            if (Array.isArray(res.data)) {
                setItems(res.data)
            } else {
                console.error("API did not return an array:", res.data)
                setItems([])
            }
        } catch (e) {
            console.error(e)
            setItems([])
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingItem) {
                await axios.put(`/api/notifikasi/${editingItem.id}`, { ...formData, id: editingItem.id })
            } else {
                await axios.post('/api/notifikasi', formData)
            }
            setShowForm(false)
            fetchItems()
            setFormData({ nama: '', noWa: '', email: '' })
        } catch (e) {
            alert('Gagal menyimpan data')
        }
    }

    const handleDelete = async (id) => {
        if (confirm('Hapus data ini?')) {
            try {
                await axios.delete(`/api/notifikasi/${id}`)
                fetchItems()
            } catch (e) {
                alert('Gagal menghapus data')
            }
        }
    }

    return (
        <div className="container-fluid p-0">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold m-0" style={{ color: 'var(--text-main)' }}>Daftar Notifikasi Bulanan</h5>
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-warning btn-sm d-flex align-items-center gap-2 px-3 text-white"
                        onClick={() => setShowPasswordModal(true)}
                    >
                        <i className="bi bi-send-fill"></i> Kirim Sekarang
                    </button>
                    <button
                        className="btn btn-primary btn-sm d-flex align-items-center gap-2 px-3"
                        onClick={() => {
                            setEditingItem(null)
                            setFormData({ nama: '', noWa: '', email: '' })
                            setShowForm(true)
                        }}
                    >
                        <i className="bi bi-plus-lg"></i> Tambah Penerima
                    </button>
                </div>
            </div>

            {/* Password Modal */}
            {showPasswordModal && (
                <div className="modal d-block fade show" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4" style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(20px)' }}>
                            <div className="modal-header border-bottom-0">
                                <h5 className="modal-title fw-bold" style={{ color: 'var(--text-main)' }}>Konfirmasi Kirim Notifikasi</h5>
                                <button type="button" className="btn-close" onClick={() => setShowPasswordModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Masukkan password admin untuk mengirim notifikasi secara manual sekarang.</p>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Password Admin"
                                    value={adminPassword}
                                    onChange={e => setAdminPassword(e.target.value)}
                                />
                            </div>
                            <div className="modal-footer border-top-0">
                                <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowPasswordModal(false)} disabled={isSending}>Batal</button>
                                <button
                                    type="button"
                                    className="btn btn-warning text-white rounded-pill px-4 fw-bold d-flex align-items-center gap-2"
                                    onClick={handleSendNow}
                                    disabled={isSending}
                                >
                                    {isSending ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            Mengirim...
                                        </>
                                    ) : (
                                        <>
                                            Kirim
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="card glass border-0 shadow-sm overflow-hidden" style={{ borderRadius: '15px' }}>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead style={{ background: 'var(--bg-gradient-start)' }}>
                            <tr>
                                <th className="ps-4">Nama</th>
                                <th>WhatsApp</th>
                                <th>Email</th>
                                <th className="text-end pe-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" className="text-center py-4">Loading...</td></tr>
                            ) : items.length === 0 ? (
                                <tr><td colSpan="4" className="text-center py-4 text-muted">Belum ada data penerima notifikasi</td></tr>
                            ) : (
                                items.map(item => (
                                    <tr key={item.id}>
                                        <td className="ps-4 fw-bold">{item.nama}</td>
                                        <td>{item.noWa || '-'}</td>
                                        <td>{item.email}</td>
                                        <td className="text-end pe-4">
                                            <button
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => {
                                                    setEditingItem(item)
                                                    setFormData({
                                                        nama: item.nama,
                                                        noWa: item.noWa,
                                                        email: item.email
                                                    })
                                                    setShowForm(true)
                                                }}
                                            >
                                                <i className="bi bi-pencil-fill"></i>
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <i className="bi bi-trash-fill"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Form */}
            {showForm && (
                <div className="modal d-block fade show" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4" style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(20px)' }}>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-header border-bottom-0">
                                    <h5 className="modal-title fw-bold" style={{ color: 'var(--text-main)' }}>{editingItem ? 'Edit Penerima' : 'Tambah Penerima Baru'}</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowForm(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label small text-uppercase text-muted fw-bold">Nama Lengkap</label>
                                        <input
                                            className="form-control"
                                            value={formData.nama}
                                            onChange={e => setFormData({ ...formData, nama: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small text-uppercase text-muted fw-bold">No. WhatsApp</label>
                                        <input
                                            className="form-control"
                                            value={formData.noWa}
                                            onChange={e => setFormData({ ...formData, noWa: e.target.value })}
                                            placeholder="Contoh: 08123456789"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small text-uppercase text-muted fw-bold">Alamat Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                        <div className="form-text text-muted small">Notifikasi akan dikirim ke email ini setiap tanggal 1.</div>
                                    </div>
                                </div>
                                <div className="modal-footer border-top-0">
                                    <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowForm(false)}>Batal</button>
                                    <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold">Simpan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
