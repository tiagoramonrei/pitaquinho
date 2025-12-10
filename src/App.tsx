import { Home } from './pages/Home'
import { MobileOnly } from './components/MobileOnly'
import { Navbar } from './components/Navbar'

function App() {
  return (
    <>
      <MobileOnly />
      <Home />
      <Navbar />
    </>
  )
}

export default App
