import { createContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'


const apiUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : 'http://localhost:8080';


interface IUser {
  email: string
  DNI: number 
  token: string
}

interface IAuthContext {
  user: IUser | null
  logued: boolean
  loading: boolean
  handleLogin: (email: string, password: string) => Promise<number | void>
  handleSignUp: (email: string, dni: number | string, password: string) => Promise<number | void>
  handleLogout: () => void
  handle401: () => void
}

const AuthContext = createContext<IAuthContext>({
  user: null,
  logued: false,
  loading: false,
  handleLogin: async () => {},
  handleSignUp: async () => {},
  handleLogout: () => {},
  handle401: () => {},
})

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null)
  const [logued, setLogued] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const setDefault = () => {
    setUser(null)
    setLogued(false)
  }

  const handle401 = () => {
    setDefault()
  }

  const handleLogin = async (identifier : string | number, password: string) => {
    try {
      const response = await fetch(`${apiUrl}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      })

      if (!response.ok) return response.status

      const data = await response.json()

      setUser(data)
      setLogued(true)
      localStorage.setItem('token', data.token)

      navigate('/')

      setLoading(false)
    } catch {
      console.log('Hubo un error')
    }
  }

  const handleSignUp = async (email: string, dni: number | string, password: string) => {
    try {
      const response = await fetch(`${apiUrl}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, DNI: dni , password }),
      })
      if (!response.ok) return response.status

      const data = await response.json()

      setUser(data)
      setLogued(true)
      localStorage.setItem('token', data.token)

      navigate('/')
      setLoading(false)
    } catch {
      console.log('Algo salió mal')
    }
  }

  const handleLogout = () => {
    setUser(null)
    setLogued(false)
    localStorage.removeItem('token')
    navigate('/login')

  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        logued,
        handleLogin,
        handleSignUp,
        handleLogout,
        handle401,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
