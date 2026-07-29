import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        views: { increment: 1 }
      }
    });
    return NextResponse.json({ success: true, views: post.views });
  } catch (error) {
    console.error("Failed to increment views", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
