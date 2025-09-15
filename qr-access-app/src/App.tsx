import './App.css'
import { QRDisplay } from './views/QRDisplay'

function App() {
  return (
    <>
    <QRDisplay userToken="sample-token" onScanned={() => console.log('QR Code scanned')} onReset={() => console.log('Reset')} />
    </>
  )
}

export default App
