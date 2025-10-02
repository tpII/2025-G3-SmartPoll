'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { QrCode, LogOut, CheckCircle, Loader, Check } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { useAuth } from '@/hooks/useAuth'

const apiUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : 'http://localhost:8080';

interface QRCodeDisplayProps {
  onReset: () => void
}

export function QRDisplay({
  onReset,
}: QRCodeDisplayProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [isScanned, setIsScanned] = useState(false)

  const {handleLogout} = useAuth();

  const onScanned = () => {
    // navigate('/success');
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    // SSE con query param
    const eventSource = new EventSourcePolyfill(
      `${apiUrl}/api/qr`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    let opened = false
    eventSource.onopen = () => {
      if (!opened) {
        console.log('SSE connection opened')
        opened = true
      }
    }

    // @ts-expect-error TS2322
    eventSource.addEventListener("qrStatus", (event : MessageEvent) => {
      try {
        const data = JSON.parse(event.data)
        console.log('Mensaje SSE:', data)

        if (data.status === 'scanned') {
          setIsScanned(true)
          onScanned()
          eventSource.close()
        }

        if (data.status== "waiting" && data.token && !qrCodeUrl) setQrCodeUrl(data.token)



      } catch (err) {
        console.error('Error parseando SSE:', err)
      }
    })

    eventSource.onerror = (err) => {
      console.error('Error SSE', err)
      eventSource.close()

      if (opened) {
        setQrCodeUrl('a')
        setIsScanned(true)
        onScanned()
      }

    }

    // cleanup al desmontar
    return () => {
      eventSource.close()
    }
  }, [])

  return (
    <div className='flex min-h-screen items-center justify-center p-4'>
      <Card className='w-full max-w-md shadow-lg'>
        <CardHeader className='text-center space-y-4'>
          <div className='flex justify-center'>
            <div className='flex items-center justify-center w-16 h-16 bg-primary rounded-full'>
              {isScanned ? (
                <CheckCircle className='w-8 h-8 text-primary-foreground' />
              ) : (
                <QrCode className='w-8 h-8 text-primary-foreground' />
              )}
            </div>
          </div>
          <div>
            <CardTitle className='text-2xl font-bold text-balance'>
              {isScanned ? 'El código QR ha sido escaneado' : 'Tu código QR de acceso'}
            </CardTitle>
            <CardDescription className='text-muted-foreground'>
              {isScanned
                ? 'Verificación exitosa.'
                : 'Presenta este código QR al escáner de votación'}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='flex justify-center'>
            <div
              className={`p-4 bg-white rounded-lg shadow-inner transition-all duration-500`}
            >
              {qrCodeUrl ? (
                !isScanned ? (
                <QRCodeSVG
                  value={qrCodeUrl}
                  className='w-64 h-64 text-muted-foreground'
                  />) : (
                    <div className='w-64 h-64 flex items-center justify-center bg-green-500 rounded'>

                      <Check className='size-24 text-primary-foreground' />
                      </div>
                )
              ) : (
                <div className='w-64 h-64 flex items-center justify-center bg-gray-200 rounded'>
                  <Loader className='w-8 h-8 text-gray-500 animate-spin' />
                </div>
              )}
            </div>
          </div>

          <div className='text-center space-y-2'>
            <p className='text-xs text-muted-foreground'>
              Mantén esta pantalla visible hasta que sea escaneada
            </p>
          </div>

          <Button
            variant='outline'
            className='w-full bg-transparent'
            disabled={isScanned}
            onClick={handleLogout}
          >
            <LogOut className='w-4 h-4 mr-2' />
            Cerrar sesión
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
