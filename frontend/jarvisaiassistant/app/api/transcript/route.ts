import { NextRequest } from "next/server"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"

export async function GET(_req: NextRequest) {
  const res = await fetch(`${BACKEND_URL}/api/transcript`)
  // Just stream through – frontend probably just opens this URL
  return new Response(res.body, {
    status: res.status,
    headers: res.headers,
  })
}