import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../../../assets/images/rahhal-logo.png'
import { useLanguage } from '../../../i18n/LanguageContext'
import { apiRequest } from '../../../api/client'
import {
  clearStoredUser,
  getSessionEventName,
  isAdminUser,
  readStoredUser,
} from '../../../auth/session'
import { CONTACT_INBOX_EVENT } from '../../../utils/contactInbox'

function Header() {
  const { language, setLanguage, t } = useLanguage()
  const [isTripsOpen, setIsTripsOpen] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [unreadInboxCount, setUnreadInboxCount] = useState(0)
  const helpMenuRef = useRef(null)
  const profileMenuRef = useRef(null)
  const searchWrapperRef = useRef(null)
  const mobileMenuRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const isAuthenticated = Boolean(currentUser)
  const isAdmin = isAdminUser(currentUser)
  const navLinks = [
    { to: '/home#destinations', label: t('header.links.destinations') },
    { to: '/contact', label: t('header.links.contact') },
  ]
  const tripLinks = [
    { to: '/events', label: t('header.tripsMenu.available') },
    { to: '/ai-trips', label: t('header.tripsMenu.ai') },
    { to: '/school-trips', label: t('header.tripsMenu.school') },
    { to: '/group-trips', label: t('header.tripsMenu.group') },
  ]
  const helpLinks = [
    { to: '/how-to-start', label: t('header.helpMenu.howToStart') },
    { to: '/faq', label: t('header.helpMenu.faq') },
    { to: '/contact', label: t('header.helpMenu.contact') },
  ]
  const isTripsSectionActive = [
    '/events',
    '/ai-trips',
    '/school-trips',
    '/group-trips',
  ].some((path) => location.pathname.startsWith(path))

  useEffect(() => {
    const handleAuthChange = () => {
      setCurrentUser(readStoredUser())
    }

    handleAuthChange()
    window.addEventListener('storage', handleAuthChange)
    window.addEventListener(getSessionEventName(), handleAuthChange)

    return () => {
      window.removeEventListener('storage', handleAuthChange)
      window.removeEventListener(getSessionEventName(), handleAuthChange)
    }
  }, [])

  useEffect(() => {
    if (!isAdmin) return

    let isMounted = true

    const loadUnreadCount = async () => {
      try {
        const payload = await apiRequest('/admin/contact-messages/unread-count')
        if (isMounted) setUnreadInboxCount(Number(payload?.count ?? 0))
      } catch {
        if (isMounted) setUnreadInboxCount(0)
      }
    }

    loadUnreadCount()
    window.addEventListener(CONTACT_INBOX_EVENT, loadUnreadCount)

    return () => {
      isMounted = false
      window.removeEventListener(CONTACT_INBOX_EVENT, loadUnreadCount)
    }
  }, [isAdmin])

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

  useEffect(() => {
    setIsTripsOpen(false)
    setIsHelpOpen(false)
    setIsProfileOpen(false)
    setIsSearchOpen(false)
    setIsMobileMenuOpen(false)
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (!isMobileMenuOpen) return

    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') setIsMobileMenuOpen(false)
    }

    document.body.classList.add('mobileMenuOpen')
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.body.classList.remove('mobileMenuOpen')
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isMobileMenuOpen])

  const handleSignOut = async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' })
    } catch {
      // Clear the local session even if the server logout fails.
    }

    clearStoredUser()
    setCurrentUser(null)
    setIsProfileOpen(false)
    navigate('/home')
  }

  const isLinkActive = (to) => {
    const path = to.split('#')[0]
    const hash = to.includes('#') ? to.slice(to.indexOf('#')) : ''
    const pathMatches = location.pathname === path
    const hashMatches = !hash || location.hash === hash
    return pathMatches && hashMatches
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

        <button
          type="button"
          className={`hamburgerBtn ${isMobileMenuOpen ? 'isOpen' : ''}`}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className="nav" aria-label={t('header.navLabel')}>
          {navLinks.map((link) => (
            <Link
              className={`navLink ${isLinkActive(link.to) ? 'isActive' : ''}`}
              to={link.to}
              key={link.to}
            >
              {link.label}
            </Link>
          ))}
          <div className="navDropdown">
            <button
              type="button"
              className={`navLink navTrigger ${isTripsSectionActive ? 'isActive' : ''}`}
              aria-expanded={isTripsOpen}
              onClick={() => setIsTripsOpen((prev) => !prev)}
            >
              {t('header.trips')}
            </button>
            {isTripsOpen && (
              <div className="navMenu" role="menu">
                {tripLinks.map((link) => (
                  <Link className="navMenuItem" role="menuitem" to={link.to} key={link.to}>
                    {link.label}
                  </Link>
                ))}
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
                  {isAdmin ? (
                    <Link
                      className="navMenuItem navMenuItemWithBadge"
                      role="menuitem"
                      to="/admin/contact-messages"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <span>{language === 'en' ? 'Inbox' : 'الوارد'}</span>
                      {unreadInboxCount > 0 ? (
                        <span className="menuBadge">{unreadInboxCount}</span>
                      ) : null}
                    </Link>
                  ) : null}
                  {isAdmin ? (
                    <Link
                      className="navMenuItem"
                      role="menuitem"
                      to="/stats"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      {t('header.profile.stats')}
                    </Link>
                  ) : null}
                  <Link
                    className="navMenuItem"
                    role="menuitem"
                    to="/admin/approvals"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    {t('header.profile.approvals')}
                  </Link>
                  {isAdmin ? (
                    <Link
                      className="navMenuItem"
                      role="menuitem"
                      to="/admin/trips"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      {t('header.profile.manage')}
                    </Link>
                  ) : null}
                  {isAdmin ? (
                    <Link
                      className="navMenuItem"
                      role="menuitem"
                      to="/admin/events"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      {t('header.profile.manageEvents')}
                    </Link>
                  ) : null}
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
            <Link className="primaryBtn headerSignIn" to="/login" aria-label={t('header.signIn')}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M12 12a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5ZM5.25 20a6.75 6.75 0 0 1 13.5 0"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="headerSignInText">{t('header.signIn')}</span>
            </Link>
          )}
        </div>
      </div>

      <div className={`mobileMenuBackdrop ${isMobileMenuOpen ? 'isVisible' : ''}`} aria-hidden="true" />
      <aside
        ref={mobileMenuRef}
        className={`mobileMenu ${isMobileMenuOpen ? 'isOpen' : ''}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="mobileMenuHeader">
          <div>
            <strong className="mobileMenuTitle">{t('header.navLabel')}</strong>
          </div>
          <button
            type="button"
            className="mobileMenuClose"
            aria-label="Close menu"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            ×
          </button>
        </div>

        <div className="mobileMenuSection">
          <div className="mobileSearchBox">
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
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <div className="langToggle mobileLangToggle" role="group" aria-label={t('header.languageToggle')}>
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
        </div>

        <nav className="mobileNav" aria-label={t('header.navLabel')}>
          {navLinks.map((link) => (
            <Link
              className={`mobileNavLink ${isLinkActive(link.to) ? 'isActive' : ''}`}
              to={link.to}
              key={link.to}
            >
              {link.label}
            </Link>
          ))}

          <div className="mobileNavGroup">
            <span className="mobileNavGroupLabel">{t('header.trips')}</span>
            {tripLinks.map((link) => (
              <Link className="mobileNavLink" to={link.to} key={link.to}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mobileNavGroup">
            <span className="mobileNavGroupLabel">{t('header.help')}</span>
            {helpLinks.map((link) => (
              <Link className="mobileNavLink" to={link.to} key={link.to}>
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </aside>
    </header>
  )
}

export default Header
