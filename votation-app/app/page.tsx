'use client'
import { useState } from 'react'
import VotingPage from '@/components/voting-page'
import WaitingPage from '@/components/waiting-page'

export default function Home() {
  const [isVotingEnabled, setIsVotingEnabled] = useState(false)
  return (
    <div className='min-h-screen'>
      {isVotingEnabled ? (
        <VotingPage />
      ) : (
        <WaitingPage onEnable={() => setIsVotingEnabled(true)} />
      )}
    </div>
  )
}
