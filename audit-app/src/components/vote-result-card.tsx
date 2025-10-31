import { Card } from "@/components/ui/card"

interface Candidate {
  id: string
  name: string
  team: string
  image: string
  votes: number
  percentage: number
  color: string
}

interface VoteResultCardProps {
  candidate: Candidate
  rank: number
}

export function VoteResultCard({ candidate, rank }: VoteResultCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-6">
        {/* Rank Badge */}
        <div className="shrink-0 w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <span className="text-2xl font-bold text-slate-700 dark:text-slate-300">{rank}</span>
        </div>

        {/* Candidate Image */}
        <div className="shrink-0 w-16 h-16 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 relative">
          <img src={candidate.image} alt={candidate.name} fill className="size-full object-cover" />
        </div>

        {/* Candidate Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-1">{candidate.name}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">{candidate.team}</p>
        </div>

        {/* Vote Stats */}
        <div className="shrink-0 text-right">
          <div className="text-3xl font-bold mb-1" style={{ color: candidate.color }}>
            {candidate.percentage.toFixed(2)}%
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">{candidate.votes.toLocaleString()} votos</div>
        </div>
      </div>

      <div className="mt-4 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${candidate.percentage}%`,
            backgroundColor: candidate.color,
          }}
        />
      </div>
    </Card>
  )
}
