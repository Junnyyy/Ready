import { NextRequest } from "next/server";
import { powerUsageData } from "@/lib/constants";

/**
 * GET /api/power-usage
 *
 * Returns power grid data (predicted vs actual consumption) for July–September 2024.
 *
 * @param delay - Optional query param to simulate network latency in milliseconds (default: 1500ms)
 * @example
 * // Default 1.5s delay
 * fetch('/api/power-usage')
 *
 * // No delay for testing
 * fetch('/api/power-usage?delay=0')
 *
 * // Custom 3s delay
 * fetch('/api/power-usage?delay=3000')
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const delay = parseInt(searchParams.get("delay") || "1500", 10);

  await new Promise((resolve) => setTimeout(resolve, delay));

  return Response.json(powerUsageData);
}
