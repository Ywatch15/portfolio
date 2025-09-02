import axios from 'axios'

// Allow overriding API base URL at build-time for production deployments
const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || '/api'
const api = axios.create({ baseURL: API_BASE_URL, withCredentials: false })

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    localStorage.setItem('accessToken', token)
  } else {
    delete api.defaults.headers.common['Authorization']
    localStorage.removeItem('accessToken')
  }
}

// initialize from stored token
const stored = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''
if (stored) setAuthToken(stored)

api.interceptors.response.use(
  (res) => {
    if (res.data && typeof res.data === 'object' && 'success' in res.data) {
      if (!res.data.success) {
        const message = res.data.error?.message || 'Request failed'
        return Promise.reject(new Error(message))
      }
      return res.data.data
    }
    return res.data
  },
  (err) => Promise.reject(err)
)

export const getProjects = () => api.get('/projects')
export const getProject = (id) => api.get(`/projects/${id}`)
export const postContact = (payload) => api.post('/contact', payload)
export const adminLogin = (payload) => api.post('/admin/login', payload)
export const adminRefresh = (payload) => api.post('/admin/refresh-token', payload)
export const getContacts = (params) => api.get('/contact', { params })
export const getMetrics = () => api.get('/admin/metrics')
export const getAnalyticsSummary = () => api.get('/analytics/summary')
export const downloadResume = () => api.get('/resume/download')
export const markContactRead = (id) => api.patch(`/contact/${id}/read`)

export default api
