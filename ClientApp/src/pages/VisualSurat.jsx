import React, { useState, useEffect, useCallback, useRef } from 'react'
import HTMLFlipBook from 'react-pageflip'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const Page = React.forwardRef((props, ref) => {
    return (
        <div className="page-content" ref={ref}>
            <div className="page-inner shadow-sm">
                {props.children}
                <div className="page-footer text-muted small">
                    Halaman {props.number}
                </div>
            </div>
        </div>
    );
});

export default function VisualSurat() {
    const { type } = useParams() // 'masuk' or 'keluar'
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [previewFile, setPreviewFile] = useState(null)
    const bookRef = useRef()

    useEffect(() => {
        fetchData()
    }, [type])

    const fetchData = async () => {
        setLoading(true)
        try {
            const endpoint = type === 'masuk' ? '/api/suratmasuk' : '/api/suratkeluar'
            const res = await axios.get(endpoint)
            setData(res.data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const handleDetail = (item) => {
        const ext = item.filePath?.split('.').pop().toLowerCase();
        const url = `/uploads/${item.filePath}`;
        let type = 'application/octet-stream';
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) type = 'image/jpeg';
        else if (ext === 'pdf') type = 'application/pdf';

        setPreviewFile({ url, type, name: item.filePath });
    }

    if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary"></div></div>

    return (
        <div className="visual-surat-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold m-0 text-primary">
                    Visual Arsip: Surat {type === 'masuk' ? 'Masuk' : 'Keluar'}
                </h3>
                <div className="text-muted small">
                    Klik ujung halaman untuk membalik
                </div>
            </div>

            <div className="book-wrapper d-flex justify-content-center align-items-center p-4">
                {data.length === 0 ? (
                    <div className="alert alert-info">Belum ada data untuk ditampilkan.</div>
                ) : (
                    <HTMLFlipBook
                        width={500}
                        height={700}
                        size="stretch"
                        minWidth={315}
                        maxWidth={1000}
                        minHeight={420}
                        maxHeight={1350}
                        maxShadowOpacity={0.5}
                        showCover={true}
                        mobileScrollSupport={true}
                        ref={bookRef}
                        className="surat-book"
                    >
                        {/* COVER */}
                        <Page number={0}>
                            <div className="book-cover text-center d-flex flex-column justify-content-center align-items-center h-100 p-4">
                                <img src="/images/logo.png" alt="Logo" style={{ width: '100px' }} className="mb-4" />
                                <h1 className="fw-bold mb-2">ARSIP DIGITAL</h1>
                                <h3 className="text-uppercase tracking-widest text-primary mb-4">
                                    Surat {type === 'masuk' ? 'Masuk' : 'Keluar'}
                                </h3>
                                <div className="divider mb-4" style={{ width: '80px', height: '6px' }}></div>
                                <p className="fs-5">SMK Bakti Nusantara 666</p>
                                <div className="mt-auto">
                                    <p className="mb-0">Arsip Digital</p>
                                    <p className="fw-bold">Tahun {new Date().getFullYear()}</p>
                                </div>
                            </div>
                        </Page>

                        {/* CONTENT PAGES */}
                        {data.map((item, index) => (
                            <Page key={item.id} number={index + 1}>
                                <div className="surat-page-content p-4 h-100 d-flex flex-column">
                                    <div className="surat-header border-bottom pb-2 mb-3">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div className="badge bg-primary mb-2">#{item.nomorSurat}</div>
                                            <div className="text-muted small">{new Date(item.tanggalMasuk || item.tanggalKeluar || item.tanggalSurat).toLocaleDateString('id-ID')}</div>
                                        </div>
                                        <h5 className="fw-bold mb-0 text-truncate" style={{ color: 'var(--text-main)' }} title={item.perihal}>{item.perihal}</h5>
                                    </div>

                                    <div className="surat-details mb-3 small">
                                        <div>
                                            <span className="text-muted">{type === 'masuk' ? 'Pengirim: ' : 'Penerima: '}</span>
                                            <span className="fw-bold">{item.pengirim || item.penerima}</span>
                                        </div>
                                    </div>

                                    <div className="surat-preview-container rounded bg-white overflow-hidden shadow-sm mb-3 position-relative flex-grow-1" style={{ border: '1px solid #e2e8f0', minHeight: '350px' }}>
                                        {item.filePath ? (
                                            (() => {
                                                const ext = item.filePath.split('.').pop().toLowerCase();
                                                const fileUrl = `/uploads/${item.filePath}`;
                                                const isImg = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
                                                const isPdf = ext === 'pdf';

                                                if (isImg) {
                                                    return <img src={fileUrl} className="w-100 h-100" style={{ objectFit: 'contain', backgroundColor: '#f8fafc' }} alt="Preview" />;
                                                } else if (isPdf) {
                                                    return (
                                                        <div className="w-100 h-100 overflow-hidden">
                                                            <iframe
                                                                src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                                                                className="w-100 h-100"
                                                                style={{ border: 'none', pointerEvents: 'none' }}
                                                                title="PDF Preview"
                                                            ></iframe>
                                                            <div className="position-absolute top-0 start-0 w-100 h-100" style={{ cursor: 'pointer', zIndex: 1 }}></div>
                                                        </div>
                                                    );
                                                } else {
                                                    return (
                                                        <div className="d-flex flex-column align-items-center justify-content-center h-100 p-4 text-center">
                                                            <i className="bi bi-file-earmark-text display-4 text-primary opacity-25"></i>
                                                            <p className="mt-2 small text-muted text-truncate w-100 px-3">{item.filePath}</p>
                                                        </div>
                                                    );
                                                }
                                            })()
                                        ) : (
                                            <div className="d-flex align-items-center justify-content-center h-100 text-muted small">
                                                <i className="bi bi-file-earmark-x me-2"></i> Belum ada dokumen
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-auto text-center pb-2">
                                        <button
                                            className="btn btn-primary rounded-pill px-4 shadow-sm"
                                            onClick={() => handleDetail(item)}
                                        >
                                            <i className="bi bi-fullscreen me-2"></i> Lihat Detail
                                        </button>
                                    </div>
                                </div>
                            </Page>
                        ))}

                        {/* BACK COVER */}
                        <Page number={data.length + 1}>
                            <div className="book-cover text-center d-flex flex-column justify-content-center align-items-center h-100 p-4">
                                <div className="mb-4">
                                    <div className="bg-white bg-opacity-10 p-4 rounded-circle">
                                        <i className="bi bi-journal-check text-white display-1"></i>
                                    </div>
                                </div>
                                <h3 className="fw-bold mb-2 text-white">Akhir Dokumen</h3>
                                <p className="text-white-50">Seluruh arsip telah ditampilkan.</p>
                                <button className="btn btn-outline-light rounded-pill mt-4 px-4" onClick={() => bookRef.current.pageFlip().flip(0)}>
                                    <i className="bi bi-arrow-left-circle me-2"></i> Kembali ke Awal
                                </button>
                            </div>
                        </Page>
                    </HTMLFlipBook>
                )}
            </div>

            {/* Full Preview Modal */}
            {previewFile && (
                <div className="modal d-block fade show" style={{ backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 2000 }} tabIndex="-1" onClick={() => setPreviewFile(null)}>
                    <div className="modal-dialog modal-xl modal-dialog-centered" onClick={e => e.stopPropagation()}>
                        <div className="modal-content overflow-hidden border-0 shadow-lg rounded-4" style={{ height: '90vh', background: 'var(--glass-bg)' }}>
                            <div className="modal-header border-bottom py-2 px-4 d-flex justify-content-between align-items-center" style={{ borderColor: 'var(--border-color)', background: 'var(--glass-bg)' }}>
                                <h5 className="modal-title fw-bold text-truncate mb-0" style={{ maxWidth: '80%', color: 'var(--text-main)' }} title={previewFile.name}>
                                    <i className="bi bi-file-earmark-text me-2 text-primary"></i>
                                    {previewFile.name?.indexOf('_') === 36 ? previewFile.name.substring(37) : previewFile.name}
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
                                        return <img src={previewFile.url} className="img-fluid" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} alt="Preview" />;
                                    } else if (isPdf) {
                                        return <iframe src={previewFile.url} className="w-100 h-100 border-0" title="PDF Preview"></iframe>;
                                    } else {
                                        return (
                                            <div className="text-white p-5 d-flex flex-column align-items-center justify-content-center w-100 h-100">
                                                <i className="bi bi-file-earmark-break display-1 text-white-50 mb-4"></i>
                                                <h3 className="mb-2">Preview Tidak Tersedia</h3>
                                                <a href={previewFile.url} download={name} className="btn btn-primary btn-lg rounded-pill px-5 shadow-sm">
                                                    Download File
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
