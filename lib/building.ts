export class Building {
  x: number
  y: number
  type: string
  icon: string
  color: string
  productionTimer: number
  productionInterval: number

  constructor(x: number, y: number, type: string, icon: string, color: string) {
    this.x = x
    this.y = y
    this.type = type
    this.icon = icon
    this.color = color
    this.productionTimer = 0

    // Set production interval based on building type
    switch (type) {
      case "farm":
        this.productionInterval = 10 // Produce food every 10 seconds
        break
      case "mine":
        this.productionInterval = 15 // Produce stone every 15 seconds
        break
      default:
        this.productionInterval = 0 // No production
    }
  }

  update(deltaTime: number, resources: { food: number; wood: number; stone: number }) {
    if (this.productionInterval > 0) {
      this.productionTimer += deltaTime

      if (this.productionTimer >= this.productionInterval) {
        this.productionTimer = 0

        // Produce resources based on building type
        switch (this.type) {
          case "farm":
            resources.food += 5
            break
          case "mine":
            resources.stone += 3
            break
        }
      }
    }
  }
}
