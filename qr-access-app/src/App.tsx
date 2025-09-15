import './App.css'
import { Login } from './views/Login'

function App() {
  return (
    <>
      <Login onLogin={(token) => console.log('Logged in with token:', token)} />
    </>
  )
}

export default App
