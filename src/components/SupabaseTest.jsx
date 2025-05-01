import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function SupabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState('Testing connection...')
  const [error, setError] = useState(null)

  useEffect(() => {
    async function testConnection() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error) {
          setError(error.message)
          setConnectionStatus('Connection failed')
        } else {
          setConnectionStatus('Successfully connected to Supabase!')
          console.log('Current user:', user)
        }
      } catch (error) {
        setError(error.message)
        setConnectionStatus('Connection failed')
      }
    }

    testConnection()
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Supabase Connection Test</h2>
      <p className="mb-2">Status: {connectionStatus}</p>
      {error && (
        <p className="text-red-500">Error: {error}</p>
      )}
    </div>
  )
} 