import { globalResponseSchema } from "@/validation/schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest) {
  const response = await fetch("https://api.coingecko.com/api/v3/global");
  if (!response.ok) {
    return NextResponse.json(
      {
        message: [response.status, response.statusText].join(" "),
      },
      {
        status: response.status,
      }
    );
  }

  const data = await response.json();

  // returns like this: { data: {...} } so need to unwrap
  const unwrappedData = data?.data;
  const validation = globalResponseSchema.safeParse(unwrappedData);
  if (!validation.success) {
    return NextResponse.json(
      {
        message: "Failed to validate global data.",
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json(unwrappedData);
}
