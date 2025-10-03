import { NextRequest } from "next/server";
import { gridEvents } from "@/lib/constants";

/**
 * GET /api/grid-events
 *
 * Returns paginated power grid events and incidents for July–September 2024.
 *
 * @param page - Page number (default: 1)
 * @param pageSize - Number of events per page (default: 5)
 * @param delay - Optional query param to simulate network latency in milliseconds (default: 2000ms)
 * @example
 * // Default pagination (page 1, 5 items)
 * fetch('/api/grid-events')
 *
 * // Page 2 with default page size
 * fetch('/api/grid-events?page=2')
 *
 * // Custom page size
 * fetch('/api/grid-events?page=1&pageSize=10')
 *
 * // No delay for testing
 * fetch('/api/grid-events?delay=0')
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const delay = parseInt(searchParams.get("delay") || "2000", 10);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "5", 10);

  await new Promise((resolve) => setTimeout(resolve, delay));

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedEvents = gridEvents.slice(startIndex, endIndex);

  return Response.json({
    data: paginatedEvents,
    pagination: {
      page,
      pageSize,
      totalCount: gridEvents.length,
      totalPages: Math.ceil(gridEvents.length / pageSize),
    },
  });
}
