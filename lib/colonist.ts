import type { Biome } from "./biome"

export class Colonist {
  x: number
  y: number
  color: string
  skills: { gathering: number; building: number; farming: number }
  needs: { hunger: number; rest: number }
  currentTask: string | null
  targetX: number | null
  targetY: number | null
  moveSpeed: number
harvestCooldown: number
workDuration: number
existanceDuration: number

constructor(x: number, y: number) {
  this.x = x
  this.y = y
  this.color = "#4169E1"
  this.skills = {
    gathering: 1 + Math.random(),
    building: 1 + Math.random(),
    farming: 1 + Math.random(),
  }
  this.needs = {
    hunger: 100,
    rest: 100,
  }
  this.currentTask = null
  this.targetX = null
  this.targetY = null
  this.moveSpeed = 2 // Tiles per second
  this.harvestCooldown = 0
  this.workDuration = 0
  this.existanceDuration = 0
}

update(deltaTime: number, world: Biome[][], resources: { food: number; wood: number; stone: number }) {
  this.existanceDuration += deltaTime
  // Update needs - slow down the rate needs decrease
  this.needs.hunger -= deltaTime * 1 // Reduced from 2 to 1

    if (this.currentTask !== "Resting") {
      this.workDuration += deltaTime
    }

    if (this.needs.hunger <= 0 || this.workDuration > 20) {
      // Colonist is too hungry or tired to work
      this.currentTask = "Resting"
      this.needs.hunger = Math.min(this.needs.hunger + deltaTime * 5, 100) // Add hunger recovery
      this.needs.rest = Math.min(this.needs.rest + deltaTime * 10, 100)
      this.workDuration = 0
      return
    }

    // Decrease harvest cooldown
    if (this.harvestCooldown > 0) {
      this.harvestCooldown -= deltaTime
    }

    // Move towards target if we have one
    if (this.targetX !== null && this.targetY !== null) {
      const dx = this.targetX - this.x
      const dy = this.targetY - this.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 0.1) {
        // Reached target
        this.x = this.targetX
        this.y = this.targetY
        this.targetX = null
        this.targetY = null

        // Try to harvest resources
        if (
          this.harvestCooldown <= 0 &&
          this.x >= 0 &&
          this.x < world[0].length &&
          this.y >= 0 &&
          this.y < world.length
        ) {
          const tile = world[Math.floor(this.y)][Math.floor(this.x)]

          if (tile.resources.food > 0) {
            const harvested = tile.harvestResource("food", this.skills.gathering)
            resources.food += harvested
            this.currentTask = "Harvesting Food"
            this.harvestCooldown = 2
          } else if (tile.resources.wood > 0) {
            const harvested = tile.harvestResource("wood", this.skills.gathering)
            resources.wood += harvested
            this.currentTask = "Chopping Wood"
            this.harvestCooldown = 3
          } else if (tile.resources.stone > 0) {
            const harvested = tile.harvestResource("stone", this.skills.gathering)
            resources.stone += harvested
            this.currentTask = "Mining Stone"
            this.harvestCooldown = 4
          } else {
            // No resources on this tile, find a new target immediately
            this.findNewTarget(world)
          }
        }
      } else {
        // Move towards target
        const moveDistance = Math.min(distance, this.moveSpeed * deltaTime)
        const angle = Math.atan2(dy, dx)
        this.x += Math.cos(angle) * moveDistance
        this.y += Math.sin(angle) * moveDistance
        this.currentTask = "Moving"
      }
    } else {
      // Find a new target if we don't have one
      this.findNewTarget(world)
    }
  }

  findNewTarget(world: Biome[][]) {
    if (!world || world.length === 0 || world[0].length === 0) {
      return; // Safety check for valid world
    }

    // Simple AI: find the nearest resource
    let bestDistance = Number.POSITIVE_INFINITY
    let bestX = -1
    let bestY = -1

    const mapWidth = world[0].length
    const mapHeight = world.length

    const searchRadius = 15 // Increased search radius to find resources better
    const startX = Math.max(0, Math.floor(this.x) - searchRadius)
    const endX = Math.min(mapWidth - 1, Math.floor(this.x) + searchRadius)
    const startY = Math.max(0, Math.floor(this.y) - searchRadius)
    const endY = Math.min(mapHeight - 1, Math.floor(this.y) + searchRadius)

    let foundResource = false;

    for (let y = startY; y <= endY; y++) {
      for (let x = startX; x <= endX; x++) {
        const tile = world[y][x]

        // Check if this tile has any resources
        if (tile.resources.food > 0 || tile.resources.wood > 0 || tile.resources.stone > 0) {
          foundResource = true;
          const dx = x - this.x
          const dy = y - this.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < bestDistance) {
            bestDistance = distance
            bestX = x
            bestY = y
          }
        }
      }
    }

    if (bestX !== -1 && bestY !== -1) {
      this.targetX = bestX
      this.targetY = bestY
      this.currentTask = "Moving to Resource"
    } else {
      // No resources found, wander randomly but within map boundaries
      this.targetX = Math.floor(Math.random() * mapWidth)
      this.targetY = Math.floor(Math.random() * mapHeight)
      this.currentTask = "Exploring"
    }
  }
}
