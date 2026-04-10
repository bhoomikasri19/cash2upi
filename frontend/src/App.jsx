import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import Login from './pages/Login'
import Home from './pages/Home'
import Seeker from './pages/Seeker'
import Provider from './pages/Provider'
import Success from './pages/Success'
import Profile from './pages/Profile'
import Wallet from './pages/Wallet'
import Transactions from './pages/Transactions'
import GetUPI from './pages/GetUPI'
import GiveUPI from './pages/GiveUPI'

// Protects routes — redirect to login if not logged in
function Guard({ children }) {
  const user = JSON.parse(sessionStorage.getItem('user') || '{}')
  return user.loggedIn ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Guard><Home /></Guard>} />
        <Route path="/seeker" element={<Guard><Seeker /></Guard>} />
        <Route path="/provider" element={<Guard><Provider /></Guard>} />
        <Route path="/get-upi" element={<Guard><GetUPI /></Guard>} />
        <Route path="/give-upi" element={<Guard><GiveUPI /></Guard>} />
        <Route path="/success" element={<Guard><Success /></Guard>} />
        <Route path="/profile" element={<Guard><Profile /></Guard>} />
        <Route path="/wallet" element={<Guard><Wallet /></Guard>} />
        <Route path="/transactions" element={<Guard><Transactions /></Guard>} />
      </Routes>
    </BrowserRouter>
  )
}
