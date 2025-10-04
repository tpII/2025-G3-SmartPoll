import { useEffect, useState } from 'react'
import './App.css'
import VotingPage from './views/VotingPage'
import WaitingPage from './views/WaitingPage'

interface Tav {
  tav: string
}

function App() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [tav, setTav] = useState<Tav | null>(null)

  useEffect(() => {
    const event = new EventSource('http://localhost:8080/events')

    event.onmessage = (message) => {
      const data = JSON.parse(message.data)
      if (data.enabled == true) {
        setIsEnabled(true)
        setTav({ tav: data.tav })
      }
    }

    return () => {
      event.close()
    }
  }, [])

  return (
    <>
      {isEnabled ? (
        <VotingPage tav={tav} onEnable={() => setIsEnabled(false)} />
      ) : (
        <WaitingPage/>
      )}
    </>
  )
}

export default App
