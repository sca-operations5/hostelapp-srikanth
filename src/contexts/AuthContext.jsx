import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState(null)
  const [permissions, setPermissions] = useState([])

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserRole(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchUserRole(session.user.id)
      } else {
        setUserRole(null)
        setPermissions([])
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserRole = async (userId) => {
    try {
      // First check if user is staff
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('role, permissions')
        .eq('user_id', userId)
        .single()

      if (staffError && staffError.code !== 'PGRST116') {
        console.error('Error fetching staff role:', staffError)
        setLoading(false)
        return
      }

      if (staffData) {
        setUserRole(staffData.role)
        setPermissions(staffData.permissions || [])
        setLoading(false)
        return
      }

      // If not staff, check if student
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', userId)
        .single()

      if (studentError && studentError.code !== 'PGRST116') {
        console.error('Error fetching student data:', studentError)
        setLoading(false)
        return
      }

      if (studentData) {
        setUserRole('student')
        setPermissions(['view_own_profile', 'view_own_attendance', 'submit_complaints'])
        setLoading(false)
        return
      }

      // If no role found, set as guest
      setUserRole('guest')
      setPermissions([])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching user role:', error)
      setUserRole(null)
      setPermissions([])
      setLoading(false)
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
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUserRole(null)
      setPermissions([])
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const hasPermission = (permission) => {
    return permissions.includes(permission)
  }

  const value = {
    user,
    userRole,
    permissions,
    loading,
    signIn,
    signOut,
    hasPermission,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
  