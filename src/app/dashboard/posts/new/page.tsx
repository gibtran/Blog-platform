"use client";
import { useState } from "react";
import { createPost } from "@/lib/actions/post";
import Image from "next/image";
export default function NewPostPage() {
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setThumbnailUrl(data.secure_url);
    setUploading(false);
  }
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">New Post</h1>
      <form action={createPost} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-zinc-400">Tiêu đề</label>
          <input
            name="title"
            type="text"
            required
            className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-500"
            placeholder="Tiêu đề bài viết..."
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-zinc-400">Nội dung</label>
          <textarea
            name="content"
            required
            rows={10}
            className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-500 resize-none"
            placeholder="Viết nội dung..."
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-zinc-400">Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-zinc-800 file:text-zinc-300 hover:file:bg-zinc-700"
          />
          {uploading && <p className="text-sm text-zinc-500">Đang upload...</p>}
          {thumbnailUrl && (
            <Image
              src={thumbnailUrl}
              width={400}
              height={200}
              alt="Thumbnail preview"
              className="rounded-xl object-cover h-48 w-full"
            />
          )}
        </div>

        <input type="hidden" name="thumbnail" value={thumbnailUrl} />

        <button
          type="submit"
          disabled={uploading}
          className="bg-white text-black font-medium py-3 rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50"
        >
          Đăng bài
        </button>
      </form>
    </div>
  );
}
