import { useState, useEffect } from 'react'
import { Home } from './pages/Home'
import { MobileOnly } from './components/MobileOnly'
import { Navbar } from './components/Navbar'

function App() {
  const [version, setVersion] = useState<'01' | '02'>('01')

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash
      if (hash === '#/02' || hash === '#02') {
        setVersion('02')
      } else {
        setVersion('01')
      }
    }

    // Check on mount
    checkHash()

    // Listen for hash changes
    window.addEventListener('hashchange', checkHash)
    return () => window.removeEventListener('hashchange', checkHash)
  }, [])

  return (
    <>
      <MobileOnly />
      <Home version={version} />
      <Navbar />
    </>
  )
}

export default App
