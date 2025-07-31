import { useState } from 'react'
import WheelCanvas from './components/WheelCanvas'
import './App.css'

function App() {
  const [winner, setWinner] = useState<string | null>(null)
  const [spinHistory, setSpinHistory] = useState<string[]>([])

  const wheelEntries = [
    'Pizza', 'Burger', 'Sushi', 'Tacos', 'Pasta', 
    'Salad', 'Steak', 'Chicken'
  ]

  const handleSpinComplete = (winnerEntry: string) => {
    setWinner(winnerEntry)
    setSpinHistory(prev => [winnerEntry, ...prev.slice(0, 4)]) // Keep last 5 results
  }

  const resetWinner = () => {
    setWinner(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Spin the Wheel!</h1>
        <p className="text-gray-300">Click the spin button to pick a random option</p>
      </div>

      <div className="mb-8">
        <WheelCanvas 
          entries={wheelEntries}
          size={400}
          onSpinComplete={handleSpinComplete}
        />
      </div>

      {winner && (
        <div className="bg-white rounded-lg p-6 shadow-xl text-center mb-6 max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">🎉 Winner! 🎉</h2>
          <p className="text-xl text-blue-600 font-semibold mb-4">{winner}</p>
          <button 
            onClick={resetWinner}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Clear Result
          </button>
        </div>
      )}

      {spinHistory.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white max-w-md">
          <h3 className="text-lg font-semibold mb-2">Recent Results:</h3>
          <ul className="space-y-1">
            {spinHistory.map((result, index) => (
              <li key={index} className="text-sm opacity-80">
                {index + 1}. {result}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default App
