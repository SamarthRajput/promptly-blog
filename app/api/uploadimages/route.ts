import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { media, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import cloudinary from "@/lib/cloudinary";
import { Readable } from "stream";
import { syncUser } from "@/actions/syncUser";

export async function POST(request: Request) {
  try {
    const clerkUser = await syncUser();
    if (!clerkUser?.id)
      return NextResponse.json({ error: "Unauthorized, please log in." }, { status: 401 });

    // Parse multipart/form-data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const altText = formData.get("altText") as string | null;
    const provider = formData.get("provider") as string | null;

    if (!file) {
      return NextResponse.json({ error: "Image file is required." }, { status: 400 });
    }

    // Upload to Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadStream = () =>
      new Promise<{ url: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "promptly-blog" },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve({ url: result.secure_url });
          }
        );
        Readable.from(buffer).pipe(stream);
      });

    const { url: imageUrl } = await uploadStream();

    // Find user in DB
    const dbUser = await db.query.user.findFirst({
      where: eq(user.clerkId, clerkUser.id),
    });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Save media
    const [newMedia] = await db.insert(media).values({
      createdBy: dbUser.id,
      url: imageUrl,
      altText: altText || undefined,
      type: "image",
      provider: provider || undefined,
    }).returning();

    return NextResponse.json({ message: "Media saved.", media: newMedia }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
