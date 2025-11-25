import { useState, useEffect } from 'react'
import { authService, type Profile } from '@beltrame/shared'

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)

      if (currentUser) {
        const userProfile = await authService.getUserProfile(currentUser.id)
        setProfile(userProfile)
      }
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await authService.signIn(email, password)
    if (data.user) {
      setUser(data.user)
      const userProfile = await authService.getUserProfile(data.user.id)
      setProfile(userProfile)
    }
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await authService.signOut()
    if (!error) {
      setUser(null)
      setProfile(null)
    }
    return { error }
  }

  const hasRole = (roles: string[]) => {
    if (!profile) return false
    return roles.includes(profile.role)
  }

  return {
    user,
    profile,
    loading,
    signIn,
    signOut,
    hasRole,
    isAuthenticated: !!user,
  }
}
