"use client"

import { Vote } from "lucide-react"

interface WaitingPageProps {
  onEnable: () => void
}

export default function WaitingPage({ onEnable }: WaitingPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-background p-4">
      <div className="text-center space-y-8 animate-fade-in">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
            <div className="relative bg-primary rounded-2xl p-6 shadow-2xl">
              <Vote className="w-16 h-16 text-primary-foreground" strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <div className="space-y-2">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">Smartpoll</h1>
          <p className="text-lg text-muted-foreground font-medium">Secure Digital Voting Platform</p>
        </div>

        {/* Status Message */}
        <div className="mt-12 space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <p className="text-muted-foreground text-sm uppercase tracking-wider font-medium">
              Waiting for voting to begin
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
