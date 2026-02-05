import { useState, useEffect } from 'react'
import axios from 'axios'
import { useLanguage } from '../contexts/LanguageContext'

export default function KategoriPerihal() {
    const { t } = useLanguage()
    const [items, setItems] = useState([])
    const [newName, setNewName] = useState('')
    const [editId, setEditId] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchItems()
    }, [])

    const fetchItems = async () => {
        try {
            const res = await axios.get('/api/kategoriperihal')
            setItems(res.data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!newName.trim()) return

        try {
            if (editId) {
                // Update mode
                await axios.put(`/api/kategoriperihal/${editId}`, { id: editId, nama: newName })
                setItems(items.map(i => i.id === editId ? { ...i, nama: newName } : i))
            } else {
                // Create mode
                const res = await axios.post('/api/kategoriperihal', { nama: newName })
                setItems([...items, res.data])
            }
            setNewName('')
            setEditId(null)
        } catch (e) {
            console.error(e)
            const msg = e.response ? `Status: ${e.response.status}\nData: ${JSON.stringify(e.response.data)}` : e.message
            alert(`${t('categories.alert_save_fail')}:\n${msg}`)
        }
    }

    const handleEdit = (item) => {
        setNewName(item.nama)
        setEditId(item.id)
    }

    const handleCancel = () => {
        setNewName('')
        setEditId(null)
    }

    const handleDelete = async (id) => {
        if (!confirm(t('categories.alert_delete'))) return

        try {
            await axios.delete(`/api/kategoriperihal/${id}`)
            setItems(items.filter(i => i.id !== id))
        } catch (e) {
            alert(t('categories.alert_delete_fail'))
        }
    }

    return (
        <div className="container-fluid p-0">
            <h5 className="mb-3 fw-bold" style={{ color: 'var(--text-main)' }}>{t('categories.title')}</h5>

            <div className="row g-3">
                <div className="col-md-5">
                    <div className="card glass border-0 shadow-sm p-3 mb-3">
                        <h6 className="fw-bold mb-3" style={{ color: 'var(--text-main)' }}>{editId ? t('categories.edit_title') : t('categories.add_title')}</h6>
                        <form onSubmit={handleSubmit} className="mt-3">
                            <div className="mb-3">
                                <label className="form-label">{t('categories.name_label')}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                    placeholder={t('categories.placeholder')}
                                    required
                                />
                            </div>
                            <div className="d-flex gap-2">
                                <button type="submit" className={`btn w-100 ${editId ? 'btn-success' : 'btn-primary'}`}>
                                    <i className={`bi ${editId ? 'bi-save' : 'bi-plus-lg'} me-2`}></i>
                                    {editId ? t('categories.save_changes') : t('common.add')}
                                </button>
                                {editId && (
                                    <button type="button" onClick={handleCancel} className="btn btn-secondary">
                                        {t('common.cancel')}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                <div className="col-md-7">
                    <div className="card glass border-0 shadow-sm p-0">
                        <div className="card-header py-3" style={{ background: 'rgba(0,0,0,0.05)', borderBottom: '1px solid var(--border-color)' }}>
                            <h5 className="mb-0" style={{ color: 'var(--text-main)' }}>{t('categories.list_title')}</h5>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th style={{ width: '60px' }} className="text-center">#</th>
                                        <th>{t('categories.table_name')}</th>
                                        <th style={{ width: '120px' }} className="text-center">{t('common.action')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="3" className="text-center py-4">{t('common.loading')}</td></tr>
                                    ) : items.length === 0 ? (
                                        <tr><td colSpan="3" className="text-center py-4 text-muted">{t('categories.empty_list')}</td></tr>
                                    ) : (
                                        items.map((item, idx) => (
                                            <tr key={item.id}>
                                                <td className="text-center">{idx + 1}</td>
                                                <td>{item.nama}</td>
                                                <td className="text-center">
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="btn btn-sm btn-outline-success me-2"
                                                        title={t('common.edit')}
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
                                                    {JSON.parse(localStorage.getItem('user') || '{}').role === 'Admin' && (
                                                        <button
                                                            onClick={() => handleDelete(item.id)}
                                                            className="btn btn-sm btn-outline-danger"
                                                            title={t('common.delete')}
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
