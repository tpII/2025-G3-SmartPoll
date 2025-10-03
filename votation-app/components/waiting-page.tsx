"use client"

import { Vote } from "lucide-react"
import Image from "next/image"

interface WaitingPageProps {
  onEnable: () => void
}

export default function WaitingPage({ onEnable }: WaitingPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-background p-4 m-auto">
      <div className="text-center space-y-8 animate-fade-in">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="relative">
            <Image
              src="/smartpoll_title.svg"
              alt="Smartpoll Logo"
              width={256}
              height={256}
              className="mx-auto"
            />
          </div>
        </div>

        {/* Status Message */}
        <div className="mt-12 space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <p className="text-muted-foreground text-sm uppercase tracking-wider font-medium">
              Esperando para comenzar la votación
            </p>
          </div>

          {/* Demo button - remove in production */}
          <button
            onClick={onEnable}
            className="mt-8 px-6 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg"
          >
            Start Voting (Demo)
          </button>
        </div>
      </div>
    </div>
  )
}
