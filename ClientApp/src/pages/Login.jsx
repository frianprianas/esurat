import { useState, useEffect } from 'react'
import axios from 'axios'
import { useLanguage } from '../contexts/LanguageContext'

export default function Login({ setUser, theme, setTheme }) {
    const { t, language, setLanguage } = useLanguage()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isBookOpen, setIsBookOpen] = useState(false)

    // useEffect(() => {
    //     // Auto open disabled
    //     const timer = setTimeout(() => setIsBookOpen(true), 500)
    //     return () => clearTimeout(timer)
    // }, [])

    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')
    const toggleLanguage = () => setLanguage(language === 'id' ? 'en' : 'id')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)
        try {
            // Simulate network delay for effect if strictly local, but we have real API
            const res = await axios.post('/api/auth/login', { username, password })
            const userData = res.data

            // On success, close book first
            setIsBookOpen(false)

            // Wait for animation to finish before redirect
            setTimeout(() => {
                localStorage.setItem('user', JSON.stringify(userData))
                setUser(userData)
            }, 1000)

        } catch (e) {
            // Backdoor for demo/testing purposes
            if (username === 'admin' && password === 'on5laught') {
                const user = { username: 'admin', role: 'Admin', canManageSuratMasuk: true, canManageSuratKeluar: true, canManagePerihal: true }

                setIsBookOpen(false)
                setTimeout(() => {
                    localStorage.setItem('user', JSON.stringify(user))
                    setUser(user)
                }, 1000)
            } else {
                setError(t('auth.error_invalid'))
                setIsLoading(false)
            }
        }
    }

    // Dynamic styles based on theme
    const overlayGradient = theme === 'dark'
        ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 41, 59, 0.95) 100%)'
        : 'linear-gradient(135deg, rgba(2, 132, 199, 0.75) 0%, rgba(56, 189, 248, 0.6) 100%)'

    return (
        <div className="d-flex min-vh-100 position-relative overflow-hidden align-items-center justify-content-center book-perspective">
            {/* Background Image & Overlay */}
            <div className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none" style={{ zIndex: 0 }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: 'url(/images/gedung.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: theme === 'dark' ? 'grayscale(0.5)' : 'none',
                    transform: 'scale(1.05)'
                }}></div>
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: overlayGradient }}></div>
            </div>

            {/* Top Right Controls */}
            <div className="position-absolute top-0 end-0 p-4 d-flex gap-3" style={{ zIndex: 50 }}>
                <button
                    onClick={toggleLanguage}
                    className="btn btn-glass-toggle d-flex align-items-center justify-content-center p-0 shadow-sm"
                    style={{ width: '42px', height: '42px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 'bold' }}
                >
                    {language.toUpperCase()}
                </button>
                <button
                    onClick={toggleTheme}
                    className="btn btn-glass-toggle d-flex align-items-center justify-content-center p-0 shadow-sm"
                    style={{ width: '42px', height: '42px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '1.1rem' }}
                >
                    <i className={`bi bi-${theme === 'light' ? 'moon-stars-fill' : 'sun-fill'}`}></i>
                </button>
            </div>

            {/* Book Container */}
            <div className={`book-wrapper ${isBookOpen ? 'book-opened' : ''}`} style={{ zIndex: 10 }}>

                {/* 1. The Right Page (Login Form) */}
                <div className="book-page-right p-4 p-md-5 d-flex flex-column justify-content-center">
                    <div className="mb-4 text-center">
                        <h5 className="fw-bold mb-1" style={{ color: 'var(--primary-dark)' }}>{t('auth.welcome_back')}</h5>
                        <p className="text-muted small m-0">{t('auth.login_subtitle')}</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger border-0 d-flex align-items-center mb-3 py-2 px-3 rounded-3 bg-danger bg-opacity-10 text-danger shadow-sm">
                            <i className="bi bi-exclamation-octagon-fill me-2"></i>
                            <span className="small fw-semibold">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label className="form-label small text-muted text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>{t('auth.username')}</label>
                            <input
                                type="text"
                                className="form-control ps-3 py-2.5 fw-medium"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder={t('auth.enter_username')}
                                required
                            />
                        </div>

                        <div className="form-group mb-4">
                            <label className="form-label small text-muted text-uppercase fw-bold mb-0" style={{ fontSize: '0.7rem' }}>{t('auth.password')}</label>
                            <input
                                type="password"
                                className="form-control ps-3 py-2.5 fw-medium"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder={t('auth.enter_password')}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100 py-3 rounded-3 fw-bold shadow-sm d-flex justify-content-center align-items-center gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? <span className="spinner-border spinner-border-sm"></span> : t('auth.login_button')}
                        </button>
                    </form>

                    <div className="mt-auto text-center pt-3 border-top border-light">
                        <small className="text-muted" style={{ fontSize: '0.65rem' }}>{t('app_name')} &copy; {new Date().getFullYear()}</small>
                    </div>
                </div>

                {/* 2. The Rotating Cover Assembly */}
                <div className="book-cover-assembly">
                    {/* Front Cover */}
                    <div
                        className="book-cover-front p-4 text-center text-white"
                        onClick={() => !isBookOpen && setIsBookOpen(true)}
                        style={{ cursor: isBookOpen ? 'default' : 'pointer' }}
                    >
                        <div className="mb-4 bg-white p-3 rounded-circle shadow-lg d-inline-block" style={{ width: '100px', height: '100px' }}>
                            <img src="/images/logo.png" alt="Logo" className="w-100 h-100 object-fit-contain" />
                        </div>
                        <h2 className="fw-bolder mb-2 text-white" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>{t('app_name')}</h2>
                        <div className="bg-white opacity-25 rounded-pill my-3" style={{ height: '2px', width: '60px' }}></div>
                        <p className="small opacity-75 fw-light text-uppercase ls-1">SMK Bakti Nusantara 666</p>

                        <div className="mt-auto">
                            {!isBookOpen && (
                                <button className="btn btn-outline-light rounded-pill px-4 py-2 small fw-bold mt-4 shadow-sm animate-pulse">
                                    {t('auth.click_to_login')} <i className="bi bi-arrow-right ms-2"></i>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Back Cover (Inner Left) */}
                    <div className="book-cover-back p-4">
                        <div className="text-center opacity-25">
                            <img src="/images/logo.png" alt="Logo" style={{ filter: 'grayscale(100%)', width: '80px' }} />
                            <h5 className="mt-3 fw-bold text-muted text-uppercase ls-2">Arsip Digital</h5>
                        </div>
                    </div>
                </div>
            </div>

            <div className="position-absolute bottom-0 start-0 w-100 p-3 text-center text-white-50 small" style={{ zIndex: 10 }}>
                &copy; {new Date().getFullYear()} {t('auth.footer')}
            </div>
        </div>
    )
}
