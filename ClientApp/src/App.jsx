import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import SuratMasuk from './pages/SuratMasuk'
import SuratKeluar from './pages/SuratKeluar'
import KategoriPerihal from './pages/KategoriPerihal'
import WordAddIn from './pages/WordAddIn'
import VisualSurat from './pages/VisualSurat'
import Pengguna from './pages/Pengguna'
import Layout from './components/Layout'
import axios from 'axios'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const stored = localStorage.getItem('user')
    if (stored) {
      setUser(JSON.parse(stored))
    }
    setLoading(false)
  }

  if (loading) return <div className="d-flex justify-content-center align-items-center vh-100 text-white">Loading...</div>

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login setUser={setUser} />} />

        {/* Word Add-in Route (Accessible publicly for sidebar) */}
        <Route path="/word-addin" element={<WordAddIn />} />

        <Route element={user ? <Layout user={user} setUser={setUser} theme={theme} setTheme={setTheme} /> : <Navigate to="/login" />}>
          <Route path="/" element={<Dashboard theme={theme} />} />
          <Route path="/surat-masuk" element={<SuratMasuk />} />
          <Route path="/surat-keluar" element={<SuratKeluar />} />
          <Route path="/kategori-perihal" element={<KategoriPerihal />} />
          <Route path="/visual-surat/:type" element={<VisualSurat />} />
          <Route path="/pengguna" element={<Pengguna />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
