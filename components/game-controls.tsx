"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle, Trophy, Clock } from "lucide-react"

interface GameControlsProps {
  currentTurn: "player" | "opponent" | null
  gamePhase: "connecting" | "placement" | "playing" | "gameOver"
  gameResult: "win" | "loss" | null
  onNewGame: () => void
}

export function GameControls({ currentTurn, gamePhase, gameResult, onNewGame }: GameControlsProps) {
  return (
    <div className="mt-8 p-4 bg-blue-900/30 rounded-lg">
      {gamePhase === "playing" && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-300" />
            <span className="font-medium">
              {currentTurn === "player"
                ? "Your turn - Fire at the enemy fleet!"
                : currentTurn === "opponent"
                  ? "Opponent's turn - Brace for impact!"
                  : "Waiting..."}
            </span>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              currentTurn === "player" ? "bg-green-600/20 text-green-400" : "bg-yellow-600/20 text-yellow-400"
            }`}
          >
            {currentTurn === "player" ? "ATTACK" : "DEFEND"}
          </div>
        </div>
      )}

      {gamePhase === "gameOver" && (
        <div className="text-center space-y-4">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
              gameResult === "win" ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400"
            }`}
          >
            {gameResult === "win" ? (
              <>
                <Trophy className="h-5 w-5" />
                <span className="font-bold text-lg">Victory! You sank all enemy ships!</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5" />
                <span className="font-bold text-lg">Defeat! Your fleet has been destroyed!</span>
              </>
            )}
          </div>

          <Button onClick={onNewGame} className="bg-blue-600 hover:bg-blue-700" size="lg">
            Play Again
          </Button>
        </div>
      )}
    </div>
  )
}

