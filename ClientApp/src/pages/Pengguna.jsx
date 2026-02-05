import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useLanguage } from '../contexts/LanguageContext'

export default function Pengguna() {
    const { t } = useLanguage()
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
    // We can also translate role display if needed, but 'Admin' is usually standard.
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
            alert(t('users.alert.save_fail'))
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
        if (!window.confirm(t('users.alert.delete_confirm'))) return
        try {
            await axios.delete(`/api/users/${id}`)
            fetchUsers()
        } catch (e) {
            console.error(e)
            alert(t('users.alert.delete_fail'))
        }
    }

    if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary"></div></div>

    return (
        <div className="container-fluid p-0">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold m-0" style={{ color: 'var(--text-main)' }}>{t('users.title')}</h5>
                <button
                    className="btn btn-primary btn-sm d-flex align-items-center gap-2 px-3"
                    onClick={() => {
                        setEditingUser(null)
                        setFormData({ username: '', password: '', role: 'User', canManageSuratMasuk: true, canManageSuratKeluar: true, canManagePerihal: true })
                        setShowForm(true)
                    }}
                >
                    <i className="bi bi-person-plus-fill"></i> {t('users.add_user')}
                </button>
            </div>

            <div className="card glass border-0 shadow-sm overflow-hidden" style={{ borderRadius: '15px' }}>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead>
                            <tr>
                                <th className="px-4 py-3">{t('users.table.username')}</th>
                                <th className="py-3">{t('users.table.role')}</th>
                                <th className="py-3">{t('users.table.access')}</th>
                                <th className="px-4 py-3 text-end">{t('users.table.action')}</th>
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
                                            {user.canManageSuratMasuk && <span className="badge border border-primary" style={{ color: 'var(--primary)', background: 'rgba(var(--primary-rgb), 0.1)' }}>{t('users.access.surat_masuk')}</span>}
                                            {user.canManageSuratKeluar && <span className="badge border border-success" style={{ color: 'var(--success)', background: 'rgba(var(--success-rgb), 0.1)' }}>{t('users.access.surat_keluar')}</span>}
                                            {user.canManagePerihal && <span className="badge border border-info" style={{ color: '#0ea5e9', background: 'rgba(14, 165, 233, 0.1)' }}>{t('users.access.perihal')}</span>}
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
                <div className="modal d-block fade show" style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1050 }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4" style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(20px)' }}>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-header border-bottom py-3 px-4" style={{ borderColor: 'var(--border-color)' }}>
                                    <h5 className="modal-title fw-bold" style={{ color: 'var(--text-main)' }}>{editingUser ? t('users.modal.edit_title') : t('users.modal.add_title')}</h5>
                                    <button type="button" className="btn-close" style={{ filter: 'var(--theme-icon-filter)' }} onClick={() => setShowForm(false)}></button>
                                </div>
                                <div className="modal-body p-4">
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-muted text-uppercase">{t('users.table.username')}</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.username}
                                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-muted text-uppercase">{t('auth.password')}</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={formData.password}
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                            required={!editingUser}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-muted text-uppercase">{t('users.table.role')}</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            style={{ background: 'rgba(0,0,0,0.1)', color: 'var(--text-muted)' }}
                                            value="User"
                                            readOnly
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label small fw-bold text-muted text-uppercase d-block mb-2">{t('users.table.access')}</label>
                                        <div className="form-check form-switch mb-2">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="checkMasuk"
                                                checked={formData.canManageSuratMasuk}
                                                onChange={e => setFormData({ ...formData, canManageSuratMasuk: e.target.checked })}
                                            />
                                            <label className="form-check-label" htmlFor="checkMasuk">{t('users.modal.manage_masuk')}</label>
                                        </div>
                                        <div className="form-check form-switch mb-2">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="checkKeluar"
                                                checked={formData.canManageSuratKeluar}
                                                onChange={e => setFormData({ ...formData, canManageSuratKeluar: e.target.checked })}
                                            />
                                            <label className="form-check-label" htmlFor="checkKeluar">{t('users.modal.manage_keluar')}</label>
                                        </div>
                                        <div className="form-check form-switch mb-2">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="checkPerihal"
                                                checked={formData.canManagePerihal}
                                                onChange={e => setFormData({ ...formData, canManagePerihal: e.target.checked })}
                                            />
                                            <label className="form-check-label" htmlFor="checkPerihal">{t('users.modal.manage_perihal')}</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer border-top p-3 px-4" style={{ borderColor: 'var(--border-color)' }}>
                                    <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setShowForm(false)}>{t('users.modal.cancel')}</button>
                                    <button type="submit" className="btn btn-primary rounded-pill px-4">{t('users.modal.save')}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
