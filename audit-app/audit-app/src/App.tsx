"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { VoteResultCard } from "@/components/vote-result-card"
import { VotePieChart } from "@/components/vote-pie-chart"
import { Navbar } from "@/components/navbar"

interface Candidate {
  id: string
  name: string
  team: string
  image: string
  color: string
}

interface VoteResults {
  electionId: number
  results: Record<string, number>
}

export default function App() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [voteResults, setVoteResults] = useState<VoteResults | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch candidates data
        const candidatesRes = await fetch("/candidates.json")
        const candidatesData = await candidatesRes.json()
        setCandidates(candidatesData)

        // Fetch vote results
        const votesRes = await fetch("/votes.json")
        const votesData = await votesRes.json()
        setVoteResults(votesData)
      } catch (error) {
        console.error("[v0] Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-2xl text-muted-foreground">Cargando resultados...</div>
      </div>
    )
  }

  if (!voteResults || candidates.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-2xl text-muted-foreground">No hay datos disponibles</div>
      </div>
    )
  }

  // Calculate total votes
  const totalVotes = Object.values(voteResults.results).reduce((sum, votes) => sum + votes, 0)

  // Merge candidates with their vote counts
  const candidatesWithVotes = candidates.map((candidate) => ({
    ...candidate,
    votes: voteResults.results[candidate.id] || 0,
    percentage: totalVotes > 0 ? ((voteResults.results[candidate.id] || 0) / totalVotes) * 100 : 0,
  }))

  // Sort by votes descending
  candidatesWithVotes.sort((a, b) => b.votes - a.votes)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Total Voters Card */}
        <Card className="mb-8 md:mb-12 p-8 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 border-0 shadow-xl">
          <div className="text-center">
            <p className="text-blue-100 text-lg mb-2 font-medium">Total de Votantes</p>
            <p className="text-6xl md:text-7xl font-bold text-white">{totalVotes.toLocaleString()}</p>
          </div>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Candidate Results List - Left Side */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-6">Resultados por Candidato</h2>
            {candidatesWithVotes.map((candidate, index) => (
              <VoteResultCard key={candidate.id} candidate={candidate} rank={index + 1} />
            ))}
          </div>

          {/* Pie Chart - Right Side */}
          <div className="lg:sticky lg:top-8">
            <Card className="p-6 shadow-lg">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-6">Distribución de Votos</h2>
              <VotePieChart data={candidatesWithVotes} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
