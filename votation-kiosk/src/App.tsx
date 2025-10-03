import { useState } from 'react'
import './App.css'
import VotingPage from './views/VotingPage'
import WaitingPage from './views/WaitingPage'

function App() {
  const [isEnable, setIsEnable] = useState(false)

  return (
    <>
      {isEnable ? (
        <VotingPage />
      ) : (
        <WaitingPage onEnable={() => setIsEnable(true)} />
      )}  
    </>
  )
}

export default App
