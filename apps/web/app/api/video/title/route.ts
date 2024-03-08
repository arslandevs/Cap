import { type NextRequest } from "next/server";
import { getCurrentUser } from "@cap/database/auth/session";
import { nanoId } from "@cap/database/helpers";
import { videos } from "@cap/database/schema";
import { db } from "@cap/database";
import { eq } from "drizzle-orm";

export async function PUT(request: NextRequest) {
  const user = await getCurrentUser();
  const { title, videoId } = await request.json();
  const userId = user?.userId as string;

  if (!user || !title || !videoId) {
    console.error("Missing required data in /api/video/title/route.ts");

    return new Response(JSON.stringify({ error: true }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const query = await db.select().from(videos).where(eq(videos.id, videoId));

  if (query.length === 0) {
    return new Response(JSON.stringify({ error: true }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const ownerId = query[0].ownerId;

  if (ownerId !== userId) {
    return new Response(JSON.stringify({ error: true }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  await db
    .update(videos)
    .set({
      name: title,
    })
    .where(eq(videos.id, videoId));

  return new Response(
    JSON.stringify({
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  );
}
