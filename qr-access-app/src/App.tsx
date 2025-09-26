import { Routes, Route } from 'react-router-dom'
import './App.css'
import { useAuth } from './hooks/useAuth'
import { Login, QRDisplay } from './views'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const { logued, loading } : { logued: boolean; loading: boolean } = useAuth()
  return (
    <>
      <Routes>
        <Route element={<ProtectedRoute allowed={!logued} loading={loading} />}>
          <Route path='/login' element={<Login onLogin={() => console.log('Login')} />} />
        </Route>
        <Route element={<ProtectedRoute allowed={logued} loading={loading} redirectPath='/login' />}>
          <Route
            path='/'
            element={
              <QRDisplay
                onReset={() => console.log('Reset')}
              />
            }
          />
        </Route>
      </Routes>
    </>
  )
}

export default App
