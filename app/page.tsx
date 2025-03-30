import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Anchor, Ship } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-900 to-blue-950">
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-white">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="flex justify-center">
            <Ship className="h-16 w-16 text-blue-300" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Battleship</h1>
          <p className="text-xl text-blue-300">Challenge your friends to a classic naval combat game</p>
          <div className="pt-6 space-y-4">
            <Link href="/game" className="w-full block">
              <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Start New Game
              </Button>
            </Link>
            <div className="flex items-center justify-center space-x-2 text-sm text-blue-300">
              <Anchor className="h-4 w-4" />
              <span>Peer-to-peer gameplay - no server required</span>
            </div>
          </div>
        </div>
      </main>
      <footer className="py-4 text-center text-blue-400 text-sm">
        <p>Built with Next.js and WebRTC</p>
      </footer>
    </div>
  )
}

