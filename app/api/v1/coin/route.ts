import type { CoinRequest, CoinResponse } from "@/utils/types";

import { coinRequestSchema, coinResponseSchema } from "@/validation/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body: CoinRequest = await req.json();
  const bodyValidation = coinRequestSchema.safeParse(body);

  if (!bodyValidation.success) {
    return NextResponse.json(
      { message: "Failed to validate request." },
      { status: 400 }
    );
  }

  const { id } = body;

  const fetchURL = `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=false&sparkline=false&x_cg_demo_api_key=${process.env.COINGECKO_API_KEY}`;
  const response = await fetch(fetchURL);
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

  const responseData = await response.json();
  const responseValidation = coinResponseSchema.safeParse(responseData);
  if (!responseValidation.success) {
    return NextResponse.json(
      {
        message: "Failed to validate coin data" + responseValidation.error,
      },
      { status: 500 }
    );
  }

  return NextResponse.json(responseData as CoinResponse);
}
