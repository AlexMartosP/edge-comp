import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export const dynamic = "force-dynamic";
export const runtime = "edge";
export const preferredRegion = "arn1";

const time = Date.now();

export async function GET(req: NextRequest) {
  const numofQueries = req.nextUrl.searchParams.get("numofqueries");
  const parsedNumOfQueries = numofQueries ? parseInt(numofQueries) : 1;

  const timeStarted = Date.now();

  for (let i = 0; i < parsedNumOfQueries; i++) {
    await prisma.product.findMany();
  }

  return NextResponse.json({
    duration: Date.now() - timeStarted,
    isColdStart: time === timeStarted,
  });
}
