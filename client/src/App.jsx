import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import useLenis from './hooks/useLenis.js'
import useAnalytics from './hooks/useAnalytics.js'
import AuthProvider from './contexts/AuthContext.jsx'
import { useAuth } from './contexts/auth'

const Home = lazy(() => import('./pages/Home.jsx'))
const AdminLogin = lazy(() => import('./pages/AdminLogin.jsx'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'))

function ProtectedRoute({ children }) {
	const { user } = useAuth()
	if (!user) return <Navigate to="/admin/login" replace />
	return children
}

export default function App() {
	useLenis()
	useEffect(() => {
		document.documentElement.lang = 'en'
	}, [])
	useAnalytics()
	return (
		<BrowserRouter>
			<AuthProvider>
				<div id="app" className="min-h-screen flex flex-col">
					<Navbar />
					<main id="main" role="main" className="flex-1">
						<Suspense fallback={<div className="p-6">Loading…</div>}>
							<Routes>
								<Route path="/" element={<Home />} />
								<Route path="/admin/login" element={<AdminLogin />} />
								<Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
							</Routes>
						</Suspense>
					</main>
					<Footer />
				</div>
			</AuthProvider>
		</BrowserRouter>
	)
}
