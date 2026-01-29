import { useState, useEffect } from 'react';
import axios from 'axios';

export default function WordAddIn() {
    const [status, setStatus] = useState("Siap.");
    const [isOfficeInitialized, setIsOfficeInitialized] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        // Office.onReady checks if we are running inside Word
        if (window.Office) {
            window.Office.onReady((info) => {
                if (info.host === window.Office.HostType.Word) {
                    setIsOfficeInitialized(true);
                    setStatus("Terhubung dengan MS Word.");
                } else {
                    setStatus("Silakan buka halaman ini di dalam MS Word.");
                }
            });
        }
    }, []);

    const handleUpload = async () => {
        if (!isOfficeInitialized) {
            alert("Harus dijalankan di dalam MS Word!");
            return;
        }

        setStatus("Membaca dokumen...");
        setUploading(true);

        // Get the entire file in slices (chunks)
        window.Office.context.document.getFileAsync(window.Office.FileType.Pdf, { sliceSize: 65536 }, (result) => {
            if (result.status === window.Office.AsyncResultStatus.Succeeded) {
                const myFile = result.value;
                const sliceCount = myFile.sliceCount;
                const slicesReceived = 0;
                const docFileData = [];

                getSlice(myFile, 0, sliceCount, docFileData);
            } else {
                setStatus("Gagal membaca file: " + result.error.message);
                setUploading(false);
            }
        });
    };

    const getSlice = (myFile, nextSlice, sliceCount, docFileData) => {
        myFile.getSliceAsync(nextSlice, (result) => {
            if (result.status === window.Office.AsyncResultStatus.Succeeded) {
                // Append slice
                docFileData.push(result.value.data);

                if (nextSlice < sliceCount - 1) {
                    getSlice(myFile, nextSlice + 1, sliceCount, docFileData);
                } else {
                    // All slices received, close file and upload
                    myFile.closeAsync();
                    uploadFile(docFileData);
                }
            } else {
                setStatus("Gagal mengambil slice.");
                setUploading(false);
            }
        });
    };

    const uploadFile = async (docFileData) => {
        setStatus("Mengupload ke server...");

        // Construct Uint8Array from slices
        const byteArrays = docFileData.map(slice => new Uint8Array(slice));
        const blob = new Blob(byteArrays, { type: 'application/pdf' });

        // Prepare FormData
        const formData = new FormData();
        formData.append("NomorSurat", "WORD-AUTO-" + Date.now().toString().substr(-6));
        formData.append("Pengirim", "MS Word User");
        formData.append("Perihal", "Dokumen dari MS Word Add-in");
        formData.append("TanggalSurat", new Date().toISOString());
        formData.append("File", blob, "word_export_" + Date.now() + ".pdf");

        try {
            // Include full URL if needed or relative
            const res = await axios.post('/api/suratmasuk/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setStatus("✅ SUKSES! Surat terkirim.");
            console.log(res.data);
        } catch (error) {
            console.error(error);
            setStatus("❌ Gagal upload: " + (error.response?.data || error.message));
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light p-3">
            <div className="card border-0 shadow-sm rounded-4 w-100 text-center p-4">
                <i className="bi bi-file-word text-primary display-1 mb-3"></i>
                <h4 className="fw-bold mb-3">Upload ke E-Surat</h4>

                <p className="text-muted small mb-4">{status}</p>

                <button
                    onClick={handleUpload}
                    disabled={uploading || !isOfficeInitialized}
                    className="btn btn-primary rounded-pill w-100 py-2 fw-bold"
                >
                    {uploading ? (
                        <span><span className="spinner-border spinner-border-sm me-2"></span> Mengirim...</span>
                    ) : (
                        <span><i className="bi bi-cloud-upload me-2"></i> Upload PDF</span>
                    )}
                </button>
            </div>
            <small className="text-muted mt-4 text-center" style={{ fontSize: '0.7rem' }}>
                Pastikan API Server berjalan. <br />
                Dokumen akan dikonversi otomatis ke PDF.
            </small>
        </div>
    );
}
