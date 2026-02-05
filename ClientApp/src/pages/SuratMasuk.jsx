import { useEffect, useState } from 'react'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

export default function SuratMasuk() {
    const { t } = useLanguage()
    const [data, setData] = useState([])
    const [form, setForm] = useState({})
    const [showForm, setShowForm] = useState(false)
    const [previewFile, setPreviewFile] = useState(null)
    const location = useLocation()
    const STORAGE_KEY = 'surat_masuk_data';

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        fetchData()
        if (location.state?.openForm) {
            setShowForm(true)
        }
    }, [location])

    const fetchData = async () => {
        try {
            const res = await axios.get('/api/suratmasuk')
            setData(res.data)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data))
        } catch (e) {
            const saved = localStorage.getItem(STORAGE_KEY)
            if (saved) {
                setData(JSON.parse(saved))
            } else {
                const initialData = [
                    { id: 1, nomorSurat: 'SM/001/2023', pengirim: 'Dinas Pendidikan', perihal: 'Undangan Workshop', tanggalMasuk: '2023-10-01', filePath: 'undangan_workshop.pdf' },
                    { id: 2, nomorSurat: 'SM/002/2023', pengirim: 'Telkom Indonesia', perihal: 'Pemberitahuan Maintenance', tanggalMasuk: '2023-10-05', filePath: 'maintenance_telkom.jpg' }
                ]
                setData(initialData)
                localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData))
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = {
            ...form,
            id: form.id || 0,
            tanggalMasuk: form.tanggalSurat || new Date().toISOString()
        };
        delete formData.tanggalSurat;

        try {
            if (form.id) {
                await axios.put(`/api/suratmasuk/${form.id}`, formData)
            } else {
                await axios.post('/api/suratmasuk', formData)
            }
            fetchData()
        } catch (e) {
            let updatedData;
            const offlineData = {
                ...formData,
                id: form.id || Date.now()
            };

            if (form.id) {
                updatedData = data.map(item => item.id === form.id ? offlineData : item)
            } else {
                updatedData = [...data, offlineData]
            }
            setData(updatedData)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData))
            alert(t('letters.alert.save_success_offline'))
        }
        setShowForm(false)
        setForm({})
    }

    const handleDelete = async (id) => {
        if (!confirm(t('letters.alert.delete_confirm'))) return;
        try {
            await axios.delete(`/api/suratmasuk/${id}`)
            fetchData()
        } catch (e) {
            const updatedData = data.filter(item => item.id !== id)
            setData(updatedData)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData))
        }
    }

    const handlePreview = (item) => {
        if (item.fileObj) {
            const objectUrl = URL.createObjectURL(item.fileObj);
            setPreviewFile({ url: objectUrl, type: item.fileObj.type, name: item.filePath });
        } else if (item.filePath) {
            const ext = item.filePath.split('.').pop().toLowerCase();
            const fileUrl = `/uploads/${item.filePath}`;

            if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
                setPreviewFile({ url: fileUrl, type: 'image/jpeg', name: item.filePath });
            } else if (ext === 'pdf') {
                setPreviewFile({ url: fileUrl, type: 'application/pdf', name: item.filePath });
            } else {
                setPreviewFile({ url: fileUrl, type: 'application/octet-stream', name: item.filePath });
            }
        }
    }

    return (
        <div className="card glass border-0 p-3 rounded-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold m-0" style={{ color: 'var(--primary)' }}>{t('letters.incoming.title')}</h5>
                <button onClick={() => { setForm({}); setShowForm(!showForm) }} className="btn btn-primary btn-sm rounded-pill px-3">
                    {showForm ? t('letters.incoming.cancel') : t('letters.incoming.add')}
                </button>
            </div>

            {showForm && (
                <div className="card border-0 shadow-sm mb-3 p-3 rounded-3" style={{ background: 'rgba(var(--primary-rgb), 0.05)', border: '1px solid var(--glass-border)' }}>
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">{t('letters.form.number')}</label>
                                <input className="form-control rounded-3" value={form.nomorSurat || ''} onChange={e => setForm({ ...form, nomorSurat: e.target.value })} required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">{t('letters.form.sender')}</label>
                                <input className="form-control rounded-3" value={form.pengirim || ''} onChange={e => setForm({ ...form, pengirim: e.target.value })} required />
                            </div>
                            <div className="col-12">
                                <label className="form-label">{t('letters.form.subject')}</label>
                                <input className="form-control rounded-3" value={form.perihal || ''} onChange={e => setForm({ ...form, perihal: e.target.value })} required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">{t('letters.form.date')}</label>
                                <input type="date" className="form-control rounded-3" value={form.tanggalSurat ? form.tanggalSurat.split('T')[0] : ''} onChange={e => setForm({ ...form, tanggalSurat: e.target.value })} required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">{t('letters.form.upload')}</label>
                                <input
                                    type="file"
                                    className="form-control rounded-3"
                                    accept=".doc,.docx,.odt,.pdf,.jpg,.jpeg"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setForm({ ...form, filePath: file.name, fileObj: file });
                                        }
                                    }}
                                />
                                <small className="text-muted">{t('letters.form.format_hint')}</small>
                            </div>
                            <div className="col-12 mt-4">
                                <button type="submit" className="btn btn-primary rounded-pill px-5">{t('letters.form.save')}</button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead>
                        <tr>
                            <th>{t('letters.incoming.table.no_surat')}</th>
                            <th>{t('letters.incoming.table.sender')}</th>
                            <th>{t('letters.incoming.table.subject')}</th>
                            <th>{t('letters.incoming.table.date')}</th>
                            <th>{t('letters.incoming.table.file')}</th>
                            <th>{t('letters.incoming.table.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map(item => (
                                <tr key={item.id}>
                                    <td className="fw-bold">{item.nomorSurat}</td>
                                    <td>{item.pengirim}</td>
                                    <td>{item.perihal}</td>
                                    <td>{item.tanggalMasuk ? new Date(item.tanggalMasuk).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</td>
                                    <td>
                                        {item.filePath ? (
                                            <div className="d-flex align-items-center gap-1">
                                                <button onClick={() => handlePreview(item)} className="btn btn-sm btn-light border d-flex align-items-center gap-2" title={t('letters.preview.view')}>
                                                    <i className="bi bi-eye text-primary"></i>
                                                    <span className="d-none d-md-inline text-truncate" style={{ maxWidth: '120px' }}>
                                                        {item.filePath.indexOf('_') === 36 ? item.filePath.substring(37) : item.filePath}
                                                    </span>
                                                </button>
                                                <a href={`/uploads/${item.filePath}`} download target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-success border-0" title={t('letters.preview.download_file')}>
                                                    <i className="bi bi-download"></i>
                                                </a>
                                            </div>
                                        ) : (
                                            <span className="text-muted small">-</span>
                                        )}
                                    </td>
                                    <td>
                                        <button onClick={() => { setForm({ ...item, tanggalSurat: item.tanggalMasuk }); setShowForm(true) }} className="btn btn-sm btn-outline-primary me-2 rounded-pill"><i className="bi bi-pencil"></i></button>
                                        {JSON.parse(localStorage.getItem('user') || '{}').role === 'Admin' && (
                                            <button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-outline-danger rounded-pill"><i className="bi bi-trash"></i></button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-5 text-muted">
                                    {t('letters.incoming.table.empty')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {data.length > itemsPerPage && (
                <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                    <div className="text-muted small">
                        {t('pagination.showing')} {indexOfFirstItem + 1} {t('pagination.to')} {Math.min(indexOfLastItem, data.length)} {t('pagination.from')} {data.length} {t('pagination.data')}
                    </div>
                    <nav>
                        <ul className="pagination pagination-sm m-0">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link rounded-start-pill px-3" onClick={() => paginate(currentPage - 1)}>
                                    <i className="bi bi-chevron-left"></i>
                                </button>
                            </li>
                            {[...Array(totalPages)].map((_, i) => (
                                <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => paginate(i + 1)}>
                                        {i + 1}
                                    </button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button className="page-link rounded-end-pill px-3" onClick={() => paginate(currentPage + 1)}>
                                    <i className="bi bi-chevron-right"></i>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}

            {previewFile && (
                <div
                    className="modal d-block fade show"
                    style={{ backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 1060 }}
                    tabIndex="-1"
                    onClick={() => setPreviewFile(null)}
                >
                    <div className="modal-dialog modal-xl modal-dialog-centered" onClick={e => e.stopPropagation()}>
                        <div className="modal-content overflow-hidden border-0 shadow-lg rounded-4" style={{ height: '90vh' }}>
                            <div className="modal-header bg-white border-bottom py-2 px-4 d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center overflow-hidden" style={{ maxWidth: '70%' }}>
                                    <h5 className="modal-title fw-bold text-dark text-truncate mb-0" title={previewFile.name}>
                                        <i className="bi bi-file-earmark-text me-2 text-primary"></i>
                                        {previewFile.name.indexOf('_') === 36 ? previewFile.name.substring(37) : previewFile.name}
                                    </h5>
                                </div>
                                <div className="d-flex gap-2">
                                    <a href={previewFile.url} download={previewFile.name} target="_blank" rel="noreferrer" className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2">
                                        <i className="bi bi-download"></i> <span className="d-none d-sm-inline">{t('letters.preview.download')}</span>
                                    </a>
                                    <button type="button" className="btn-close" onClick={() => setPreviewFile(null)}></button>
                                </div>
                            </div>
                            <div className="modal-body p-0 bg-dark d-flex align-items-center justify-content-center" style={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
                                <PreviewKeyListener onClose={() => setPreviewFile(null)} />
                                {(() => {
                                    const name = previewFile.name || '';
                                    const type = previewFile.type || '';
                                    const isImg = type.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(name);
                                    const isPdf = type === 'application/pdf' || /\.pdf$/i.test(name);

                                    if (isImg) {
                                        return (
                                            <div className="w-100 h-100 d-flex align-items-center justify-content-center p-4">
                                                <img src={previewFile.url} className="img-fluid shadow-lg rounded" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} alt="Preview" />
                                            </div>
                                        );
                                    } else if (isPdf) {
                                        return <iframe src={previewFile.url} className="w-100 h-100 border-0" title="PDF Preview"></iframe>;
                                    } else {
                                        const ext = name.split('.').pop().toUpperCase();
                                        return (
                                            <div className="text-white p-5 d-flex flex-column align-items-center justify-content-center w-100 h-100">
                                                <div className="bg-white bg-opacity-10 p-5 rounded-circle mb-4">
                                                    <i className="bi bi-file-earmark-lock display-1 text-white"></i>
                                                </div>
                                                <h3 className="mb-2">{t('letters.preview.unavailable_title')}</h3>
                                                <p className="text-white-50 mb-4 text-center" style={{ maxWidth: '400px' }}>
                                                    {t('letters.preview.unavailable_desc')} <strong>{ext}</strong>
                                                </p>
                                                <a href={previewFile.url} download={name} className="btn btn-light btn-lg rounded-pill px-5 shadow-sm fw-bold text-primary">
                                                    <i className="bi bi-download me-2"></i> {t('letters.preview.download_now')}
                                                </a>
                                            </div>
                                        );
                                    }
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function PreviewKeyListener({ onClose }) {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);
    return null;
}
