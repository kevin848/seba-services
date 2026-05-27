import React, { useState } from 'react'
import Sounds from './Sounds'
import Services from './Services'
import './admin.css'

export default function AdminLayout() {
  const [tab, setTab] = useState<'sounds' | 'services'>('sounds')

  return (
    <div className="admin-root">
      <header className="admin-header">
        <h1>I&N — Sounds & Services</h1>
        <nav>
          <button className={tab === 'sounds' ? 'active' : ''} onClick={() => setTab('sounds')}>Sounds</button>
          <button className={tab === 'services' ? 'active' : ''} onClick={() => setTab('services')}>Services</button>
        </nav>
      </header>
      <main className="admin-main">
        {tab === 'sounds' ? <Sounds /> : <Services />}
      </main>
    </div>
  )
}
