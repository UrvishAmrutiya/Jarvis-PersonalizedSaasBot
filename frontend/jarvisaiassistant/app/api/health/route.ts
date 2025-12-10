import { NextResponse } from "next/server"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/health`)
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Health API proxy error:", error)
    return NextResponse.json(
      { llm: "offline", vectorDb: "offline" },
      { status: 500 },
    )
  }
}