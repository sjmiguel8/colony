"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { GameEngine } from "@/lib/game-engine"
import GameUI from "@/components/game-ui"
import styles from "./page.module.css"
import "@/styles/game.css" // Import our new game styles

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
    if (typeof window !== 'undefined') {
      const initializeGame = () => {
        const canvas = canvasRef.current
        if (canvas) {
          const engine = new GameEngine(canvas.id)
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
          
          // Handle window resize
          const handleResize = () => {
            if (engine) {
              engine.resizeCanvas()
              engine.render()
            }
          }
          
          // Initial resize
          handleResize()
          
          // Add resize event listener
          window.addEventListener('resize', handleResize)

          return () => {
            clearInterval(statsInterval)
            window.removeEventListener('resize', handleResize)
            engine.stop()
          }
        }
      }

      if (document.getElementById("gameCanvas")) {
        initializeGame()
      } else {
        const observer = new MutationObserver(() => {
          if (document.getElementById("gameCanvas")) {
            initializeGame()
            observer.disconnect()
          }
        })

        observer.observe(document.body, {
          childList: true,
          subtree: true,
        })
      }
    }
  }, [gameStarted])

  const startGame = () => {
    setGameStarted(true)
  }

  return (
    <main className={styles.main}>
      {!gameStarted ? (
        <div className={styles.startScreen}>
          <h1 className={styles.title}>Colony Simulator</h1>
          <p className={styles.subtitle}>Build and manage your colony in a procedurally generated world</p>
          <Button onClick={startGame}>Start Game</Button>
        </div>
      ) : (
        <div className="game-container">
          <div className="game-ui-wrapper">
            <GameUI stats={gameStats} onAddColonist={function (): void {
                throw new Error("Function not implemented.")
              } } onBuildHouse={function (): void {
                throw new Error("Function not implemented.")
              } } onBuildFarm={function (): void {
                throw new Error("Function not implemented.")
              } } onBuildMine={function (): void {
                throw new Error("Function not implemented.")
              } } />
          </div>
          <canvas 
            ref={canvasRef} 
            className="game-canvas"
            id="gameCanvas"
          />
        </div>
      )}
    </main>
  )
}
