import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

const PER_PAGE = 5;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      include: { author: true, likes: true },
      skip: (currentPage - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    prisma.post.count({ where: { published: true } }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Latest Posts</h1>
      <div className="flex flex-col gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group border border-zinc-800 rounded-xl p-5 hover:border-zinc-600 transition-colors"
          >
            {post.thumbnail && (
              <Image
                src={post.thumbnail}
                alt={post.title}
                width={800}
                height={400}
                className="rounded-lg mb-4 w-full object-cover h-48"
              />
            )}
            <h2 className="text-xl font-semibold group-hover:text-white transition-colors">
              {post.title}
            </h2>
            <div className="flex items-center gap-3 mt-2 text-sm text-zinc-500">
              <span>{post.author.name}</span>
              <span>·</span>
              <span>{post.createdAt.toLocaleDateString()}</span>
              <span>·</span>
              <span>❤️ {post.likes.length}</span>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/?page=${p}`}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                p === currentPage
                  ? "bg-white text-black"
                  : "border border-zinc-700 hover:border-zinc-500"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
