import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import GreetingCard from './pages/GreetingCard'
import PhDCard from './pages/PhDCard'
import TravelHome from './pages/TravelHome'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TravelHome />} />
        <Route path="/bigliettino" element={<GreetingCard />} />
        <Route path="/dottorato" element={<PhDCard />} />
      </Routes>
    </Router>
  )
}

export default App