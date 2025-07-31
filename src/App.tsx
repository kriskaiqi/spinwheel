import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import WheelContainer from './components/WheelContainer'
import ProtectedRoute from './components/ProtectedRoute'
import SignIn from './pages/SignIn'
import MyWheels from './pages/MyWheels'
import './App.css'

function App() {
  const [entries, setEntries] = useState<string[]>([
    'Pizza', 'Burger', 'Sushi', 'Tacos', 'Pasta',
    'Salad', 'Steak', 'Chicken'
  ]);
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/mywheels" element={
        <ProtectedRoute>
          <MyWheels onLoadWheel={(wheelEntries) => {
            setEntries(wheelEntries);
            navigate('/');
          }} />
        </ProtectedRoute>
      } />
      <Route path="/" element={
        <ProtectedRoute>
          <WheelContainer entries={entries} onEntriesChange={setEntries} />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App
