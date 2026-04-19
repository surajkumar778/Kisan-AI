import { useState, useCallback } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const getToken = () => localStorage.getItem('kisan_token')
const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
})

export function useFarmer() {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const getProfile = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const res  = await fetch(`${API}/farmer/profile`, { headers: authHeaders() })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      return data.data
    } catch (err) {
      setError(err.message); return null
    } finally { setLoading(false) }
  }, [])

  const saveProfile = useCallback(async (profileData) => {
    setLoading(true); setError(null)
    try {
      const res  = await fetch(`${API}/farmer/profile`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify(profileData),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      return data.data
    } catch (err) {
      setError(err.message); return null
    } finally { setLoading(false) }
  }, [])

  const updateLocation = useCallback(async (locationData) => {
    setLoading(true); setError(null)
    try {
      const res  = await fetch(`${API}/farmer/location`, {
        method: 'PUT', headers: authHeaders(),
        body: JSON.stringify(locationData),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      return data.data
    } catch (err) {
      setError(err.message); return null
    } finally { setLoading(false) }
  }, [])

  const saveAdvisory = useCallback(async (advisoryData) => {
    try {
      await fetch(`${API}/farmer/advisory`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify(advisoryData),
      })
    } catch (err) {
      console.warn('Advisory save nahi hua:', err.message)
    }
  }, [])

  const getHistory = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const res  = await fetch(`${API}/farmer/advisory`, { headers: authHeaders() })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      return data.data
    } catch (err) {
      setError(err.message); return []
    } finally { setLoading(false) }
  }, [])

  return { getProfile, saveProfile, updateLocation, saveAdvisory, getHistory, loading, error }
}