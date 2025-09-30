import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import { Shield } from 'lucide-react'
import { FormField } from '@/components/FormField'
import { useAuth } from '@/hooks/useAuth'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

export function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { handleLogin }  = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const status = handleLogin && await handleLogin(username, password)

    if (status == 400) {
      toast.error('Credenciales inválidas.')
    }

    if (status === 401 || status === 404) {
      toast.error('Error de inicio de sesión. Por favor verifica tus credenciales.')
    }

    setIsLoading(false)
  }

  return (
    <div className='flex min-h-screen items-center justify-center p-4'>
      <Card className='w-full max-w-md shadow-lg'>
        <CardHeader className='text-center space-y-4'>
          <div className='flex justify-center'>
              <img className='size-48' src='/smartpoll_title.svg' alt='Smartpoll Logo' />
          </div>
          <div>
            <CardDescription className='text-muted-foreground'>
              Ingresa tus credenciales para acceder a la plataforma de votación
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <FormField
              label='Email o DNI'
              inputType='text'
              placeholder='Ingresa tu email o DNI'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <FormField
              label='Contraseña'
              inputType='password'
              placeholder='Ingresa tu contraseña'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type='submit'
              className='w-full'
              disabled={isLoading || !username || !password}
              onClick={() => handleLogin(username, password)}
            >
              {isLoading ? (
                <div className='flex items-center gap-2'>
                  <div className='w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin' />
                  Autenticando...
                </div>
              ) : (
                <div className='flex items-center gap-2'>
                  <Shield className='w-4 h-4' />
                  Iniciar Sesión
                </div>
              )}
            </Button>
            <div className='mt-4 text-center'>
              <p className='text-sm text-muted-foreground'>
                ¿No tienes una cuenta? <Link to='/signup' className='text-primary'>Regístrate</Link>
              </p>
            </div>
          </form>

        </CardContent>
      </Card>
    </div>
  )
}
