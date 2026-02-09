import axios from 'axios'

const STORAGE_TOKEN_KEY = 'token'

export const getStoredToken = (): string | null =>
  window.localStorage.getItem(STORAGE_TOKEN_KEY)

export const setStoredToken = (token: string | null): void => {
  if (token) window.localStorage.setItem(STORAGE_TOKEN_KEY, token)
  else window.localStorage.removeItem(STORAGE_TOKEN_KEY)
}

function getBaseURL(): string {
  if (
    typeof import.meta.env.VITE_API_URL === 'string' &&
    import.meta.env.VITE_API_URL.length > 0
  )
    return import.meta.env.VITE_API_URL
  if (
    typeof import.meta.env.VITE_API_BASE_URL === 'string' &&
    import.meta.env.VITE_API_BASE_URL.length > 0
  )
    return import.meta.env.VITE_API_BASE_URL
  // Dev com Vite: base vazia para o proxy encaminhar /authorizers e /users
  if (import.meta.env.DEV) return ''
  return '/api'
}

const baseURL = getBaseURL()

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      setStoredToken(null)
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)
