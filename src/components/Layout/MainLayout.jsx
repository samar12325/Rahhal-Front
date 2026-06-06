import { Outlet } from 'react-router-dom'
import Header from '../../pages/Home/components/Header'
import '../../pages/Home/Home.css'
import './MainLayout.css'
import { useLanguage } from '../../i18n/LanguageContext'

function MainLayout() {
  const { dir } = useLanguage()

  return (
    <div className="rahhalLayout" dir={dir}>
      <Header />
      <Outlet />
    </div>
  )
}

export default MainLayout
