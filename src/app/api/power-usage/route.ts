import { NextRequest } from "next/server";
import { powerUsageData } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const delay = parseInt(searchParams.get("delay") || "1500", 10);

  await new Promise((resolve) => setTimeout(resolve, delay));

  return Response.json(powerUsageData);
}
