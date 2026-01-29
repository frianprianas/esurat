import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import axios from 'axios'

export default function Layout({ user, setUser }) {
    const location = useLocation()
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState({ masuk: [], keluar: [] })
    const [showResults, setShowResults] = useState(false)
    const searchRef = useRef(null)

    const handleLogout = async () => {
        localStorage.removeItem('user')
        setUser(null)
        try { await axios.post('/api/auth/logout') } catch (e) { }
    }

    const isActive = (path) => location.pathname === path ? 'active' : ''

    // Smart Search Logic
    useEffect(() => {
        if (!searchQuery) {
            setSearchResults({ masuk: [], keluar: [] })
            return
        }

        const delayDebounce = setTimeout(async () => {
            try {
                const [masuk, keluar] = await Promise.all([
                    axios.get('/api/suratmasuk'),
                    axios.get('/api/suratkeluar')
                ])

                const lowerQ = searchQuery.toLowerCase()

                const filterFn = (item, type) => {
                    // Check generic fields
                    const textData = [
                        item.nomorSurat,
                        item.perihal,
                        type === 'in' ? item.pengirim : item.penerima
                    ].join(' ').toLowerCase()
                    return textData.includes(lowerQ)
                }

                setSearchResults({
                    masuk: masuk.data.filter(i => filterFn(i, 'in')).slice(0, 5),
                    keluar: keluar.data.filter(i => filterFn(i, 'out')).slice(0, 5)
                })
                setShowResults(true)

            } catch (e) {
                console.error("Search failed", e)
            }
        }, 300)

        return () => clearTimeout(delayDebounce)
    }, [searchQuery])

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [searchRef]);

    return (
        <div className="page">
            <div className="sidebar">
                <div className="sidebar-header">
                    <h4>
                        <img src="/images/logo.png" alt="Logo" className="sidebar-logo-img me-2" />
                        <span>E-Surat</span>
                    </h4>
                </div>
                <div className="py-3">
                    <Link to="/" className={`nav-link ${isActive('/')}`}>
                        <i className="bi bi-grid-fill"></i> Dashboard
                    </Link>
                    {user?.canManageSuratMasuk && (
                        <Link to="/surat-masuk" className={`nav-link ${isActive('/surat-masuk')}`}>
                            <i className="bi bi-inbox-fill"></i> Surat Masuk
                        </Link>
                    )}
                    {user?.canManageSuratKeluar && (
                        <Link to="/surat-keluar" className={`nav-link ${isActive('/surat-keluar')}`}>
                            <i className="bi bi-send-fill"></i> Surat Keluar
                        </Link>
                    )}
                    {(user?.canManagePerihal || user?.role === 'Admin') && (
                        <>
                            <div className="mt-3 text-muted text-uppercase small fw-bold px-3" style={{ fontSize: '0.75rem' }}>Master Data</div>
                            <Link to="/kategori-perihal" className={`nav-link ${isActive('/kategori-perihal')}`}>
                                <i className="bi bi-tags-fill"></i> Kelola Perihal
                            </Link>
                        </>
                    )}

                    <div className="mt-3 text-muted text-uppercase small fw-bold px-3" style={{ fontSize: '0.75rem' }}>Visualisasi</div>
                    <Link to="/visual-surat/masuk" className={`nav-link ${isActive('/visual-surat/masuk')}`}>
                        <i className="bi bi-book-half"></i> Visual Surat Masuk
                    </Link>
                    <Link to="/visual-surat/keluar" className={`nav-link ${isActive('/visual-surat/keluar')}`}>
                        <i className="bi bi-book"></i> Visual Surat Keluar
                    </Link>

                    {user?.role === 'Admin' && (
                        <>
                            <div className="mt-3 text-muted text-uppercase small fw-bold px-3" style={{ fontSize: '0.75rem' }}>Sistem</div>
                            <Link to="/pengguna" className={`nav-link ${isActive('/pengguna')}`}>
                                <i className="bi bi-people-fill"></i> Manajemen Pengguna
                            </Link>
                        </>
                    )}
                </div>

                <div className="mt-auto user-profile-section">
                    <div className="d-flex align-items-center mb-3">
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                            <i className="bi bi-person-fill"></i>
                        </div>
                        <div>
                            <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Logged in as</small>
                            <div className="fw-bold text-dark">{user?.username}</div>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="btn btn-outline-danger w-100 btn-sm">
                        <i className="bi bi-box-arrow-right me-1"></i> Logout
                    </button>
                </div>
            </div>

            <div className="main-content">
                <div className="top-bar d-flex justify-content-between align-items-center gap-3">
                    <div>
                        <h4 className="fw-bold m-0 text-dark d-none d-md-block">SMK Bakti Nusantara 666</h4>
                        <span className="text-muted small d-none d-md-block">
                            Administrasi Persuratan Digital
                        </span>
                    </div>

                    {/* Search Bar */}
                    <div className="position-relative flex-grow-1 mx-md-4" style={{ maxWidth: '500px' }} ref={searchRef}>
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0 rounded-start-pill ps-3">
                                <i className="bi bi-search text-muted"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control border-start-0 rounded-end-pill shadow-none bg-white"
                                placeholder="Cari surat..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery && setShowResults(true)}
                            />
                        </div>

                        {/* Search Results Dropdown */}
                        {showResults && searchQuery && (
                            <div className="search-dropdown shadow-lg rounded-4 border-0">
                                {searchResults.masuk.length === 0 && searchResults.keluar.length === 0 ? (
                                    <div className="p-3 text-center text-muted">Tidak ditemukan data.</div>
                                ) : (
                                    <>
                                        {searchResults.masuk.length > 0 && user?.canManageSuratMasuk && (
                                            <div className="search-section">
                                                <div className="section-title">Surat Masuk</div>
                                                {searchResults.masuk.map(item => (
                                                    <Link to="/surat-masuk" key={item.id} className="search-item" onClick={() => setShowResults(false)}>
                                                        <div className="fw-bold text-primary">{item.nomorSurat}</div>
                                                        <div className="small text-truncate">{item.pengirim} - {item.perihal}</div>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                        {searchResults.keluar.length > 0 && user?.canManageSuratKeluar && (
                                            <div className="search-section">
                                                <div className="section-title">Surat Keluar</div>
                                                {searchResults.keluar.map(item => (
                                                    <Link to="/surat-keluar" key={item.id} className="search-item" onClick={() => setShowResults(false)}>
                                                        <div className="fw-bold text-success">{item.nomorSurat}</div>
                                                        <div className="small text-truncate">Kpd: {item.penerima} - {item.perihal}</div>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="text-muted small text-end d-none d-lg-block" style={{ minWidth: '150px' }}>
                        {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                </div>
                <Outlet />
            </div>
        </div>
    )
}
