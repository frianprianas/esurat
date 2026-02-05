import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useLanguage } from '../contexts/LanguageContext'

export default function Notifikasi() {
    const { t } = useLanguage()
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
        if (!adminPassword) return alert(t('notifications.alert.password_empty'))

        setIsSending(true)
        try {
            await axios.post('/api/notifikasi/send-now', { password: adminPassword })
            alert(t('notifications.alert.success_queued'))
            setShowPasswordModal(false)
            setAdminPassword('')
        } catch (e) {
            console.error("SendNow Error:", e)

            let errorMsg = t('notifications.alert.send_fail')

            if (e.response) {
                if (e.response.status === 401) {
                    errorMsg = typeof e.response.data === 'string' ? e.response.data : t('notifications.alert.auth_fail');
                } else if (e.response.data) {
                    errorMsg = typeof e.response.data === 'string' ? e.response.data : JSON.stringify(e.response.data);
                } else {
                    errorMsg += ` Status: ${e.response.status}`;
                }
            } else if (e.request) {
                errorMsg = t('notifications.alert.timeout');
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
            alert(t('notifications.alert.save_fail'))
        }
    }

    const handleDelete = async (id) => {
        if (confirm(t('notifications.alert.delete_confirm'))) {
            try {
                await axios.delete(`/api/notifikasi/${id}`)
                fetchItems()
            } catch (e) {
                alert(t('notifications.alert.delete_fail'))
            }
        }
    }

    return (
        <div className="container-fluid p-0">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold m-0" style={{ color: 'var(--text-main)' }}>{t('notifications.title')}</h5>
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-warning btn-sm d-flex align-items-center gap-2 px-3 text-white"
                        onClick={() => setShowPasswordModal(true)}
                    >
                        <i className="bi bi-send-fill"></i> {t('notifications.send_now')}
                    </button>
                    <button
                        className="btn btn-primary btn-sm d-flex align-items-center gap-2 px-3"
                        onClick={() => {
                            setEditingItem(null)
                            setFormData({ nama: '', noWa: '', email: '' })
                            setShowForm(true)
                        }}
                    >
                        <i className="bi bi-plus-lg"></i> {t('notifications.add_recipient')}
                    </button>
                </div>
            </div>

            {/* Password Modal */}
            {showPasswordModal && (
                <div className="modal d-block fade show" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4" style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(20px)' }}>
                            <div className="modal-header border-bottom-0">
                                <h5 className="modal-title fw-bold" style={{ color: 'var(--text-main)' }}>{t('notifications.send_modal.title')}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowPasswordModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>{t('notifications.send_modal.instruction')}</p>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder={t('notifications.send_modal.placeholder')}
                                    value={adminPassword}
                                    onChange={e => setAdminPassword(e.target.value)}
                                />
                            </div>
                            <div className="modal-footer border-top-0">
                                <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowPasswordModal(false)} disabled={isSending}>{t('notifications.send_modal.cancel')}</button>
                                <button
                                    type="button"
                                    className="btn btn-warning text-white rounded-pill px-4 fw-bold d-flex align-items-center gap-2"
                                    onClick={handleSendNow}
                                    disabled={isSending}
                                >
                                    {isSending ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            {t('notifications.send_modal.sending')}
                                        </>
                                    ) : (
                                        <>
                                            {t('notifications.send_modal.send')}
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
                                <th className="ps-4">{t('notifications.table.name')}</th>
                                <th>{t('notifications.table.whatsapp')}</th>
                                <th>{t('notifications.table.email')}</th>
                                <th className="text-end pe-4">{t('notifications.table.action')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" className="text-center py-4">{t('common.loading')}</td></tr>
                            ) : items.length === 0 ? (
                                <tr><td colSpan="4" className="text-center py-4 text-muted">{t('notifications.table.empty')}</td></tr>
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
                                    <h5 className="modal-title fw-bold" style={{ color: 'var(--text-main)' }}>{editingItem ? t('notifications.recipient_modal.edit_title') : t('notifications.recipient_modal.add_title')}</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowForm(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label small text-uppercase text-muted fw-bold">{t('notifications.recipient_modal.full_name')}</label>
                                        <input
                                            className="form-control"
                                            value={formData.nama}
                                            onChange={e => setFormData({ ...formData, nama: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small text-uppercase text-muted fw-bold">{t('notifications.recipient_modal.whatsapp_label')}</label>
                                        <input
                                            className="form-control"
                                            value={formData.noWa}
                                            onChange={e => setFormData({ ...formData, noWa: e.target.value })}
                                            placeholder={t('notifications.recipient_modal.whatsapp_placeholder')}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small text-uppercase text-muted fw-bold">{t('notifications.recipient_modal.email_label')}</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                        <div className="form-text text-muted small">{t('notifications.recipient_modal.helper_text')}</div>
                                    </div>
                                </div>
                                <div className="modal-footer border-top-0">
                                    <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowForm(false)}>{t('notifications.recipient_modal.cancel')}</button>
                                    <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold">{t('notifications.recipient_modal.save')}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
