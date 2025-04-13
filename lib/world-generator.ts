import { Biome } from "./biome"
import { createNoise2D } from "simplex-noise"

export function generateWorld(width: number, height: number): Biome[][] {
  const noise2D = createNoise2D()
  const world: Biome[][] = []

  for (let y = 0; y < height; y++) {
    const row: Biome[] = []

    for (let x = 0; x < width; x++) {
      // Generate terrain using simplex noise
      const nx = x / width - 0.5
      const ny = y / height - 0.5
      const elevation = noise2D(nx * 3, ny * 3)
      const moisture = noise2D(nx * 5, ny * 5)

      let biomeType: string
      let biomeColor: string
      const resources = { food: 0, wood: 0, stone: 0 }

      // Determine biome type based on elevation and moisture
      if (elevation < -0.3) {
        biomeType = "water"
        biomeColor = "#1E90FF"
      } else if (elevation < -0.1) {
        biomeType = "beach"
        biomeColor = "#F5DEB3"
        resources.food = Math.random() < 0.2 ? Math.floor(Math.random() * 3) + 1 : 0
      } else if (elevation < 0.3) {
        if (moisture < -0.3) {
          biomeType = "desert"
          biomeColor = "#F4A460"
          resources.stone = Math.random() < 0.3 ? Math.floor(Math.random() * 5) + 1 : 0
        } else if (moisture < 0.1) {
          biomeType = "plains"
          biomeColor = "#90EE90"
          resources.food = Math.random() < 0.4 ? Math.floor(Math.random() * 5) + 1 : 0
        } else {
          biomeType = "forest"
          biomeColor = "#228B22"
          resources.wood = Math.random() < 0.7 ? Math.floor(Math.random() * 8) + 3 : 0
          resources.food = Math.random() < 0.3 ? Math.floor(Math.random() * 3) + 1 : 0
        }
      } else {
        biomeType = "mountain"
        biomeColor = "#A9A9A9"
        resources.stone = Math.random() < 0.8 ? Math.floor(Math.random() * 10) + 5 : 0
      }

      row.push(new Biome(biomeType, biomeColor, resources))
    }

    world.push(row)
  }

  return world
}
