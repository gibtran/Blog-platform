"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
const postSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

export async function createPost(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/api/auth/signin");

  const parsed = postSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!parsed.success) {
    throw new Error("Invalid input");
  }

  const { title, content } = parsed.data;
  const thumbnail = (formData.get("thumbnail") as string) || null;
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

  await prisma.post.create({
    data: {
      title,
      content,
      slug,
      authorId: session.user.id,
      thumbnail: thumbnail,
      published: true,
    },
  });

  redirect("/dashboard");
}

export async function updatePost(postId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/api/auth/signin");

  const parsed = postSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });
  if (!parsed.success) throw new Error("Invalid input");

  const { title, content } = parsed.data;
  const thumbnail = formData.get("thumbnail") as string;

  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

  await prisma.post.update({
    where: { id: postId, authorId: session.user.id },
    data: { title, content, slug, thumbnail: thumbnail || undefined },
  });

  redirect("/dashboard");
}

export async function deletePost(postId: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/api/auth/signin");

  await prisma.post.delete({
    where: {
      id: postId,
      authorId: session.user.id, // Ensure the user can only delete their own posts
    },
  });

  redirect("/dashboard");
}

export async function togglePublish(postId: string, published: boolean) {
  const session = await auth();
  if (!session?.user?.id) redirect("/api/auth/signin");

  await prisma.post.update({
    where: {
      id: postId,
      authorId: session.user.id, // Ensure the user can only update their own posts
    },
    data: {
      published: !published,
    },
  });

  redirect("/dashboard");
}

export async function createComment(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/api/auth/signin");

  const content = formData.get("content") as string;
  const postId = formData.get("postId") as string;

  if (!content || !postId) throw new Error("Invalid input");

  await prisma.comment.create({
    data: {
      content,
      postId,
      authorId: session.user.id,
    },
  });

  redirect(`/blog/${formData.get("slug")}`);
}

export async function toggleLike(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/api/auth/signin");

  const postId = formData.get("postId") as string;
  const slug = formData.get("slug") as string;

  const existing = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId: session.user.id,
        postId,
      },
    },
  });

  if (existing) {
    await prisma.like.delete({
      where: { userId_postId: { userId: session.user.id, postId } },
    });
  } else {
    await prisma.like.create({
      data: { userId: session.user.id, postId },
    });
  }

  redirect(`/blog/${slug}`);
}
