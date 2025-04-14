"use client"

import { useEffect, useRef, useState } from "react"
import GameUI from "@/components/game-ui"
import { GameEngine } from "@/lib/game-engine"
import { Button } from "@/components/ui/button"
import styles from "./page.module.css"

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

      // Initial stats update
      updateStats()
      
      // Update stats every second
      const statsInterval = setInterval(updateStats, 1000)

      // Start game rendering
      engine.start()

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
      const colonist = gameEngine.addColonist();
      
      // Force an immediate stats update
      setGameStats((prevStats) => ({
        ...prevStats,
        colonists: gameEngine.colonists.length,
      }))
      
      // Log to verify colonist was added
      console.log("Colonist added:", colonist);
      console.log("Total colonists:", gameEngine.colonists.length);
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
    <main className={`${styles.main}`}>
      {!gameStarted ? (
        <div className={`${styles.startScreen}`}>
          <h1 className={`${styles.title}`}>New Haven Colony</h1>
          <p className={`${styles.subtitle}`}>
            Build and manage your colony to survive and thrive.
          </p>
          <Button onClick={startGame}>Start Game</Button>
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
