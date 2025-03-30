"use client"

import React from "react"

import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"

interface GameBoardProps {
  board: number[][]
  interactive: boolean
  onCellClick: (x: number, y: number) => void
}

export function GameBoard({ board, interactive, onCellClick }: GameBoardProps) {
  const [hoverCell, setHoverCell] = useState<{ x: number; y: number } | null>(null)

  // Board cell values:
  // 0 = empty water
  // 1 = ship
  // 2 = hit ship
  // 3 = missed shot

  const getCellColor = (value: number, x: number, y: number) => {
    if (value === 0) return "bg-blue-800 hover:bg-blue-700"
    if (value === 1) return "bg-gray-600"
    if (value === 2) return "bg-red-600"
    if (value === 3) return "bg-blue-400"
    return "bg-blue-800"
  }

  const getCellContent = (value: number) => {
    if (value === 2) return "×" // Hit
    if (value === 3) return "•" // Miss
    return ""
  }

  // Memoize event handlers to prevent infinite loops
  const handleMouseEnter = useCallback(
    (x: number, y: number) => {
      if (interactive) {
        setHoverCell({ x, y })
      }
    },
    [interactive],
  )

  const handleMouseLeave = useCallback(() => {
    setHoverCell(null)
  }, [])

  // Memoize cell click handler
  const handleCellClick = useCallback(
    (x: number, y: number) => {
      onCellClick(x, y)
    },
    [onCellClick],
  )

  return (
    <div className="inline-block bg-blue-900 p-1 rounded-lg shadow-lg">
      <div className="grid grid-cols-11 gap-1">
        {/* Column headers */}
        <div className="h-8 flex items-center justify-center text-blue-300"></div>
        {Array(10)
          .fill(0)
          .map((_, i) => (
            <div key={`col-${i}`} className="h-8 flex items-center justify-center text-blue-300">
              {String.fromCharCode(65 + i)}
            </div>
          ))}

        {/* Board cells with row headers */}
        {board.map((row, y) => (
          <React.Fragment key={`row-${y}`}>
            {/* Row header */}
            <div className="w-8 flex items-center justify-center text-blue-300">{y + 1}</div>

            {/* Row cells */}
            {row.map((cell, x) => (
              <button
                key={`cell-${x}-${y}`}
                className={cn(
                  "w-8 h-8 flex items-center justify-center text-white font-bold transition-colors",
                  getCellColor(cell, x, y),
                  interactive && cell === 0 ? "cursor-pointer" : "cursor-default",
                  hoverCell?.x === x && hoverCell?.y === y && interactive && cell === 0
                    ? "bg-blue-600 ring-2 ring-white"
                    : "",
                )}
                disabled={!interactive || cell !== 0}
                onClick={() => handleCellClick(x, y)}
                onMouseEnter={() => handleMouseEnter(x, y)}
                onMouseLeave={handleMouseLeave}
              >
                {getCellContent(cell)}
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

