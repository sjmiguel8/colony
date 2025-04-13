"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Wheat, TreesIcon as Tree, Mountain, Home, Building } from "lucide-react"
import styles from "./game-ui.module.css"

interface GameUIProps {
  stats: {
    colonists: number
    food: number
    wood: number
    stone: number
    buildings: number
  }
  onAddColonist: () => void
  onBuildHouse: () => void
  onBuildFarm: () => void
  onBuildMine: () => void
}

export default function GameUI({ stats, onAddColonist, onBuildHouse, onBuildFarm, onBuildMine }: GameUIProps) {
  return (
    <div className={styles.gameUIContainer}>
      <div className={styles.gameUIContent}>
        <div className="flex space-x-4">
          <div className={`${styles.statItem} flex items-center space-x-1`}>
            <Users size={18} className="text-blue-400" />
            <span>{stats.colonists}</span>
          </div>
          <div className={`${styles.statItem} flex items-center space-x-1`}>
            <Wheat size={18} className="text-yellow-400" />
            <span>{stats.food > 9999 ? '9999+' : stats.food.toFixed(stats.food < 10 ? 2 : stats.food < 100 ? 1 : 0)}</span>
          </div>
          <div className={`${styles.statItem} flex items-center space-x-1`}>
            <Tree size={18} className="text-green-600" />
            <span>{stats.wood > 9999 ? '9999+' : stats.wood.toFixed(stats.wood < 10 ? 2 : stats.wood < 100 ? 1 : 0)}</span>
          </div>
          <div className={`${styles.statItem} flex items-center space-x-1`}>
            <Mountain size={18} className="text-gray-400" />
            <span>{stats.stone > 9999 ? '9999+' : stats.stone.toFixed(stats.stone < 10 ? 2 : stats.stone < 100 ? 1 : 0)}</span>
          </div>
          <div className={`${styles.statItem} flex items-center space-x-1`}>
            <Building size={18} className="text-amber-400" />
            <span>{stats.buildings > 9999 ? '9999+' : stats.buildings.toFixed(stats.buildings < 10 ? 2 : stats.buildings < 100 ? 1 : 0)}</span>
          </div>
        </div>

        <Tabs defaultValue="build" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="build">Build</TabsTrigger>
            <TabsTrigger value="colonists">Colonists</TabsTrigger>
            <TabsTrigger value="research">Research</TabsTrigger>
          </TabsList>
          <TabsContent value="build" className="bg-gray-700 p-2 rounded text-gray-900">
            <div className="flex flex-wrap space-x-2 justify-evenly">
              <Button
                onClick={onBuildHouse}
                variant="outline"
                className="flex items-center space-x-1 mb-2 max-w-[150px]"
                disabled={stats.wood < 20}
              >
                <Home size={16} />
                <span>House (20 Wood)</span>
              </Button>
              <Button
                onClick={onBuildFarm}
                variant="outline"
                className="flex items-center space-x-1 mb-2 max-w-[150px]"
                disabled={stats.wood < 15}
              >
                <Wheat size={16} />
                <span>Farm (15 Wood)</span>
              </Button>
              <Button
                onClick={onBuildMine}
                variant="outline"
                className="flex items-center space-x-1 mb-2 max-w-[150px]"
                disabled={stats.wood < 25}
              >
                <Mountain size={16} />
                <span>Mine (25 Wood)</span>
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="colonists" className="bg-gray-700 p-2 rounded text-gray-900">
            <div className="flex flex-col space-y-2">
              <Button
                onClick={onAddColonist}
                variant="outline"
                className="flex items-center space-x-1"
                disabled={stats.food < 10}
              >
                <Users size={16} />
                <span>Add Colonist (10 Food)</span>
              </Button>
              <div className="text-xs text-gray-300">
                Colonists will automatically gather resources from the environment.
              </div>
            </div>
          </TabsContent>
          <TabsContent value="research" className="bg-gray-700 p-2 rounded text-gray-900">
            <div className="text-sm text-center text-gray-300">Research will be available in future updates.</div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
