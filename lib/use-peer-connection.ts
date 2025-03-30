"use client"

import { useState, useEffect, useCallback, useRef } from "react"

export function usePeerConnection() {
  const [connectionId, setConnectionId] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected")
  const [lastReceivedData, setLastReceivedData] = useState<string | null>(null)
  const [isHost, setIsHost] = useState<boolean>(false)

  // Use refs to avoid recreating objects on each render
  const peerRef = useRef<any>(null)
  const connectionRef = useRef<any>(null)

  // Initialize PeerJS only once
  useEffect(() => {
    let isMounted = true

    const initPeer = async () => {
      try {
        // Dynamically import PeerJS to avoid SSR issues
        const { default: Peer } = await import("peerjs")

        // Create a new peer with a random ID
        const newPeer = new Peer()

        // Store the peer in ref to avoid recreating it
        peerRef.current = newPeer

        newPeer.on("open", (id) => {
          if (isMounted) {
            setConnectionId(id)
            console.log("My peer ID is:", id)
          }
        })

        newPeer.on("connection", (conn) => {
          console.log("Incoming connection from:", conn.peer)

          // Store the connection in ref
          connectionRef.current = conn

          if (isMounted) {
            setConnectionStatus("connecting")
            setIsHost(true)
          }

          conn.on("open", () => {
            console.log("Connection established")
            if (isMounted) {
              setConnectionStatus("connected")
            }
          })

          conn.on("data", (data) => {
            console.log("Received data:", data)
            if (isMounted) {
              setLastReceivedData(data as string)
            }
          })

          conn.on("close", () => {
            console.log("Connection closed")
            if (isMounted) {
              setConnectionStatus("disconnected")
              connectionRef.current = null
            }
          })

          conn.on("error", (err) => {
            console.error("Connection error:", err)
            if (isMounted) {
              setConnectionStatus("disconnected")
              connectionRef.current = null
            }
          })
        })

        newPeer.on("error", (err) => {
          console.error("Peer error:", err)
        })
      } catch (error) {
        console.error("Failed to initialize PeerJS:", error)
      }
    }

    initPeer()

    // Cleanup function
    return () => {
      isMounted = false

      // Clean up connection
      if (connectionRef.current) {
        connectionRef.current.close()
      }

      // Destroy peer
      if (peerRef.current) {
        peerRef.current.destroy()
      }
    }
  }, []) // Empty dependency array ensures this runs only once

  // Connect to another peer
  const connectToPeer = useCallback((peerId: string) => {
    if (!peerRef.current) return

    console.log("Connecting to peer:", peerId)
    setConnectionStatus("connecting")
    setIsHost(false)

    const conn = peerRef.current.connect(peerId)
    connectionRef.current = conn

    conn.on("open", () => {
      console.log("Connection established")
      setConnectionStatus("connected")
    })

    conn.on("data", (data) => {
      console.log("Received data:", data)
      setLastReceivedData(data as string)
    })

    conn.on("close", () => {
      console.log("Connection closed")
      setConnectionStatus("disconnected")
      connectionRef.current = null
    })

    conn.on("error", (err) => {
      console.error("Connection error:", err)
      setConnectionStatus("disconnected")
      connectionRef.current = null
    })
  }, []) // No dependencies needed as we're using refs

  // Send data to the connected peer
  const sendData = useCallback(
    (data: string) => {
      if (connectionRef.current && connectionStatus === "connected") {
        connectionRef.current.send(data)
      }
    },
    [connectionStatus],
  )

  return {
    connectionStatus,
    connectionId,
    connectToPeer,
    sendData,
    lastReceivedData,
    isHost,
  }
}

