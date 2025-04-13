import type { Biome } from "./biome"
import { Colonist } from "./colonist"
import { Building } from "./building"
import { generateWorld } from "./world-generator"

export class GameEngine {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  world: Biome[][]
  colonists: Colonist[]
  buildings: Building[]
  resources: { food: number; wood: number; stone: number }
  tileSize: number
  animationFrameId: number
  lastTimestamp: number
  selectedTile: { x: number; y: number } | null

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")!
    this.resizeCanvas()

    // Initialize game state
    this.tileSize = 32
    this.world = generateWorld(50, 50)
    this.colonists = []
    this.buildings = []
    this.resources = { food: 50, wood: 50, stone: 20 }
    this.selectedTile = null

    // Add initial colonists
    this.addColonist()
    this.addColonist()

    // Start game loop
    this.lastTimestamp = 0
    this.animationFrameId = 0
    this.start()

    // Add event listeners
    this.setupEventListeners()
  }

  resizeCanvas() {
    this.canvas.width = this.canvas.clientWidth
    this.canvas.height = this.canvas.clientHeight
  }

  setupEventListeners() {
    this.canvas.addEventListener("click", (e) => {
      const rect = this.canvas.getBoundingClientRect()
      const x = Math.floor((e.clientX - rect.left) / this.tileSize)
      const y = Math.floor((e.clientY - rect.top) / this.tileSize)

      if (x >= 0 && x < this.world[0].length && y >= 0 && y < this.world.length) {
        this.selectedTile = { x, y }
      }
    })

    window.addEventListener("resize", () => {
      this.resizeCanvas()
    })
  }

  start() {
    this.gameLoop(0)
  }

  stop() {
    cancelAnimationFrame(this.animationFrameId)
  }

  gameLoop(timestamp: number) {
    const deltaTime = (timestamp - this.lastTimestamp) / 1000
    this.lastTimestamp = timestamp

    this.update(deltaTime)
    this.render()

    this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this))
  }

  update(deltaTime: number) {
    // Update colonists
    this.colonists.forEach((colonist) => {
      colonist.update(deltaTime, this.world, this.resources)
    })

    // Update buildings
    this.buildings.forEach((building) => {
      building.update(deltaTime, this.resources)
    })
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // Render world
    for (let y = 0; y < this.world.length; y++) {
      for (let x = 0; x < this.world[y].length; x++) {
        const biome = this.world[y][x]
        this.ctx.fillStyle = biome.color
        this.ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize)

        // Draw resource indicators
        if (biome.resources.wood > 0) {
          this.ctx.fillStyle = "#3E8914"
          this.ctx.fillRect(
            x * this.tileSize + this.tileSize * 0.25,
            y * this.tileSize + this.tileSize * 0.25,
            this.tileSize * 0.5,
            this.tileSize * 0.5,
          )
        }

        if (biome.resources.stone > 0) {
          this.ctx.fillStyle = "#888888"
          this.ctx.beginPath()
          this.ctx.arc(
            x * this.tileSize + this.tileSize * 0.5,
            y * this.tileSize + this.tileSize * 0.5,
            this.tileSize * 0.25,
            0,
            Math.PI * 2,
          )
          this.ctx.fill()
        }

        if (biome.resources.food > 0) {
          this.ctx.fillStyle = "#FFD700"
          this.ctx.beginPath()
          this.ctx.arc(
            x * this.tileSize + this.tileSize * 0.5,
            y * this.tileSize + this.tileSize * 0.5,
            this.tileSize * 0.15,
            0,
            Math.PI * 2,
          )
          this.ctx.fill()
        }
      }
    }

    // Render buildings
    this.buildings.forEach((building) => {
      this.ctx.fillStyle = building.color
      this.ctx.fillRect(building.x * this.tileSize, building.y * this.tileSize, this.tileSize, this.tileSize)

      // Draw building icon
      this.ctx.fillStyle = "#FFFFFF"
      this.ctx.font = "16px Arial"
      this.ctx.fillText(
        building.icon,
        building.x * this.tileSize + this.tileSize * 0.3,
        building.y * this.tileSize + this.tileSize * 0.7,
      )
    })

    // Render colonists
    this.colonists.forEach((colonist) => {
      this.ctx.fillStyle = colonist.color
      this.ctx.beginPath()
      this.ctx.arc(
        colonist.x * this.tileSize + this.tileSize * 0.5,
        colonist.y * this.tileSize + this.tileSize * 0.5,
        this.tileSize * 0.4,
        0,
        Math.PI * 2,
      )
      this.ctx.fill()

      // Draw colonist status
      if (colonist.currentTask) {
        this.ctx.fillStyle = "#FFFFFF"
        this.ctx.font = "10px Arial"
        this.ctx.fillText(colonist.currentTask, colonist.x * this.tileSize, colonist.y * this.tileSize - 5)
      }
    })

    // Render selected tile
    if (this.selectedTile) {
      this.ctx.strokeStyle = "#FFFFFF"
      this.ctx.lineWidth = 2
      this.ctx.strokeRect(
        this.selectedTile.x * this.tileSize,
        this.selectedTile.y * this.tileSize,
        this.tileSize,
        this.tileSize,
      )
    }
  }

  addColonist() {
    if (this.resources.food >= 10) {
      this.resources.food -= 10

      // Find a valid spawn position
      const centerX = Math.floor(this.world[0].length / 2)
      const centerY = Math.floor(this.world.length / 2)

      const colonist = new Colonist(centerX, centerY)
      this.colonists.push(colonist)
      return true
    }
    return false
  }

  buildStructure(type: string) {
    if (!this.selectedTile) return false

    const { x, y } = this.selectedTile

    // Check if tile is already occupied
    const isOccupied = this.buildings.some((b) => b.x === x && b.y === y)
    if (isOccupied) return false

    const cost = 0
    let building: Building | null = null

    switch (type) {
      case "house":
        if (this.resources.wood >= 20) {
          this.resources.wood -= 20
          building = new Building(x, y, "house", "🏠", "#8B4513")
        }
        break
      case "farm":
        if (this.resources.wood >= 15) {
          this.resources.wood -= 15
          building = new Building(x, y, "farm", "🌾", "#8B8000")
        }
        break
      case "mine":
        if (this.resources.wood >= 25) {
          this.resources.wood -= 25
          building = new Building(x, y, "mine", "⛏️", "#708090")
        }
        break
    }

    if (building) {
      this.buildings.push(building)
      return true
    }

    return false
  }
}
