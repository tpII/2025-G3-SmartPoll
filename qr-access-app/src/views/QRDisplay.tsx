"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, LogOut, CheckCircle } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

interface QRCodeDisplayProps {
  userToken: string
  onScanned: () => void
  onReset: () => void
}

export function QRDisplay({ userToken, onScanned, onReset }: QRCodeDisplayProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [isScanned, setIsScanned] = useState(false)

  useEffect(() => {
    // Generate QR code URL using a free QR code API
    const qrData = `VOTE:${userToken}`
    setQrCodeUrl(qrData)

    // Simulate QR code being scanned after 5 seconds for demo
    const timer = setTimeout(() => {
      setIsScanned(true)
      setTimeout(() => {
        onScanned()
      }, 1500)
    }, 5000)

    return () => clearTimeout(timer)
  }, [userToken, onScanned])

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full">
              {isScanned ? (
                <CheckCircle className="w-8 h-8 text-primary-foreground" />
              ) : (
                <QrCode className="w-8 h-8 text-primary-foreground" />
              )}
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-balance">
              {isScanned ? "QR Code Scanned!" : "Your Voting QR Code"}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isScanned ? "Verification successful. Redirecting..." : "Present this QR code to the voting scanner"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <div
              className={`p-4 bg-white rounded-lg shadow-inner transition-all duration-500 ${
                isScanned ? "ring-4 ring-green-500 ring-opacity-50" : ""
              }`}
            >
              {qrCodeUrl && (
                <QRCodeSVG value={qrCodeUrl} className="w-64 h-64 text-muted-foreground" />
              )}
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Token: <span className="font-mono text-xs">{userToken.slice(-8)}</span>
            </p>
            <p className="text-xs text-muted-foreground">Keep this screen visible until scanned</p>
          </div>

          <Button variant="outline" onClick={onReset} className="w-full bg-transparent" disabled={isScanned}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
