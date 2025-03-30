"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { GameBoard } from "@/components/game-board"
import { ShipPlacement } from "@/components/ship-placement"
import { GameControls } from "@/components/game-controls"
import { usePeerConnection } from "@/lib/use-peer-connection"
import { Ship } from "lucide-react"

export default function GamePage() {
  const router = useRouter()
  const [gamePhase, setGamePhase] = useState<"connecting" | "placement" | "playing" | "gameOver">("connecting")
  const [playerBoard, setPlayerBoard] = useState<number[][]>(
    Array(10)
      .fill(0)
      .map(() => Array(10).fill(0)),
  )
  const [opponentBoard, setOpponentBoard] = useState<number[][]>(
    Array(10)
      .fill(0)
      .map(() => Array(10).fill(0)),
  )
  const [playerShips, setPlayerShips] = useState<{ [key: string]: { size: number; placed: boolean } }>({
    carrier: { size: 5, placed: false },
    battleship: { size: 4, placed: false },
    cruiser: { size: 3, placed: false },
    submarine: { size: 3, placed: false },
    destroyer: { size: 2, placed: false },
  })
  const [currentTurn, setCurrentTurn] = useState<"player" | "opponent" | null>(null)
  const [gameResult, setGameResult] = useState<"win" | "loss" | null>(null)

  // Use refs to track the latest state without triggering effect reruns
  const gamePhaseRef = useRef(gamePhase)
  const playerBoardRef = useRef(playerBoard)
  const opponentBoardRef = useRef(opponentBoard)
  const playerShipsRef = useRef(playerShips)

  // Update refs when state changes
  useEffect(() => {
    gamePhaseRef.current = gamePhase
  }, [gamePhase])

  useEffect(() => {
    playerBoardRef.current = playerBoard
  }, [playerBoard])

  useEffect(() => {
    opponentBoardRef.current = opponentBoard
  }, [opponentBoard])

  useEffect(() => {
    playerShipsRef.current = playerShips
  }, [playerShips])

  const { connectionStatus, connectionId, connectToPeer, sendData, lastReceivedData, isHost } = usePeerConnection()

  // Handle connection status changes
  useEffect(() => {
    if (connectionStatus === "connected") {
      setGamePhase("placement")
    }
  }, [connectionStatus])

  // Process received data without causing infinite loops
  const processReceivedData = useCallback(
    (data: any) => {
      if (data.type === "ready" && gamePhaseRef.current === "placement") {
        // Opponent is ready with ship placement
        if (Object.values(playerShipsRef.current).every((ship) => ship.placed)) {
          // Both players are ready
          setGamePhase("playing")
          setCurrentTurn(isHost ? "player" : "opponent")
          sendData(JSON.stringify({ type: "gameStart" }))
        }
      } else if (data.type === "gameStart") {
        // Transition to playing phase when receiving gameStart message
        setGamePhase("playing")
        setCurrentTurn(isHost ? "player" : "opponent")
      } else if (data.type === "attack") {
        // Handle opponent's attack
        const { x, y } = data

        setPlayerBoard((prevBoard) => {
          const newBoard = prevBoard.map((row) => [...row])
          const hit = newBoard[y][x] === 1
          newBoard[y][x] = hit ? 2 : 3 // 2 = hit, 3 = miss

          // Check if all ships are hit
          const allShipsHit = newBoard.flat().filter((cell) => cell === 1).length === 0

          if (allShipsHit) {
            // Use setTimeout to avoid state updates during render
            setTimeout(() => {
              setGamePhase("gameOver")
              setGameResult("loss")
              sendData(JSON.stringify({ type: "gameOver", result: "win" }))
            }, 0)
          } else {
            // Use setTimeout to avoid state updates during render
            setTimeout(() => {
              setCurrentTurn("player")
              sendData(JSON.stringify({ type: "attackResult", hit, x, y }))
            }, 0)
          }

          return newBoard
        })
      } else if (data.type === "attackResult") {
        // Update opponent's board based on attack result
        const { hit, x, y } = data

        setOpponentBoard((prevBoard) => {
          const newBoard = prevBoard.map((row) => [...row])
          newBoard[y][x] = hit ? 2 : 3 // 2 = hit, 3 = miss
          return newBoard
        })

        setCurrentTurn("opponent")
      } else if (data.type === "gameOver") {
        setGamePhase("gameOver")
        setGameResult(data.result === "win" ? "loss" : "win")
      }
    },
    [isHost, sendData],
  )

  // Handle received data
  useEffect(() => {
    if (!lastReceivedData) return

    try {
      const data = JSON.parse(lastReceivedData)
      processReceivedData(data)
    } catch (error) {
      console.error("Error parsing received data:", error)
    }
  }, [lastReceivedData, processReceivedData])

  const handleShipPlacement = useCallback(
    (board: number[][]) => {
      setPlayerBoard(board)

      // Mark all ships as placed
      setPlayerShips((prevShips) => {
        const updatedShips = { ...prevShips }
        Object.keys(updatedShips).forEach((key) => {
          updatedShips[key].placed = true
        })
        return updatedShips
      })

      // Notify opponent that we're ready
      sendData(JSON.stringify({ type: "ready" }))

      // If opponent was already ready, start the game
      if (gamePhaseRef.current === "playing") {
        setCurrentTurn(isHost ? "player" : "opponent")
      }
    },
    [sendData, isHost],
  )

  const handleCellClick = useCallback(
    (x: number, y: number) => {
      if (gamePhaseRef.current !== "playing" || currentTurn !== "player") return
      if (opponentBoardRef.current[y][x] !== 0) return // Already attacked this cell

      // Send attack to opponent
      sendData(JSON.stringify({ type: "attack", x, y }))

      // Temporarily set turn to opponent until we get a response
      setCurrentTurn(null)
    },
    [currentTurn, sendData],
  )

  const handleNewGame = useCallback(() => {
    router.push("/")
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Ship className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Battleship</h1>
          </div>
          <Button variant="outline" onClick={handleNewGame} className="border-blue-400 text-blue-300 hover:bg-blue-800">
            New Game
          </Button>
        </header>

        {gamePhase === "connecting" && (
          <div className="flex flex-col items-center justify-center h-[70vh] space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Finding an opponent...</h2>
              <p className="text-blue-300">Connection ID: {connectionId || "Generating..."}</p>
            </div>

            <div className="w-full max-w-md p-4 bg-blue-800/30 rounded-lg">
              <h3 className="font-medium mb-2">Connect with a friend</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter friend's connection ID"
                  className="flex-1 px-3 py-2 bg-blue-950 rounded border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  onClick={() => {
                    const input = document.querySelector("input") as HTMLInputElement
                    if (input.value) connectToPeer(input.value)
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Connect
                </Button>
              </div>
            </div>

            <div className="animate-pulse text-blue-400">Waiting for connection...</div>
          </div>
        )}

        {gamePhase === "placement" && <ShipPlacement ships={playerShips} onComplete={handleShipPlacement} />}

        {(gamePhase === "playing" || gamePhase === "gameOver") && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold mb-3">Your Fleet</h2>
              <GameBoard board={playerBoard} interactive={false} onCellClick={() => {}} />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-3">Opponent's Fleet</h2>
              <GameBoard
                board={opponentBoard}
                interactive={gamePhase === "playing" && currentTurn === "player"}
                onCellClick={handleCellClick}
              />
            </div>
          </div>
        )}

        {(gamePhase === "playing" || gamePhase === "gameOver") && (
          <GameControls
            currentTurn={currentTurn}
            gamePhase={gamePhase}
            gameResult={gameResult}
            onNewGame={handleNewGame}
          />
        )}
      </div>
    </div>
  )
}

