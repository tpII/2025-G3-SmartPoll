import { useContext, createContext, useLayoutEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface IUser {
  email: string
  DNI: number 
  token: string
}

interface ILoginRequest {
  identifier: string | number
  password: string
}

interface IAuthContext {
  user: IUser | null
  logued: boolean
  loading: boolean
  handleLogin: (email: string, password: string) => Promise<number | void>
  handleSignup: (email: string, name: string, password: string) => Promise<number | void>
  handleLogout: () => void
  handle401: () => void
}

const AuthContext = createContext<IAuthContext | null>(null)

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
      const response = await fetch('http://localhost:8080/api/auth/signin', {
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

  const handleSignup = async (email, name, password) => {
    try {
      const response = await fetch('api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password }),
      })

      return response.status
    } catch {
      console.log('Algo salió mal')
    }
  }

  const handleLogout = () => {
    fetch('/api/auth/logout', {
      method: 'GET',
      credentials: 'same-origin',
    })
      .then((data) => data.json())
      .then(() => {
        setUser(null)
        setLogued(false)
        navigate('/login')
      })
      .catch((e) => console.log('Error: ', e))
  }

  useLayoutEffect(() => {
    // fetch('api/auth/me', {
    //   method: 'GET',
    //   credentials: 'same-origin',
    // })
    //   .then((data) => {
    //     if (data.status == 401) return null
    //     return data.json()
    //   })
    //   .then((user) => {
    //     setUser(user)
    //     setLogued(true)
    //   })
    //   .catch(() => setUser(null))
    //   .finally(() => setLoading(false))
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        logued,
        handleLogin,
        handleSignup,
        handleLogout,
        handle401,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider }

export const useAuth = () => {
  return useContext(AuthContext)
}
