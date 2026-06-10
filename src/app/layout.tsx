import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { auth } from "@/auth";
import { signOut } from "@/auth";

export const metadata: Metadata = {
  title: "Blog",
  description: "A blog platform",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen">
        <nav className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg tracking-tight">
            Blog
          </Link>
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm text-zinc-400 hover:text-white"
                >
                  Dashboard
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await signOut();
                  }}
                >
                  <button className="text-sm text-zinc-400 hover:text-white">
                    Sign out
                  </button>
                </form>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/register"
                  className="text-sm text-zinc-400 hover:text-white"
                >
                  Register
                </Link>
                <Link
                  href="/api/auth/signin"
                  className="text-sm text-zinc-400 hover:text-white"
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </nav>
        <main className="max-w-3xl mx-auto px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
