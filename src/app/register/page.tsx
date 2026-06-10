"use client";
import { register } from "@/lib/actions/auth";

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto mt-16">
      <h1 className="text-2xl font-bold mb-8">Đăng ký</h1>
      <form action={register} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-zinc-400">Tên</label>
          <input
            name="name"
            type="text"
            required
            className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-500"
            placeholder="Tên của bạn..."
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-zinc-400">Email</label>
          <input
            name="email"
            type="email"
            required
            className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-500"
            placeholder="email@example.com"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-zinc-400">Mật khẩu</label>
          <input
            name="password"
            type="password"
            required
            className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-500"
            placeholder="Tối thiểu 6 ký tự"
          />
        </div>

        <button
          type="submit"
          className="bg-white text-black font-medium py-3 rounded-xl hover:bg-zinc-200 transition-colors"
        >
          Đăng ký
        </button>
      </form>
    </div>
  );
}
