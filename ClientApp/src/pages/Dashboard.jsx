import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import {
   ResponsiveContainer,
   AreaChart,
   Area,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip as ChartTooltip
} from 'recharts'
import { useLanguage } from '../contexts/LanguageContext'

export default function Dashboard() {
   const { t, language } = useLanguage()
   const [stats, setStats] = useState({ masuk: 0, keluar: 0 })
   const [mailMap, setMailMap] = useState({})
   const [chartData, setChartData] = useState([])
   const navigate = useNavigate()

   useEffect(() => {
      fetchData()
   }, [])

   const fetchData = async () => {
      try {
         const [masuk, keluar] = await Promise.all([
            axios.get('/api/suratmasuk'),
            axios.get('/api/suratkeluar')
         ])

         setStats({ masuk: masuk.data.length, keluar: keluar.data.length })

         // Process Chart Data (Monthly)
         const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
         const currentYear = new Date().getFullYear()
         const monthlyData = months.map(m => ({ name: m, masuk: 0, keluar: 0 }))

         masuk.data.forEach(item => {
            const date = new Date(item.tanggalMasuk)
            if (date.getFullYear() === currentYear) {
               monthlyData[date.getMonth()].masuk++
            }
         })

         keluar.data.forEach(item => {
            const date = new Date(item.tanggalKeluar || item.tanggalSurat)
            if (date.getFullYear() === currentYear) {
               monthlyData[date.getMonth()].keluar++
            }
         })
         setChartData(monthlyData)

         // Map data by date for calendar
         const map = {}
         const addToMap = (dateStr, item, type) => {
            if (!map[dateStr]) map[dateStr] = []
            map[dateStr].push({ ...item, type })
         }

         masuk.data.forEach(item => {
            const d = new Date(item.tanggalMasuk).toDateString()
            addToMap(d, item, 'in')
         })

         keluar.data.forEach(item => {
            const d = new Date(item.tanggalKeluar || item.tanggalSurat).toDateString()
            addToMap(d, item, 'out')
         })

         setMailMap(map)

      } catch (e) {
         console.error("Failed to fetch data", e);
      }
   }

   const tileClassName = ({ date, view }) => {
      if (view !== 'month') return null

      const dateString = date.toDateString()
      const items = mailMap[dateString] || []

      const hasMasuk = items.some(i => i.type === 'in')
      const hasKeluar = items.some(i => i.type === 'out')

      if (hasMasuk && hasKeluar) return 'highlight-mixed'
      if (hasMasuk) return 'highlight-masuk'
      if (hasKeluar) return 'highlight-keluar'
      return null
   }

   const tileContent = ({ date, view }) => {
      if (view !== 'month') return null
      const dateString = date.toDateString()
      const items = mailMap[dateString]

      if (!items || items.length === 0) return null

      const topItems = items.slice(0, 3)
      const moreCount = items.length - 3

      return (
         <div className="calendar-tooltip shadow-sm" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(10px)' }}>
            <div className="tooltip-header mb-1 pb-1 border-bottom small fw-bold" style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)' }}>
               {items.length} {t('dashboard.letters')}
            </div>
            {topItems.map((item, idx) => (
               <div key={idx} className="tooltip-item mb-1 d-flex align-items-center">
                  <span className={`badge ${item.type === 'in' ? 'bg-primary' : 'bg-success'} me-1`} style={{ fontSize: '0.6rem' }}>
                     {item.type === 'in' ? 'M' : 'K'}
                  </span>
                  <span className="small text-truncate d-inline-block" style={{ maxWidth: '120px', fontSize: '0.7rem', color: 'var(--text-main)' }}>
                     {item.type === 'in' ? item.pengirim : (item.penerima || t('menu.surat_keluar'))} - {item.perihal}
                  </span>
               </div>
            ))}
            {moreCount > 0 && (
               <div className="text-center small text-muted fst-italic" style={{ fontSize: '0.65rem' }}>
                  +{moreCount} {t('dashboard.more')}
               </div>
            )}
         </div>
      )
   }

   return (
      <div className="container-fluid p-0">
         {/* Hero Section */}
         <div className="card border-0 mb-4 overflow-hidden position-relative shadow-sm"
            style={{
               borderRadius: '16px',
               background: 'linear-gradient(120deg, var(--primary) 0%, var(--primary-dark) 100%)'
            }}>
            <div className="p-4 position-relative z-1 text-center text-md-start">
               <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
                  <div>
                     <h3 className="text-white fw-bold mb-1">{t('dashboard.welcome')}</h3>
                     <p className="text-white-50 m-0 small">{t('subtitle')}</p>
                  </div>
                  <div className="bg-white bg-opacity-10 p-2 rounded-circle d-none d-md-block">
                     <i className="bi bi-building text-white fs-4"></i>
                  </div>
               </div>
            </div>
            <div className="position-absolute top-0 end-0 opacity-10" style={{ transform: 'translate(30%, -30%)' }}>
               <svg width="250" height="250" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#FFFFFF" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,79.6,-46.3C87.4,-33.5,90.1,-18,87.9,-3.8C85.7,10.4,78.6,23.3,69.6,34.5C60.6,45.7,49.7,55.2,37.6,62.3C25.5,69.4,12.2,74.1,-0.5,75C-13.2,75.8,-25.9,72.8,-37.7,65.8C-49.5,58.8,-60.4,47.8,-68.6,35.1C-76.8,22.4,-82.3,8,-80.9,-5.8C-79.5,-19.6,-71.2,-32.8,-61.2,-43.3C-51.2,-53.8,-39.5,-61.6,-27.1,-69.8C-14.7,-78,-1.6,-86.6,12.3,-84.5C26.2,-82.4,52.4,-69.6,44.7,-76.4Z" transform="translate(100 100)" />
               </svg>
            </div>
         </div>

         <div className="row g-4 mb-4">
            <div className="col-12 col-lg-8">
               <h4 className="fw-bold mb-4 px-2 border-start border-4 border-primary ps-3" style={{ color: 'var(--text-main)' }}>{t('dashboard.overview')}</h4>

               <div className="row g-4 mb-4">
                  <div className="col-md-6">
                     <div className="stats-card h-100 position-relative border-0 shadow-sm">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                           <div className="bg-blue-100 text-primary p-3 rounded-circle bg-opacity-10" style={{ backgroundColor: 'rgba(14, 165, 233, 0.1)' }}>
                              <i className="bi bi-inbox-fill fs-3"></i>
                           </div>
                           <span className="badge bg-primary rounded-pill px-3 py-2">{t('dashboard.incoming')}</span>
                        </div>
                        <div>
                           <h6 className="text-uppercase fw-bold ls-1 mb-1" style={{ fontSize: '0.75rem', letterSpacing: '1px', color: 'var(--text-muted)' }}>{t('menu.surat_masuk')}</h6>
                           <h1 className="mb-0 fw-bolder display-4" style={{ color: 'var(--text-main)' }}>{stats.masuk}</h1>
                        </div>
                        <Link to="/surat-masuk" className="stretched-link"></Link>
                     </div>
                  </div>
                  <div className="col-md-6">
                     <div className="stats-card h-100 position-relative border-0 shadow-sm">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                           <div className="bg-green-100 text-success p-3 rounded-circle bg-opacity-10" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                              <i className="bi bi-send-fill fs-3"></i>
                           </div>
                           <span className="badge bg-success rounded-pill px-3 py-2">{t('dashboard.outgoing')}</span>
                        </div>
                        <div>
                           <h6 className="text-uppercase fw-bold ls-1 mb-1" style={{ fontSize: '0.75rem', letterSpacing: '1px', color: 'var(--text-muted)' }}>{t('menu.surat_keluar')}</h6>
                           <h1 className="mb-0 fw-bolder display-4" style={{ color: 'var(--text-main)' }}>{stats.keluar}</h1>
                        </div>
                        <Link to="/surat-keluar" className="stretched-link"></Link>
                     </div>
                  </div>
               </div>

               {/* Chart Section */}
               <div className="card glass border-0 p-4 mb-4 shadow-sm">
                  <h5 className="fw-bold mb-4">{t('dashboard.recent_activity')} {new Date().getFullYear()}</h5>
                  <div style={{ width: '100%', height: 300 }}>
                     <ResponsiveContainer>
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                           <defs>
                              <linearGradient id="colorMasuk" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                 <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                              </linearGradient>
                              <linearGradient id="colorKeluar" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                 <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                              </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
                           <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                           <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                           <ChartTooltip
                              contentStyle={{
                                 borderRadius: '12px',
                                 border: '1px solid var(--glass-border)',
                                 boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                 background: 'var(--glass-bg)',
                                 color: 'var(--text-main)'
                              }}
                              itemStyle={{ color: 'var(--text-main)' }}
                           />
                           <Area type="monotone" dataKey="masuk" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorMasuk)" name={t('menu.surat_masuk')} />
                           <Area type="monotone" dataKey="keluar" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorKeluar)" name={t('menu.surat_keluar')} />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
               </div>

               {/* Quick Actions */}
               <div className="card glass border-0 p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                     <div>
                        <h5 className="fw-bold m-0" style={{ color: 'var(--text-main)' }}>{t('common.action')}</h5>
                        <small className="text-muted">{t('dashboard.shortcut_desc')}</small>
                     </div>
                  </div>
                  <div className="d-flex flex-wrap gap-3">
                     <button onClick={() => navigate('/surat-masuk', { state: { openForm: true } })} className="btn btn-primary d-flex align-items-center gap-2 py-3 px-4 shadow-sm">
                        <i className="bi bi-plus-circle-fill"></i> {t('common.add')} {t('menu.surat_masuk')}
                     </button>
                     <button onClick={() => navigate('/surat-keluar', { state: { openForm: true } })} className="btn btn-success d-flex align-items-center gap-2 py-3 px-4 shadow-sm text-white">
                        <i className="bi bi-plus-circle-fill"></i> {t('common.add')} {t('menu.surat_keluar')}
                     </button>
                  </div>
               </div>
            </div>

            {/* Calendar Widget */}
            <div className="col-12 col-lg-4">
               <div className="card border-0 shadow-sm p-4 h-100">
                  <h5 className="fw-bold mb-4 text-center" style={{ color: 'var(--text-main)' }}>{t('dashboard.calendar_title')}</h5>
                  <div className="calendar-container d-flex justify-content-center">
                     <Calendar
                        locale={language === 'id' ? 'id-ID' : 'en-US'}
                        tileClassName={tileClassName}
                        tileContent={tileContent}
                        className="border-0 shadow-none w-100"
                     />
                  </div>
                  <div className="mt-4 pt-3 border-top">
                     <div className="d-flex align-items-center gap-3 justify-content-center small">
                        <div className="d-flex align-items-center gap-2">
                           <span className="d-inline-block rounded-circle" style={{ width: '12px', height: '12px', backgroundColor: 'var(--primary)' }}></span>
                           <span className="small" style={{ color: 'var(--text-muted)' }}>{t('menu.surat_masuk')}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                           <span className="d-inline-block rounded-circle" style={{ width: '12px', height: '12px', backgroundColor: '#10b981' }}></span>
                           <span className="small" style={{ color: 'var(--text-muted)' }}>{t('menu.surat_keluar')}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}
