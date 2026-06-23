import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import GreetingCard from './pages/GreetingCard'
import PhDCard from './pages/PhDCard'
import TravelHome from './pages/TravelHome'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/bigliettino" element={<GreetingCard />} />
        <Route path="/dottorato" element={<PhDCard />} />
        <Route path="/viaggio" element={<TravelHome />} />
      </Routes>
    </Router>
  )
}

export default App