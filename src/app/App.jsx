import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import LandingPage from '../pages/Landing/LandingPage'
import Home from '../pages/Home/Home'
import Login from '../pages/Login/Login'
import Signup from '../pages/Signup/Signup'
import ForgotPassword from '../pages/ForgotPassword/ForgotPassword'
import ResetPassword from '../pages/ResetPassword/ResetPassword'
import EventsPage from '../pages/Events/EventsPage'
import BookingDateSelection from '../pages/BookingDateSelection/BookingDateSelection'
import AiTrips from '../pages/AiTrips/AiTrips'
import GroupTrips from '../pages/GroupTrips/GroupTrips'
import SchoolTrips from '../pages/SchoolTrips/SchoolTrips'
import ParentApproval from '../pages/ParentApproval/ParentApproval'
import SchoolTripPreparation from '../pages/SchoolTripPreparation/SchoolTripPreparation'
import ParentTripTracking from '../pages/ParentTripTracking/ParentTripTracking'
import DestinationDetails from '../pages/DestinationDetails/DestinationDetails'
import Checkout from '../pages/Checkout/Checkout'
import BookingSuccess from '../pages/BookingSuccess/BookingSuccess'
import MainLayout from '../components/Layout/MainLayout'
import HowToStart from '../pages/Help/HowToStart'
import FAQ from '../pages/FAQ/FAQ'
import Contact from '../pages/Contact/Contact'
import Profile from '../pages/Profile/Profile'
import AdminEvents from '../pages/AdminEvents/AdminEvents'
import AdminContactMessages from '../pages/AdminContactMessages/AdminContactMessages'
import AdminTrips from '../pages/AdminTrips/AdminTrips'
import AdminApprovals from '../pages/AdminApprovals/AdminApprovals'
import StatsPage from '../pages/StatsPage/StatsPage'
import AdminRoute from '../components/routes/AdminRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/destinations/:id" element={<DestinationDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route path="/how-to-start" element={<HowToStart />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/approvals" element={<AdminApprovals />} />
          <Route element={<AdminRoute />}>
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/admin/trips" element={<AdminTrips />} />
            <Route path="/admin/events" element={<AdminEvents />} />
            <Route path="/admin/contact-messages" element={<AdminContactMessages />} />
          </Route>
        </Route>
        <Route path="/events" element={<EventsPage />} />
        <Route path="/trips" element={<Navigate to="/events" replace />} />
        <Route path="/booking" element={<BookingDateSelection />} />
        <Route path="/ai-trips" element={<AiTrips />} />
        <Route path="/group-trips" element={<GroupTrips />} />
        <Route path="/school-trips" element={<SchoolTrips />} />
        <Route path="/school-trips/:tripId/preparation" element={<SchoolTripPreparation />} />
        <Route path="/parent-approval/:token" element={<ParentApproval />} />
        <Route path="/trip-tracking/:token" element={<ParentTripTracking />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
