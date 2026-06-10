import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { deletePost, togglePublish } from "@/lib/actions/post";
export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/api/auth/signin");

  const posts = await prisma.post.findMany({
    where: { authorId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { likes: true, comments: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link
          href="/dashboard/posts/new"
          className="bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors"
        >
          + New Post
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="border border-zinc-800 rounded-xl p-5 flex items-center justify-between"
          >
            <div>
              <Link href={`/blog/${post.slug}`} className="font-medium hover:text-zinc-300 transition-colors">
                {post.title}
              </Link>
              <p className="text-sm text-zinc-500 mt-1">
                {post.createdAt.toLocaleDateString()} · ❤️ {post.likes.length} ·
                💬 {post.comments.length}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  post.published
                    ? "bg-emerald-900 text-emerald-300"
                    : "bg-zinc-800 text-zinc-400"
                }`}
              >
                {post.published ? "Published" : "Draft"}
              </span>
              <Link
                href={`/dashboard/posts/${post.id}/edit`}
                className="text-xs text-zinc-400 hover:text-white px-3 py-1 border border-zinc-700 rounded-lg hover:border-zinc-500 transition-colors"
              >
                Edit
              </Link>

              <form action={togglePublish.bind(null, post.id, post.published)}>
                <button className="text-xs text-zinc-400 hover:text-white px-3 py-1 border border-zinc-700 rounded-lg hover:border-zinc-500 transition-colors">
                  {post.published ? "Unpublish" : "Publish"}
                </button>
              </form>
              <form action={deletePost.bind(null, post.id)}>
                <button className="text-xs text-red-500 hover:text-red-400 px-3 py-1 border border-zinc-700 rounded-lg hover:border-red-800 transition-colors">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
