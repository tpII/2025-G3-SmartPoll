import { useEffect, useState } from 'react'
import './App.css'
import VotingPage from './views/VotingPage'
import WaitingPage from './views/WaitingPage'

function App() {
  const [isEnable, setIsEnable] = useState(false)

  useEffect(() => {
    const event = new EventSource('http://localhost:8080/events')

    event.onmessage = (message) => {
      const data = JSON.parse(message.data)
      console.log('Received event:', data)
      if (data.type === 'voting_enabled') {
        setIsEnable(true)
      }
    }

    return () => {
      event.close()
    }
  }, [])

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
