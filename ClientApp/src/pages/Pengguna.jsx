import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Pengguna() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingUser, setEditingUser] = useState(null)
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'User',
        canManageSuratMasuk: true,
        canManageSuratKeluar: true,
        canManagePerihal: true
    })

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
    const isAdmin = currentUser.role === 'Admin'

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const res = await axios.get('/api/users')
            setUsers(res.data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingUser) {
                await axios.put(`/api/users/${editingUser.id}`, { ...formData, id: editingUser.id })
            } else {
                await axios.post('/api/users', formData)
            }
            setShowForm(false)
            setEditingUser(null)
            setFormData({ username: '', password: '', role: 'User', canManageSuratMasuk: true, canManageSuratKeluar: true, canManagePerihal: true })
            fetchUsers()
        } catch (e) {
            console.error(e)
            alert('Gagal menyimpan data pengguna')
        }
    }

    const handleEdit = (user) => {
        setEditingUser(user)
        setFormData({
            username: user.username,
            password: user.password,
            role: user.role,
            canManageSuratMasuk: user.canManageSuratMasuk,
            canManageSuratKeluar: user.canManageSuratKeluar,
            canManagePerihal: user.canManagePerihal
        })
        setShowForm(true)
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Yakin ingin menghapus pengguna ini?')) return
        try {
            await axios.delete(`/api/users/${id}`)
            fetchUsers()
        } catch (e) {
            console.error(e)
            alert('Gagal menghapus pengguna')
        }
    }

    if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary"></div></div>

    return (
        <div className="container-fluid p-0">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold m-0 text-dark">Manajemen Pengguna</h3>
                <button
                    className="btn btn-primary d-flex align-items-center gap-2"
                    onClick={() => {
                        setEditingUser(null)
                        setFormData({ username: '', password: '', role: 'User', canManageSuratMasuk: true, canManageSuratKeluar: true, canManagePerihal: true })
                        setShowForm(true)
                    }}
                >
                    <i className="bi bi-person-plus-fill"></i> Tambah Pengguna
                </button>
            </div>

            <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: '15px' }}>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="px-4 py-3">Username</th>
                                <th className="py-3">Role</th>
                                <th className="py-3">Hak Akses</th>
                                <th className="px-4 py-3 text-end">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td className="px-4 fw-bold">{user.username}</td>
                                    <td>
                                        <span className={`badge ${user.role === 'Admin' ? 'bg-danger' : 'bg-primary'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="d-flex flex-wrap gap-1">
                                            {user.canManageSuratMasuk && <span className="badge bg-light text-primary border border-primary">Surat Masuk</span>}
                                            {user.canManageSuratKeluar && <span className="badge bg-light text-success border border-success">Surat Keluar</span>}
                                            {user.canManagePerihal && <span className="badge bg-light text-info border border-info">Perihal</span>}
                                        </div>
                                    </td>
                                    <td className="px-4 text-end">
                                        <button className="btn btn-sm btn-outline-warning me-2" onClick={() => handleEdit(user)}>
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        {isAdmin && user.role !== 'Admin' && (
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(user.id)}>
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Form */}
            {showForm && (
                <div className="modal d-block fade show" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4">
                            <form onSubmit={handleSubmit}>
                                <div className="modal-header border-bottom py-3 px-4">
                                    <h5 className="modal-title fw-bold">{editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowForm(false)}></button>
                                </div>
                                <div className="modal-body p-4">
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-muted text-uppercase">Username</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.username}
                                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-muted text-uppercase">Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={formData.password}
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                            required={!editingUser}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-muted text-uppercase">Role</label>
                                        <input
                                            type="text"
                                            className="form-control bg-light"
                                            value="User"
                                            readOnly
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label small fw-bold text-muted text-uppercase d-block mb-2">Hak Akses</label>
                                        <div className="form-check form-switch mb-2">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="checkMasuk"
                                                checked={formData.canManageSuratMasuk}
                                                onChange={e => setFormData({ ...formData, canManageSuratMasuk: e.target.checked })}
                                            />
                                            <label className="form-check-label" htmlFor="checkMasuk">Kelola Surat Masuk</label>
                                        </div>
                                        <div className="form-check form-switch mb-2">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="checkKeluar"
                                                checked={formData.canManageSuratKeluar}
                                                onChange={e => setFormData({ ...formData, canManageSuratKeluar: e.target.checked })}
                                            />
                                            <label className="form-check-label" htmlFor="checkKeluar">Kelola Surat Keluar</label>
                                        </div>
                                        <div className="form-check form-switch mb-2">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="checkPerihal"
                                                checked={formData.canManagePerihal}
                                                onChange={e => setFormData({ ...formData, canManagePerihal: e.target.checked })}
                                            />
                                            <label className="form-check-label" htmlFor="checkPerihal">Kelola Perihal</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer border-top p-3 px-4">
                                    <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowForm(false)}>Batal</button>
                                    <button type="submit" className="btn btn-primary rounded-pill px-4">Simpan Perubahan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
