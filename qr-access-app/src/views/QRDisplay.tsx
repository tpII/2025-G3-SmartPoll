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
import { QrCode, LogOut, CheckCircle, Loader } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { EventSourcePolyfill } from 'event-source-polyfill'

interface QRCodeDisplayProps {
  onReset: () => void
}

export function QRDisplay({
  onReset,
}: QRCodeDisplayProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [isScanned, setIsScanned] = useState(false)

  const onScanned = () => {
    // navigate('/success');
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    // SSE con query param
    const eventSource = new EventSourcePolyfill(
      `http://localhost:8080/api/qr`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    // @ts-expect-error TS2322
    eventSource.addEventListener("qrStatus", (event : MessageEvent) => {
      try {
        const data = JSON.parse(event.data)
        console.log('Mensaje SSE:', data)


        if (data.status== "waiting" && data.token && !qrCodeUrl) setQrCodeUrl(data.token)

        if (data.status === 'scanned') {
          setIsScanned(true)
          onScanned()
          eventSource.close()
        }

      } catch (err) {
        console.error('Error parseando SSE:', err)
      }
    })

    eventSource.onerror = (err) => {
      console.error('Error SSE', err)
      eventSource.close()
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
              {isScanned ? 'QR Code Scanned!' : 'Your Voting QR Code'}
            </CardTitle>
            <CardDescription className='text-muted-foreground'>
              {isScanned
                ? 'Verification successful. Redirecting...'
                : 'Present this QR code to the voting scanner'}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='flex justify-center'>
            <div
              className={`p-4 bg-white rounded-lg shadow-inner transition-all duration-500 ${
                isScanned ? 'ring-4 ring-green-500 ring-opacity-50' : ''
              }`}
            >
              {qrCodeUrl ? (
                <QRCodeSVG
                  value={qrCodeUrl}
                  className='w-64 h-64 text-muted-foreground'
                />
              ) : (
                <div className='w-64 h-64 flex items-center justify-center bg-gray-200 rounded'>
                  <Loader className='w-8 h-8 text-gray-500 animate-spin' />
                </div>
              )}
            </div>
          </div>

          <div className='text-center space-y-2'>
            <p className='text-xs text-muted-foreground'>
              Keep this screen visible until scanned
            </p>
          </div>

          <Button
            variant='outline'
            onClick={onReset}
            className='w-full bg-transparent'
            disabled={isScanned}
          >
            <LogOut className='w-4 h-4 mr-2' />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
