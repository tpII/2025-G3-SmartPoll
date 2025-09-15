import './App.css'
import { Login } from './views/Login'
import { QRDisplay } from './views/QRDisplay'

function App() {
  return (
    <>
    <QRDisplay userToken="sample-token" onScanned={() => console.log('QR Code scanned')} onReset={() => console.log('Reset')} />
    </>
  )
}

export default App
