import { useEffect, useRef, useState } from 'react'
import ScrollLink from './ScrollLink'

const NAV_ITEMS = [
  { id: 'home', label: 'HOME' },
  { id: 'about', label: 'ABOUT' },
  { id: 'skills', label: 'SKILLS' },
  { id: 'projects', label: 'PROJECTS' },
  { id: 'experience', label: 'EXPERIENCE' },
  { id: 'contact', label: 'CONTACT' },
]

export default function Navbar({ activeSection, onActivateTab, onExpandAbout, onExpandSkillsShowMore }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef(null)

  const closeMenu = () => setMenuOpen(false)

  const toggleSearch = () => {
    setSearchOpen((open) => {
      const next = !open
      if (next) setTimeout(() => searchInputRef.current?.focus(), 0)
      return next
    })
  }

  const runSearch = () => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return

    const sections = document.querySelectorAll('main .section')
    let match = null
    sections.forEach((sec) => {
      if (!match && sec.textContent.toLowerCase().includes(q)) match = sec
    })

    if (match) {
      const panels = match.querySelectorAll('.tab-panel')
      panels.forEach((p) => {
        if (p.textContent.toLowerCase().includes(q) && !p.classList.contains('active')) {
          const id = p.id.replace('tab-', '')
          onActivateTab?.(id)
        }
        if (p.id === 'tab-data') {
          const hitsHiddenExtra = [...p.querySelectorAll('.icon-card.hidden-extra')].some((card) =>
            card.textContent.toLowerCase().includes(q),
          )
          if (hitsHiddenExtra) onExpandSkillsShowMore?.()
        }
      })

      const aboutMoreEl = document.getElementById('aboutMore')
      if (aboutMoreEl && aboutMoreEl.textContent.toLowerCase().includes(q) && !aboutMoreEl.classList.contains('open')) {
        onExpandAbout?.()
      }

      match.scrollIntoView({ behavior: 'smooth', block: 'start' })
      match.classList.remove('flash')
      void match.offsetWidth
      match.classList.add('flash')
    } else if (searchInputRef.current) {
      searchInputRef.current.style.borderColor = '#e05555'
      setTimeout(() => {
        if (searchInputRef.current) searchInputRef.current.style.borderColor = ''
      }, 900)
    }
  }

  useEffect(() => {
    if (!searchOpen) return
    searchInputRef.current?.focus()
  }, [searchOpen])

  return (
    <header className="navbar">
      <div className="nav-inner">
        <ScrollLink to="home" className="logo" onNavigate={closeMenu}>
          Mahesh<span>wor</span>
        </ScrollLink>

        <nav className={`nav-links${menuOpen ? ' open' : ''}`} id="navLinks">
          {NAV_ITEMS.map(({ id, label }) => (
            <ScrollLink
              key={id}
              to={id}
              className={activeSection === id ? 'active' : undefined}
              data-section={id}
              onNavigate={closeMenu}
            >
              {label}
            </ScrollLink>
          ))}
        </nav>

        <div className="nav-right">
          <div className={`search-box${searchOpen ? ' open' : ''}`} id="searchBox">
            <input
              ref={searchInputRef}
              type="text"
              id="searchInput"
              placeholder="Search portfolio…"
              aria-label="Search portfolio"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') runSearch()
              }}
            />
            <button id="searchGo" type="button" aria-label="Run search" onClick={runSearch}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
          <button className="icon-btn" id="searchToggle" type="button" aria-label="Toggle search" onClick={toggleSearch}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </button>
          <button
            className="icon-btn menu-toggle"
            id="menuToggle"
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
