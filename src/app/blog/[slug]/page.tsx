import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { createComment, toggleLike } from "@/lib/actions/post";
import type { Metadata } from "next";
import Image from "next/image";
interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    select: { title: true, content: true, thumbnail: true },
  });

  if (!post) return {};

  return {
    title: post.title,
    description: post.content.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.content.slice(0, 160),
      images: post.thumbnail ? [post.thumbnail] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const session = await auth();
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    include: {
      author: true,
      comments: {
        include: { author: true },
        orderBy: { createdAt: "desc" },
      },
      likes: true,
    },
  });

  if (!post) notFound();
  const userLiked = session
    ? post.likes.some((like) => like.userId === session.user?.id)
    : false;

  return (
    <article>
      {post.thumbnail && (
        <Image
          src={post.thumbnail}
          alt={post.title}
          width={800}
          height={400}
          className="w-full h-64 object-cover rounded-xl mb-8"
        />
      )}

      <h1 className="text-3xl font-bold mb-3">{post.title}</h1>
      <div className="flex items-center gap-3 text-sm text-zinc-500 mb-8">
        <span>{post.author.name}</span>
        <span>·</span>
        <span>{post.createdAt.toLocaleDateString()}</span>
      </div>

      <div className="text-zinc-300 leading-relaxed mb-10">{post.content}</div>

      {/* Like */}
      <form action={toggleLike}>
        <input type="hidden" name="postId" value={post.id} />
        <input type="hidden" name="slug" value={post.slug} />
        <button className="flex items-center gap-2 text-sm border border-zinc-700 px-4 py-2 rounded-full hover:border-zinc-500 transition-colors mb-10">
          {userLiked ? "❤️" : "🤍"} {post.likes.length} likes
        </button>
      </form>

      {/* Comments */}
      <section>
        <h2 className="text-xl font-semibold mb-6">
          Comments ({post.comments.length})
        </h2>

        <ul className="flex flex-col gap-4 mb-8">
          {post.comments.map((comment) => (
            <li
              key={comment.id}
              className="border border-zinc-800 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium">
                  {comment.author.name}
                </span>
                <span className="text-xs text-zinc-500">
                  {comment.createdAt.toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-zinc-300">{comment.content}</p>
            </li>
          ))}
        </ul>

        {session ? (
          <form action={createComment}>
            <input type="hidden" name="postId" value={post.id} />
            <input type="hidden" name="slug" value={post.slug} />
            <textarea
              name="content"
              placeholder="Viết comment..."
              required
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 resize-none h-24"
            />
            <button className="mt-2 bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors">
              Gửi
            </button>
          </form>
        ) : (
          <p className="text-zinc-500 text-sm">
            <a href="/api/auth/signin" className="text-white underline">
              Đăng nhập
            </a>{" "}
            để bình luận
          </p>
        )}
      </section>
    </article>
  );
}
