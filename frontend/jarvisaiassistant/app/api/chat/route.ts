import { NextRequest, NextResponse } from "next/server"

interface ChatRequest {
  message: string
  history: { role: "user" | "assistant"; content: string }[]
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()

    // Forward the request to your external Node backend (server.js)
    const backendRes = await fetch(`${BACKEND_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!backendRes.ok) {
      const text = await backendRes.text()
      console.error("Backend /api/chat error:", backendRes.status, text)
      return NextResponse.json(
        { error: "Backend chat API failed" },
        { status: 500 },
      )
    }

    const data = await backendRes.json()
    // data already has: { answer, sources, stats }
    return NextResponse.json(data)
  } catch (error) {
    console.error("Chat API proxy error:", error)
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 },
    )
  }
}