import { NextRequest } from "next/server";
import { gridEvents } from "@/lib/constants";

/**
 * GET /api/grid-events
 *
 * Returns power grid events and incidents for July–September 2024.
 *
 * @param delay - Optional query param to simulate network latency in milliseconds (default: 1500ms)
 * @example
 * // Default 2s delay
 * fetch('/api/grid-events')
 *
 * // No delay for testing
 * fetch('/api/grid-events?delay=0')
 *
 * // Custom 3s delay
 * fetch('/api/grid-events?delay=3000')
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const delay = parseInt(searchParams.get("delay") || "2000", 10);

  await new Promise((resolve) => setTimeout(resolve, delay));

  return Response.json(gridEvents);
}
