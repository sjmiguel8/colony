"use client"

import { useEffect, useRef, useState } from "react"
import GameUI from "@/components/game-ui"
import { GameEngine } from "@/lib/game-engine"
import { Button } from "@/components/ui/button"

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameEngine, setGameEngine] = useState<GameEngine | null>(null)
  const [gameStats, setGameStats] = useState({
    colonists: 0,
    food: 0,
    wood: 0,
    stone: 0,
    buildings: 0,
  })

  useEffect(() => {
    if (gameStarted && canvasRef.current) {
      const canvas = canvasRef.current
      const engine = new GameEngine(canvas)
      setGameEngine(engine)

      const updateStats = () => {
        setGameStats({
          colonists: engine.colonists.length,
          food: engine.resources.food,
          wood: engine.resources.wood,
          stone: engine.resources.stone,
          buildings: engine.buildings.length,
        })
      }

      // Update stats every second
      const statsInterval = setInterval(updateStats, 1000)

      return () => {
        clearInterval(statsInterval)
        engine.stop()
      }
    }
  }, [gameStarted])

  const startGame = () => {
    setGameStarted(true)
  }

  const handleAddColonist = () => {
    if (gameEngine) {
      gameEngine.addColonist()
    }
  }

  const handleBuildHouse = () => {
    if (gameEngine) {
      gameEngine.buildStructure("house")
    }
  }

  const handleBuildFarm = () => {
    if (gameEngine) {
      gameEngine.buildStructure("farm")
    }
  }

  const handleBuildMine = () => {
    if (gameEngine) {
      gameEngine.buildStructure("mine")
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
      {!gameStarted ? (
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <h1 className="text-4xl font-bold text-amber-500">New Haven Colony</h1>
          <p className="max-w-md text-gray-300">
            Guide your pioneers as they establish a thriving colony on an untamed planet. Gather resources, build
            structures, and ensure the survival of your settlers.
          </p>
          <Button onClick={startGame} className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg">
            Start New Colony
          </Button>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col">
          <GameUI
            stats={gameStats}
            onAddColonist={handleAddColonist}
            onBuildHouse={handleBuildHouse}
            onBuildFarm={handleBuildFarm}
            onBuildMine={handleBuildMine}
          />
          <div className="relative w-full h-[calc(100vh-120px)] border-2 border-amber-800 overflow-hidden">
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
          </div>
        </div>
      )}
    </main>
  )
}
