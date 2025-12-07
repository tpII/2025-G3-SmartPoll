import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,

} from '@/components/ui/card'
import { toast } from 'sonner'
import { Shield } from 'lucide-react'
import { FormField } from '@/components/FormField'
import { useAuth } from '@/hooks/useAuth'
import { Link } from 'react-router-dom'


export function SignUp() {
  const [email, setEmail] = useState('')
  const [dni, setDni] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { handleSignUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const status = handleSignUp && await handleSignUp(email, dni, password)


    if (status == 400) {
      toast.error('Credenciales inválidas.')
    }

    if (status === 401 || status === 404) {
      toast.error('Error de registro. Por favor verifica tus credenciales.')
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
              Crea una cuenta para acceder a la plataforma de votación
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
            <FormField
              label='Email'
              inputType='text'
              placeholder='Ingresa tu email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FormField
              label='DNI'
              inputType='number'
              placeholder='Ingresa tu DNI'
              value={dni}
              onChange={(e) => {
              const numValue = Number(e.target.value);
              if (!isNaN(numValue) && numValue >= 0) {
                setDni(e.target.value);
              }
              }}
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
              disabled={isLoading || !email || !dni || !password}
              onClick={() => handleSignUp(email, dni, password)}
            >
              {isLoading ? (
                <div className='flex items-center gap-2'>
                  <div className='w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin' />
                  Autenticando...
                </div>
              ) : (
                <div className='flex items-center gap-2'>
                  <Shield className='w-4 h-4' />
                  Registrarse
                </div>
              )}
            </Button>
            <div className='mt-4 text-center'>
              <p className='text-sm text-muted-foreground'>
                ¿Ya tienes una cuenta? <Link to='/login' className='text-primary'>Iniciar sesión</Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
