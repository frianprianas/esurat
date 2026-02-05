import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import axios from 'axios'
import { useLanguage } from '../contexts/LanguageContext'

export default function Layout({ user, setUser, theme, setTheme }) {
    const location = useLocation()
    const { t, language, setLanguage } = useLanguage()
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState({ masuk: [], keluar: [] })
    const [showResults, setShowResults] = useState(false)
    const searchRef = useRef(null)

    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')
    const toggleLanguage = () => setLanguage(language === 'id' ? 'en' : 'id')

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
                        <span>{t('app_name')}</span>
                    </h4>
                </div>
                <div className="py-3 flex-grow-1 overflow-auto" style={{ scrollbarWidth: 'thin' }}>
                    <Link to="/" className={`nav-link ${isActive('/')}`}>
                        <i className="bi bi-grid-fill"></i> {t('menu.dashboard')}
                    </Link>
                    {user?.canManageSuratMasuk && (
                        <Link to="/surat-masuk" className={`nav-link ${isActive('/surat-masuk')}`}>
                            <i className="bi bi-inbox-fill"></i> {t('menu.surat_masuk')}
                        </Link>
                    )}
                    {user?.canManageSuratKeluar && (
                        <Link to="/surat-keluar" className={`nav-link ${isActive('/surat-keluar')}`}>
                            <i className="bi bi-send-fill"></i> {t('menu.surat_keluar')}
                        </Link>
                    )}
                    {(user?.canManagePerihal || user?.role === 'Admin') && (
                        <>
                            <div className="mt-4 text-uppercase small fw-bold px-3 sidebar-label">{t('menu.master_data')}</div>
                            <Link to="/kategori-perihal" className={`nav-link ${isActive('/kategori-perihal')}`}>
                                <i className="bi bi-tags-fill"></i> {t('menu.kelola_perihal')}
                            </Link>
                        </>
                    )}

                    <div className="mt-4 text-uppercase small fw-bold px-3 sidebar-label">{t('menu.visualisasi')}</div>
                    <Link to="/visual-surat/masuk" className={`nav-link ${isActive('/visual-surat/masuk')}`}>
                        <i className="bi bi-book-half"></i> {t('menu.visual_masuk')}
                    </Link>
                    <Link to="/visual-surat/keluar" className={`nav-link ${isActive('/visual-surat/keluar')}`}>
                        <i className="bi bi-book"></i> {t('menu.visual_keluar')}
                    </Link>

                    {user?.role === 'Admin' && (
                        <>
                            <div className="mt-4 text-uppercase small fw-bold px-3 sidebar-label">{t('menu.sistem')}</div>
                            <Link to="/pengguna" className={`nav-link ${isActive('/pengguna')}`}>
                                <i className="bi bi-people-fill"></i> {t('menu.manajemen_pengguna')}
                            </Link>
                            <Link to="/notifikasi" className={`nav-link ${isActive('/notifikasi')}`}>
                                <i className="bi bi-bell-fill"></i> {t('menu.notifikasi')}
                            </Link>
                        </>
                    )}
                </div>

                <div className="mt-auto user-profile-section">
                    <div className="d-flex align-items-center mb-3">
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                            <i className="bi bi-person-fill"></i>
                        </div>
                        <div className="ps-2 overflow-hidden">
                            <small className="sidebar-label d-block mb-0" style={{ fontSize: '0.7rem' }}>{t('common.logged_in_as')}</small>
                            <div className="fw-bold text-truncate" style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{user?.username}</div>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="btn btn-outline-danger w-100 btn-sm">
                        <i className="bi bi-box-arrow-right me-1"></i> {t('common.logout')}
                    </button>
                </div>
            </div>

            <div className="main-content">
                <div className="top-bar d-flex justify-content-between align-items-center gap-3">
                    <div>
                        <h4 className="fw-bold m-0 d-none d-md-block" style={{ color: 'var(--text-main)' }}>SMK Bakti Nusantara 666</h4>
                        <span className="small d-none d-md-block" style={{ color: 'var(--text-muted)' }}>
                            {t('subtitle')}
                        </span>
                    </div>

                    {/* Search Bar */}
                    <div className="position-relative flex-grow-1 mx-md-4" style={{ maxWidth: '500px' }} ref={searchRef}>
                        <div className="input-group">
                            <span className="input-group-text border-end-0 rounded-start-pill ps-3" style={{ background: 'var(--glass-bg)', borderColor: 'var(--border-color)' }}>
                                <i className="bi bi-search text-muted"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control border-start-0 rounded-end-pill shadow-none"
                                style={{ background: 'var(--glass-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                                placeholder={t('common.search_placeholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery && setShowResults(true)}
                            />
                        </div>

                        {/* Search Results Dropdown */}
                        {showResults && searchQuery && (
                            <div className="search-dropdown shadow-lg rounded-4 border-0">
                                {searchResults.masuk.length === 0 && searchResults.keluar.length === 0 ? (
                                    <div className="p-3 text-center text-muted">{t('layout.no_results')}</div>
                                ) : (
                                    <>
                                        {searchResults.masuk.length > 0 && user?.canManageSuratMasuk && (
                                            <div className="search-section">
                                                <div className="section-title">{t('letters.incoming.title')}</div>
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
                                                <div className="section-title">{t('letters.outgoing.title')}</div>
                                                {searchResults.keluar.map(item => (
                                                    <Link to="/surat-keluar" key={item.id} className="search-item" onClick={() => setShowResults(false)}>
                                                        <div className="fw-bold text-success">{item.nomorSurat}</div>
                                                        <div className="small text-truncate">{t('layout.to_recipient')} {item.penerima} - {item.perihal}</div>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="d-flex align-items-center gap-3">
                        {/* Language Toggle */}
                        <button
                            onClick={toggleLanguage}
                            className="btn btn-glass-toggle d-flex align-items-center justify-content-center p-0"
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '10px',
                                border: '1px solid var(--glass-border)',
                                background: 'var(--glass-bg)',
                                color: 'var(--text-main)',
                                fontSize: '0.9rem',
                                fontWeight: 'bold'
                            }}
                            title={`Current Language: ${language.toUpperCase()}`}
                        >
                            {language.toUpperCase()}
                        </button>

                        <button
                            onClick={toggleTheme}
                            className="btn btn-glass-toggle d-flex align-items-center justify-content-center p-0"
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '10px',
                                border: '1px solid var(--glass-border)',
                                background: 'var(--glass-bg)',
                                color: 'var(--text-main)',
                                fontSize: '1rem'
                            }}
                            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                        >
                            <i className={`bi bi-${theme === 'light' ? 'moon-stars-fill' : 'sun-fill'}`}></i>
                        </button>

                        <div className="small text-end d-none d-lg-block" style={{ minWidth: '150px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            {new Date().toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                    </div>
                </div>
                <Outlet />
            </div>
        </div>
    )
}
