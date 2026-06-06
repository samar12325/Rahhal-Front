import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../../assets/images/rahhal-logo.png'
import { useLanguage } from '../../../i18n/LanguageContext'

function Header() {
  const { language, setLanguage, t } = useLanguage()
  const [isTripsOpen, setIsTripsOpen] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const helpMenuRef = useRef(null)
  const profileMenuRef = useRef(null)
  const searchWrapperRef = useRef(null)
  const navigate = useNavigate()
  const navLinks = [
    { to: '/home#destinations', label: t('header.links.destinations') },
    { to: '/contact', label: t('header.links.contact') },
  ]

  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthenticated(Boolean(localStorage.getItem('rahhalUser')))
    }

    handleAuthChange()
    window.addEventListener('storage', handleAuthChange)
    window.addEventListener('rahhal-user-change', handleAuthChange)

    return () => {
      window.removeEventListener('storage', handleAuthChange)
      window.removeEventListener('rahhal-user-change', handleAuthChange)
    }
  }, [])

  useEffect(() => {
    if (!isHelpOpen && !isProfileOpen) return

    const handleClickOutside = (event) => {
      if (isHelpOpen && helpMenuRef.current && !helpMenuRef.current.contains(event.target)) {
        setIsHelpOpen(false)
      }

      if (
        isProfileOpen &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsHelpOpen(false)
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isHelpOpen, isProfileOpen])

  useEffect(() => {
    if (!isSearchOpen) return

    const handleOutside = (event) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target)) {
        setIsSearchOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') setIsSearchOpen(false)
    }

    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isSearchOpen])

  const handleSignOut = () => {
    localStorage.removeItem('rahhalUser')
    window.dispatchEvent(new Event('rahhal-user-change'))
    setIsAuthenticated(false)
    setIsProfileOpen(false)
    navigate('/home')
  }

  return (
    <header className="header">
      <div className="container headerInner">
        <div className="brandSearch">
          <Link className="brand" to="/home" aria-label={t('header.brandLabel')}>
            <img className="logo" src={logo} alt={t('header.logoAlt')} />
          </Link>
          <div
            ref={searchWrapperRef}
            className={`searchWrapper ${isSearchOpen ? 'searchOpen' : ''}`}
          >
            <div className="searchBox" onClick={() => setIsSearchOpen(false)}>
              <svg
                className="searchIcon"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667ZM14 14l-2.9-2.9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                type="search"
                className="searchInput"
                placeholder={t('header.search.placeholder')}
                aria-label={t('header.search.aria')}
                value={searchQuery}
                onClick={(event) => event.stopPropagation()}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
            <button
              type="button"
              className={`searchToggle ${isSearchOpen ? 'isActive' : ''}`}
              aria-label={isSearchOpen ? t('header.search.close') : t('header.search.open')}
              aria-expanded={isSearchOpen}
              onClick={() => setIsSearchOpen((prev) => !prev)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667ZM14 14l-2.9-2.9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <nav className="nav" aria-label={t('header.navLabel')}>
          {navLinks.map((link) => (
            <Link className="navLink" to={link.to} key={link.to}>
              {link.label}
            </Link>
          ))}
          <div className="navDropdown">
            <button
              type="button"
              className="navLink navTrigger"
              aria-expanded={isTripsOpen}
              onClick={() => setIsTripsOpen((prev) => !prev)}
            >
              {t('header.trips')}
            </button>
            {isTripsOpen && (
              <div className="navMenu" role="menu">
                <Link className="navMenuItem" role="menuitem" to="/events">
                  {t('header.tripsMenu.available')}
                </Link>
                <Link className="navMenuItem" role="menuitem" to="/ai-trips">
                  {t('header.tripsMenu.ai')}
                </Link>
                <Link className="navMenuItem" role="menuitem" to="/school-trips">
                  {t('header.tripsMenu.school')}
                </Link>
                <Link className="navMenuItem" role="menuitem" to="/group-trips">
                  {t('header.tripsMenu.group')}
                </Link>
              </div>
            )}
          </div>
        </nav>

        <div className="actions">
          <div className="langToggle" role="group" aria-label={t('header.languageToggle')}>
            <button
              type="button"
              className={`langBtn ${language === 'en' ? 'active' : ''}`}
              aria-pressed={language === 'en'}
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
            <span className="langDivider" aria-hidden="true">|</span>
            <button
              type="button"
              className={`langBtn ${language === 'ar' ? 'active' : ''}`}
              aria-pressed={language === 'ar'}
              onClick={() => setLanguage('ar')}
            >
              AR
            </button>
          </div>

          <div className="navDropdown" ref={helpMenuRef}>
            <button
              type="button"
              className="helpBtn"
              aria-expanded={isHelpOpen}
              aria-label={t('header.help')}
              onClick={() => setIsHelpOpen((prev) => !prev)}
            >
              ?
            </button>
            {isHelpOpen && (
              <div className="navMenu navMenuHelp" role="menu">
                <Link className="navMenuItem" role="menuitem" to="/how-to-start">
                  {t('header.helpMenu.howToStart')}
                </Link>
                <Link className="navMenuItem" role="menuitem" to="/faq">
                  {t('header.helpMenu.faq')}
                </Link>
                <Link className="navMenuItem" role="menuitem" to="/contact">
                  {t('header.helpMenu.contact')}
                </Link>
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <div className="navDropdown profileDropdown" ref={profileMenuRef}>
              <button
                type="button"
                className="profileBtn"
                aria-expanded={isProfileOpen}
                aria-label={t('header.profile.label')}
                onClick={() => setIsProfileOpen((prev) => !prev)}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M12 12a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5ZM5.25 19.25a6.75 6.75 0 0 1 13.5 0"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {isProfileOpen && (
                <div className="navMenu profileMenu" role="menu">
                  <Link
                    className="navMenuItem"
                    role="menuitem"
                    to="/profile"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    {t('header.profile.label')}
                  </Link>
                  <Link
                    className="navMenuItem"
                    role="menuitem"
                    to="/profile#bookings"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    {t('header.profile.bookings')}
                  </Link>
                  <Link
                    className="navMenuItem"
                    role="menuitem"
                    to="/stats"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    {t('header.profile.stats')}
                  </Link>
                  <Link
                    className="navMenuItem"
                    role="menuitem"
                    to="/admin/approvals"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    {t('header.profile.approvals')}
                  </Link>
                  <Link
                    className="navMenuItem"
                    role="menuitem"
                    to="/admin/trips"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    {t('header.profile.manage')}
                  </Link>
                  <button
                    type="button"
                    className="navMenuItem navMenuButton"
                    onClick={handleSignOut}
                  >
                    {t('header.profile.signOut')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link className="primaryBtn" to="/login">
              {t('header.signIn')}
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
