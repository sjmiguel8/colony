export interface BiomeResources {
  food: number
  wood: number
  stone: number
}

export class Biome {
  type: string
  color: string
  resources: BiomeResources

  constructor(type: string, color: string, resources: BiomeResources) {
    this.type = type
    this.color = color
    this.resources = resources
  }

  harvestResource(resource: keyof BiomeResources, amount: number): number {
    const available = Math.min(this.resources[resource], amount)
    this.resources[resource] -= available
    return available
  }
}
