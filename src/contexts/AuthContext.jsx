import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate, useLocation } from 'react-router-dom'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loadingInitial, setLoadingInitial] = useState(true)
  const [loadingAuthChange, setLoadingAuthChange] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoadingInitial(true)
    setError(null)

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        await fetchUserProfile(currentUser)
      } else {
        setProfile(null)
      }
      setLoadingInitial(false)
    }).catch(err => {
      console.error("Error getting initial session:", err)
      setError("Failed to initialize session.")
      setUser(null)
      setProfile(null)
      setLoadingInitial(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log("Auth state changed:", _event, session)
        setLoadingAuthChange(true)
        setError(null)
        const currentUser = session?.user ?? null
        setUser(currentUser)
        if (currentUser) {
          await fetchUserProfile(currentUser)
        } else {
          setProfile(null)
        }
        setLoadingAuthChange(false)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const fetchUserProfile = async (currentUser) => {
    if (!currentUser) {
      setProfile(null)
      return null
    }

    try {
      setError(null)
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('id, assigned_branch_id, role')
        .eq('id', currentUser.id)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError)
        setError('Failed to fetch user profile.')
        setProfile(null)
        return null
      }

      if (data) {
        setProfile(data)
        return data
      } else {
        console.log(`No profile found for user ${currentUser.id}. Account setup might be pending.`)
        setProfile(null)
        return null
      }
    } catch (err) {
      console.error('Unexpected error fetching profile:', err)
      setError('An unexpected error occurred while fetching the user profile.')
      setProfile(null)
      return null
    }
  }

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      setError(error.message || 'Failed to sign in.')
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Sign out error:', error)
      setError(error.message || 'Failed to sign out.')
      return { error }
    }
  }

  const value = {
    user,
    profile,
    isLoggedIn: !!user,
    isProfileSetupComplete: !!profile?.role,
    userRole: profile?.role || null,
    isLoading: loadingInitial || loadingAuthChange,
    error,
    signIn,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
  