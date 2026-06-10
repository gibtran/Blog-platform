import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import EditForm from "./EditForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/api/auth/signin");

  const post = await prisma.post.findUnique({
    where: { id, authorId: session.user.id },
  });

  if (!post) notFound();

  return <EditForm post={post} />;
}
