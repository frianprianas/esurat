import { useEffect, useState } from 'react'
import axios from 'axios'
import { useLocation } from 'react-router-dom'

export default function SuratKeluar() {
    const [data, setData] = useState([])
    const [form, setForm] = useState({})
    const [showForm, setShowForm] = useState(false)
    const [previewFile, setPreviewFile] = useState(null)
    const [kategoriList, setKategoriList] = useState([])
    const location = useLocation()
    const STORAGE_KEY = 'surat_keluar_data';

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
        fetchKategori()
        if (location.state?.openForm) {
            setShowForm(true)
        }
    }, [location])

    const fetchKategori = async () => {
        try {
            const res = await axios.get('/api/kategoriperihal')
            setKategoriList(res.data)
        } catch (e) {
            console.error("Gagal load kategori", e)
        }
    }

    const fetchData = async () => {
        try {
            const res = await axios.get('/api/suratkeluar')
            setData(res.data)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data))
        } catch (e) {
            const saved = localStorage.getItem(STORAGE_KEY)
            if (saved) {
                setData(JSON.parse(saved))
            } else {
                const initialData = [
                    { id: 1, nomorSurat: 'SK/001/2023', penerima: 'SMK 1 Bandung', perihal: 'Surat Balasan', tanggalSurat: '2023-10-02', filePath: 'surat_balasan.pdf' }
                ]
                setData(initialData)
                localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData))
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (form.fileObj) {
                const formData = new FormData();
                formData.append('NomorSurat', form.nomorSurat || '-');
                formData.append('Penerima', form.penerima || '-');
                formData.append('Perihal', form.perihal || '-');
                formData.append('TanggalSurat', form.tanggalSurat || new Date().toISOString());
                formData.append('File', form.fileObj);

                await axios.post('/api/suratkeluar/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                const jsonData = {
                    ...form,
                    id: form.id || 0,
                    tanggalSurat: form.tanggalSurat || new Date().toISOString()
                };

                if (form.id) {
                    await axios.put(`/api/suratkeluar/${form.id}`, jsonData)
                } else {
                    await axios.post('/api/suratkeluar', jsonData)
                }
            }

            fetchData()
            setForm({})
            setShowForm(false)
            alert("Data berhasil disimpan!")
        } catch (e) {
            console.error("Save error:", e)
            alert("Gagal menyimpan data: " + (e.response?.data?.message || e.message))
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Hapus data ini?')) return;
        try {
            await axios.delete(`/api/suratkeluar/${id}`)
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
            const url = `/uploads/${item.filePath}`;
            const ext = item.filePath.split('.').pop().toLowerCase();
            let type = 'application/octet-stream';
            if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
                type = 'image/jpeg';
            } else if (ext === 'pdf') {
                type = 'application/pdf';
            }
            setPreviewFile({ url: url, type: type, name: item.filePath });
        }
    }

    return (
        <div className="card glass border-0 p-4 rounded-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold m-0" style={{ color: 'var(--success)' }}>Surat Keluar</h3>
                <button onClick={() => { setForm({}); setShowForm(!showForm) }} className="btn btn-success rounded-pill px-4">
                    {showForm ? 'Cancel' : '+ Tambah Baru'}
                </button>
            </div>

            {showForm && (
                <div className="card border-0 shadow-sm mb-4 p-4 rounded-4" style={{ background: 'rgba(var(--success-rgb), 0.05)', border: '1px solid var(--glass-border)' }}>
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Nomor Surat</label>
                                <input className="form-control rounded-3" value={form.nomorSurat || ''} onChange={e => setForm({ ...form, nomorSurat: e.target.value })} required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Penerima</label>
                                <input className="form-control rounded-3" value={form.penerima || ''} onChange={e => setForm({ ...form, penerima: e.target.value })} required />
                            </div>
                            <div className="col-12">
                                <label className="form-label">Perihal</label>
                                <select className="form-select rounded-3" value={form.perihal || ''} onChange={e => setForm({ ...form, perihal: e.target.value })} required>
                                    <option value="">-- Pilih Perihal --</option>
                                    {kategoriList.map(k => (
                                        <option key={k.id} value={k.nama}>{k.nama}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Tanggal Surat</label>
                                <input type="date" className="form-control rounded-3" value={form.tanggalSurat ? form.tanggalSurat.split('T')[0] : (form.tanggalKeluar ? form.tanggalKeluar.split('T')[0] : '')} onChange={e => setForm({ ...form, tanggalSurat: e.target.value })} required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Upload Dokumen</label>
                                <input type="file" className="form-control rounded-3" accept=".doc,.docx,.odt,.pdf,.jpg,.jpeg" onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setForm({ ...form, filePath: file.name, fileObj: file });
                                    }
                                }} />
                                <small className="text-muted">Format: PDF, DOC, DOCX, ODT, JPEG</small>
                            </div>
                            <div className="col-12 mt-4">
                                <button type="submit" className="btn btn-success rounded-pill px-5">Save Surat</button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead>
                        <tr>
                            <th>No Surat</th>
                            <th>Penerima</th>
                            <th>Perihal</th>
                            <th>Tanggal</th>
                            <th>File</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map(item => (
                                <tr key={item.id}>
                                    <td className="fw-bold">{item.nomorSurat}</td>
                                    <td>{item.penerima}</td>
                                    <td>{item.perihal}</td>
                                    <td>{new Date(item.tanggalKeluar || item.tanggalSurat).toLocaleDateString()}</td>
                                    <td>
                                        {item.filePath ? (
                                            <button onClick={() => handlePreview(item)} className="btn btn-sm btn-light border d-flex align-items-center gap-2">
                                                <i className="bi bi-file-earmark-text text-success"></i>
                                                <span className="d-none d-md-inline text-truncate" style={{ maxWidth: '100px' }}>{item.filePath}</span>
                                            </button>
                                        ) : (
                                            <span className="text-muted small">-</span>
                                        )}
                                    </td>
                                    <td>
                                        <button onClick={() => { setForm(item); setShowForm(true) }} className="btn btn-sm btn-outline-success me-2 rounded-pill"><i className="bi bi-pencil"></i></button>
                                        {JSON.parse(localStorage.getItem('user') || '{}').role === 'Admin' && (
                                            <button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-outline-danger rounded-pill"><i className="bi bi-trash"></i></button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-5 text-muted"> Belum ada data surat keluar. </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {data.length > itemsPerPage && (
                <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                    <div className="text-muted small">
                        Menampilkan {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, data.length)} dari {data.length} data
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
                <div className="modal d-block fade show" style={{ backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 1060 }} tabIndex="-1" onClick={() => setPreviewFile(null)}>
                    <div className="modal-dialog modal-xl modal-dialog-centered" onClick={e => e.stopPropagation()}>
                        <div className="modal-content overflow-hidden border-0 shadow-lg rounded-4" style={{ height: '90vh' }}>
                            <div className="modal-header bg-white border-bottom py-2 px-4 d-flex justify-content-between align-items-center">
                                <h5 className="modal-title fw-bold text-dark text-truncate mb-0" style={{ maxWidth: '80%' }} title={previewFile.name}>
                                    <i className="bi bi-file-earmark-text me-2 text-success"></i>
                                    {previewFile.name.indexOf('_') === 36 ? previewFile.name.substring(37) : previewFile.name}
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setPreviewFile(null)}></button>
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
                                                <img src={previewFile.url} className="img-fluid rounded shadow" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} alt="Preview" />
                                            </div>
                                        );
                                    } else if (isPdf) {
                                        return <iframe src={previewFile.url} className="w-100 h-100 border-0" title="PDF Preview"></iframe>;
                                    } else {
                                        return (
                                            <div className="text-white p-5 d-flex flex-column align-items-center justify-content-center w-100 h-100">
                                                <i className="bi bi-file-earmark-break display-1 text-white-50 mb-4"></i>
                                                <h3 className="mb-2">Preview Tidak Tersedia</h3>
                                                <p className="text-white-50 mb-4 text-center">Format file ini tidak dapat ditampilkan secara langsung.</p>
                                                <a href={previewFile.url} download={name} className="btn btn-success btn-lg rounded-pill px-5 shadow-sm">
                                                    <i className="bi bi-download me-2"></i> Download File
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
