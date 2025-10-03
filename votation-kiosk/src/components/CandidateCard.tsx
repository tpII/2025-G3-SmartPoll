'use client'
import { Card } from './ui/card'

interface Candidate {
  id: string
  name: string
  team: string
  image: string
}

interface CandidateCardProps {
  candidate: Candidate
  selectedCandidate: string | null
  hasVoted: boolean
  setSelectedCandidate: (id: string) => void
}

const CandidateCard = ({
  candidate,
  selectedCandidate,
  hasVoted,
  setSelectedCandidate,
}: CandidateCardProps) => {
  return (
    <Card
      key={candidate.id}
      className={`p-5 md:p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
        selectedCandidate === candidate.id
          ? 'ring-2 ring-primary bg-primary/5 border-primary'
          : 'hover:border-primary/50'
      } ${hasVoted ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={() => !hasVoted && setSelectedCandidate(candidate.id)}
    >
      <div className='flex items-center justify-between gap-4 flex-col'>
          <div className='flex-shrink-0'>
            <img
              src={candidate.image || '/placeholder.svg'}
              alt={candidate.name}
              width={400}
              height={400}
            />
          </div>
        <div className='flex items-center gap-4 flex-1 min-w-0 flex-col'>
          {/* Candidate Photo */}


          {/* Candidate Info */}
          <div className='flex-1 min-w-0'>
            <h3 className='text-lg md:text-xl font-semibold text-foreground truncate'>
              {candidate.name}
            </h3>
            <p className='text-sm text-muted-foreground truncate'>
              {candidate.team}
            </p>
          </div>
        </div>

      </div>
    </Card>
  )
}

export default CandidateCard
