"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GameBoard } from "@/components/game-board"
import { Ship, RotateCw } from "lucide-react"

interface ShipPlacementProps {
  ships: {
    [key: string]: {
      size: number
      placed: boolean
    }
  }
  onComplete: (board: number[][]) => void
}

export function ShipPlacement({ ships, onComplete }: ShipPlacementProps) {
  const [board, setBoard] = useState<number[][]>(
    Array(10)
      .fill(0)
      .map(() => Array(10).fill(0)),
  )
  const [selectedShip, setSelectedShip] = useState<string | null>("carrier")
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">("horizontal")
  const [placedShips, setPlacedShips] = useState<{
    [key: string]: { x: number; y: number; orientation: "horizontal" | "vertical" }
  }>({})

  const shipNames: { [key: string]: string } = {
    carrier: "Aircraft Carrier (5)",
    battleship: "Battleship (4)",
    cruiser: "Cruiser (3)",
    submarine: "Submarine (3)",
    destroyer: "Destroyer (2)",
  }

  const toggleOrientation = () => {
    setOrientation(orientation === "horizontal" ? "vertical" : "horizontal")
  }

  const canPlaceShip = (x: number, y: number, size: number, orientation: "horizontal" | "vertical") => {
    // Check if ship would go out of bounds
    if (orientation === "horizontal" && x + size > 10) return false
    if (orientation === "vertical" && y + size > 10) return false

    // Check if ship would overlap with another ship
    for (let i = 0; i < size; i++) {
      const checkX = orientation === "horizontal" ? x + i : x
      const checkY = orientation === "vertical" ? y + i : y
      if (board[checkY][checkX] !== 0) return false
    }

    return true
  }

  const placeShip = (x: number, y: number) => {
    if (!selectedShip) return

    const shipSize = ships[selectedShip].size

    if (!canPlaceShip(x, y, shipSize, orientation)) return

    // Place the ship on the board
    const newBoard = [...board]
    for (let i = 0; i < shipSize; i++) {
      const placeX = orientation === "horizontal" ? x + i : x
      const placeY = orientation === "vertical" ? y + i : y
      newBoard[placeY][placeX] = 1
    }

    setBoard(newBoard)

    // Mark ship as placed
    setPlacedShips({
      ...placedShips,
      [selectedShip]: { x, y, orientation },
    })

    // Select next unplaced ship
    const shipKeys = Object.keys(ships)
    const nextUnplacedShip = shipKeys.find((key) => !placedShips[key] && key !== selectedShip)
    setSelectedShip(nextUnplacedShip || null)
  }

  const resetPlacement = () => {
    setBoard(
      Array(10)
        .fill(0)
        .map(() => Array(10).fill(0)),
    )
    setPlacedShips({})
    setSelectedShip("carrier")
  }

  const handleComplete = () => {
    if (Object.keys(placedShips).length === Object.keys(ships).length) {
      onComplete(board)
    }
  }

  const allShipsPlaced = Object.keys(ships).length === Object.keys(placedShips).length

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:w-2/3">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Place Your Ships</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleOrientation}
              className="border-blue-400 text-blue-300 hover:bg-blue-800"
            >
              <RotateCw className="h-4 w-4 mr-2" />
              Rotate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetPlacement}
              className="border-blue-400 text-blue-300 hover:bg-blue-800"
            >
              Reset
            </Button>
          </div>
        </div>

        <GameBoard board={board} interactive={!!selectedShip} onCellClick={placeShip} />

        {allShipsPlaced && (
          <div className="mt-6">
            <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700" size="lg">
              Ready to Battle!
            </Button>
          </div>
        )}
      </div>

      <div className="lg:w-1/3 bg-blue-900/30 p-4 rounded-lg">
        <h3 className="font-bold mb-3">Your Fleet</h3>
        <div className="space-y-3">
          {Object.entries(ships).map(([key, ship]) => (
            <div
              key={key}
              className={`p-3 rounded-md flex items-center gap-3 cursor-pointer transition-colors ${
                selectedShip === key
                  ? "bg-blue-700 ring-2 ring-blue-300"
                  : placedShips[key]
                    ? "bg-blue-800/50 text-blue-300"
                    : "bg-blue-800 hover:bg-blue-700"
              }`}
              onClick={() => {
                if (!placedShips[key]) {
                  setSelectedShip(key)
                }
              }}
            >
              <Ship className={`h-5 w-5 ${placedShips[key] ? "text-blue-300" : "text-white"}`} />
              <div className="flex-1">
                <div className="font-medium">{shipNames[key]}</div>
                <div className="text-xs text-blue-300">
                  {placedShips[key]
                    ? `Placed at ${String.fromCharCode(65 + placedShips[key].x)}${placedShips[key].y + 1}`
                    : "Not placed yet"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

