"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle, Trophy, Clock } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface GameControlsProps {
  currentTurn: "player" | "opponent" | null
  gamePhase: "connecting" | "placement" | "playing" | "gameOver"
  gameResult: "win" | "loss" | null
  onNewGame: () => void
}

export function GameControls({ currentTurn, gamePhase, gameResult, onNewGame }: GameControlsProps) {
  const { t } = useLanguage()

  return (
    <div className="mt-8 p-4 bg-blue-900/30 rounded-lg">
      {gamePhase === "playing" && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-300" />
            <span className="font-medium">
              {currentTurn === "player" ? t("yourTurn") : currentTurn === "opponent" ? t("opponentTurn") : t("waiting")}
            </span>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              currentTurn === "player" ? "bg-green-600/20 text-green-400" : "bg-yellow-600/20 text-yellow-400"
            }`}
          >
            {currentTurn === "player" ? t("attack") : t("defend")}
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
                <span className="font-bold text-lg">{t("victory")}</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5" />
                <span className="font-bold text-lg">{t("defeat")}</span>
              </>
            )}
          </div>

          <Button onClick={onNewGame} className="bg-blue-600 hover:bg-blue-700" size="lg">
            {t("playAgain")}
          </Button>
        </div>
      )}
    </div>
  )
}

