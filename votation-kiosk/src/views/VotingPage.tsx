'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Vote, Check } from 'lucide-react'
import { toast } from 'sonner'
import CandidateCard from '@/components/CandidateCard'

interface Candidate {
  id: string
  name: string
  team: string
  image: string
}

interface Tav {
  tav: string
}

interface VotingPageProps {
  tav: Tav | null
  onEnable: () => void
}

const candidates: Candidate[] = [
  {
    id: '1',
    name: 'Juan Schiaretti',
    team: 'Partido justicialista',
    image: '/candidates/juan_schiaretti.jpg',
  },
  {
    id: '2',
    name: 'Horacio Rodríguez Larreta',
    team: 'Propuesta republicana',
    image: '/candidates/horacio_rodriguez_larreta.jpg',
  },
  {
    id: '3',
    name: 'Javier Milei',
    team: 'La libertad avanza',
    image: '/candidates/javier_milei.jpg',
  },
  {
    id: '4',
    name: 'Sergio Massa',
    team: 'Unión por la Patria',
    image: '/candidates/sergio_massa.jpg',
  },
  {
    id: '5',
    name: 'Margarita Stolbizer',
    team: 'Movimiento Libres del Sur',
    image: '/candidates/margarita_stolbizer.jpg',
  },
  {
    id: '6',
    name: 'Patricia Bullrich',
    team: 'Juntos por el Cambio',
    image: '/candidates/patricia_bullrich.jpg',
  },
]

export default function VotingPage({ tav, onEnable }: VotingPageProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(
    null
  )
  const [hasVoted, setHasVoted] = useState(false)

  const handleVote = async () => {
    if (!selectedCandidate) return

    setHasVoted(true)
    const candidate = candidates.find((c) => c.id === selectedCandidate)

    const votePayload = {
      candidateId: candidate?.id,
      candidateName: candidate?.name,
      tav: tav?.tav,
      timestamp: new Date().toISOString(),
    }

    try {
      const response = await fetch('http://localhost:8080/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(votePayload),
      })

      const data = await response.json()

      console.log('Vote response:', data)
      if (!data.ok) {
        toast.error('Voto anulado por el servidor')
      } else {
        toast.success('Voto emitido con éxito')
      }
    } catch (error) {
      console.error('Error submitting vote:', error)
      toast.error('Error al enviar el voto')
      return
    }

    setTimeout(() => {
      onEnable()
      setHasVoted(false)
      setSelectedCandidate(null)
    }, 5000)
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background'>
      {/* Header */}
      <header className='border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10'>
        <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <img
              src='/smartpoll.svg'
              alt='Smartpoll Logo'
              width={48}
              height={48}
            />
            <div>
              <h1 className='text-xl font-bold text-foreground'>Smartpoll</h1>
              <p className='text-xs text-muted-foreground'>Elecciones 2025</p>
            </div>
          </div>
          {hasVoted && (
            <div className='flex items-center gap-2 text-sm text-accent font-medium'>
              <Check className='w-4 h-4' />
              <span>Voto emitido</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className='container mx-auto px-4 py-8 md:py-12 max-w-4xl'>
        <div className='space-y-6'>
          {/* Instructions */}
          <div className='text-center space-y-2 mb-8'>
            <h2 className='text-3xl md:text-4xl font-bold text-foreground text-balance'>
              Emite tu voto
            </h2>
            <p className='text-muted-foreground text-balance'>
              Seleccione un candidato a continuación para enviar su voto
            </p>
          </div>

          {/* Candidates Grid */}
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5'>
            {candidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                selectedCandidate={selectedCandidate}
                hasVoted={hasVoted}
                setSelectedCandidate={setSelectedCandidate}
              />
            ))}
          </div>

          {/* Submit Button */}
          <div className='sticky bottom-2 pt-6 flex justify-center'>
            <Button
              size='lg'
              onClick={handleVote}
              disabled={!selectedCandidate || hasVoted}
              className='w-full md:w-auto min-w-[200px] text-base font-semibold'
            >
              {hasVoted ? (
                <>
                  <Check className='w-5 h-5 mr-2' />
                  Voto emitido
                </>
              ) : (
                <>
                  <Vote className='w-5 h-5 mr-2' />
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
