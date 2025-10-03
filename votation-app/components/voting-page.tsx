"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Vote, Check } from "lucide-react"
import { toast } from "sonner"
import CandidateCard from "./CandidateCard"

interface Candidate {
  id: string
  name: string
  team: string
  image: string
}

const candidates: Candidate[] = [
  { id: "1", name: "Sarah Johnson", team: "Innovation Team", image: "/man.jpg" },
  { id: "2", name: "Michael Chen", team: "Development Team", image: "/man.jpg" },
  { id: "3", name: "Emily Rodriguez", team: "Design Team", image: "/man.jpg" },
  { id: "4", name: "David Kim", team: "Product Team", image: "/man.jpg" },
  { id: "5", name: "Jessica Williams", team: "Marketing Team", image: "/man.jpg" },
  { id: "6", name: "Robert Taylor", team: "Operations Team", image: "/man.jpg" },
]

export default function VotingPage() {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false)

  const handleVote = () => {
    if (!selectedCandidate) return

    setHasVoted(true)
    const candidate = candidates.find((c) => c.id === selectedCandidate)

    toast({
      title: "Voto emitido con éxito",
      description: `Has votado por ${candidate?.name} del partido ${candidate?.team}`,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary rounded-lg p-2">
              <Vote className="w-6 h-6 text-primary-foreground" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Smartpoll</h1>
              <p className="text-xs text-muted-foreground">Elecciones 2025</p>
            </div>
          </div>
          {hasVoted && (
            <div className="flex items-center gap-2 text-sm text-accent font-medium">
              <Check className="w-4 h-4" />
              <span>Voto emitido</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="space-y-6">
          {/* Instructions */}
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">Emite tu voto</h2>
            <p className="text-muted-foreground text-balance">Seleccione un candidato a continuación para enviar su voto</p>
          </div>

          {/* Candidates Grid */}
          <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
            {candidates.map((candidate) => (
              <CandidateCard key={candidate.id} candidate={candidate} selectedCandidate={selectedCandidate} hasVoted={hasVoted} setSelectedCandidate={setSelectedCandidate} />
            ))}
          </div>

          {/* Submit Button */}
          <div className="pt-6 flex justify-center">
            <Button
              size="lg"
              onClick={handleVote}
              disabled={!selectedCandidate || hasVoted}
              className="w-full md:w-auto min-w-[200px] text-base font-semibold"
            >
              {hasVoted ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Voto emitido
                </>
              ) : (
                <>
                  <Vote className="w-5 h-5 mr-2" />
                  Emitir voto
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
