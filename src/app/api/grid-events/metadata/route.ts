import { gridEvents } from "@/lib/constants";

/**
 * GET /api/grid-events/metadata
 *
 * Returns pagination metadata for grid events without fetching the actual data.
 * This allows the UI to render pagination controls before data loads.
 *
 * @example
 * fetch('/api/grid-events/metadata')
 * // Returns: { totalCount: 17, totalPages: 4, pageSize: 5 }
 */
export async function GET() {
  const pageSize = 5;

  return Response.json({
    totalCount: gridEvents.length,
    totalPages: Math.ceil(gridEvents.length / pageSize),
    pageSize,
  });
}
