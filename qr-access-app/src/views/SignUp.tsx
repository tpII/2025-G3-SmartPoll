import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Vote, Shield } from 'lucide-react'
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

    if (status === 401 || status === 404) {
      alert('Sign up failed. Please check your credentials.')
    }

    setIsLoading(false)
  }

  return (
    <div className='flex min-h-screen items-center justify-center p-4'>
      <Card className='w-full max-w-md shadow-lg'>
        <CardHeader className='text-center space-y-4'>
          <div className='flex justify-center'>
            <div className='flex items-center justify-center w-16 h-16 bg-primary rounded-full'>
              <Vote className='w-8 h-8 text-primary-foreground' />
            </div>
          </div>
          <div>
            <CardTitle className='text-2xl font-bold text-balance'>
              Secure Voting System
            </CardTitle>
            <CardDescription className='text-muted-foreground'>
              Enter your credentials to access the voting platform
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <FormField
              label='Email'
              inputType='text'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FormField
              label='DNI'
              inputType='text'
              placeholder='Enter your DNI'
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              required
            />
            <FormField
              label='Password'
              inputType='password'
              placeholder='Enter your password'
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
                  Authenticating...
                </div>
              ) : (
                <div className='flex items-center gap-2'>
                  <Shield className='w-4 h-4' />
                  Sign Up 
                </div>
              )}
            </Button>
            <div className='mt-4 text-center'>
              <p className='text-sm text-muted-foreground'>
                Already have an account? <Link to='/login' className='text-primary'>Log in</Link>
              </p>
            </div>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-sm text-muted-foreground'>
              Secure authentication powered by advanced encryption
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
