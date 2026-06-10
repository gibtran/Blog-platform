# Blog Web

A full-stack blog platform built with Next.js 16 App Router.

## Features

- Authentication: Google OAuth + email/password (NextAuth v5)
- Register / Sign in
- Create, edit, delete, publish/unpublish posts
- Cloudinary image upload for post thumbnails
- Comments and likes
- SSR blog pages with SEO metadata
- Paginated home page
- Protected dashboard routes

## Tech Stack

- **Next.js 16** — App Router, Server Components, Server Actions
- **Prisma v7** — ORM with PostgreSQL, driver adapter pattern
- **NextAuth v5** — Authentication
- **Tailwind CSS v4** — Styling
- **Cloudinary** — Image hosting
- **bcryptjs** — Password hashing
- **Zod** — Input validation

## Project Structure

```
blog-web/
├── proxy.ts                        # Route protection (middleware)
├── prisma/
│   └── schema.prisma               # Database schema
├── src/
│   ├── auth.ts                     # NextAuth config
│   ├── app/
│   │   ├── layout.tsx              # Root layout + navbar
│   │   ├── page.tsx                # Home page (paginated post list)
│   │   ├── register/
│   │   │   └── page.tsx            # Register page
│   │   ├── blog/
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Blog post detail (SSR + SEO)
│   │   ├── dashboard/
│   │   │   ├── page.tsx            # Dashboard (manage own posts)
│   │   │   └── posts/
│   │   │       ├── new/
│   │   │       │   └── page.tsx    # Create new post
│   │   │       └── [id]/edit/
│   │   │           ├── page.tsx    # Server wrapper (fetch post)
│   │   │           └── EditForm.tsx # Client form (edit post)
│   │   └── api/
│   │       ├── auth/[...nextauth]/
│   │       │   └── route.ts        # NextAuth handlers
│   │       └── upload/
│   │           └── route.ts        # Cloudinary upload endpoint
│   └── lib/
│       ├── prisma.ts               # Prisma client singleton
│       ├── cloudinary.ts           # Cloudinary config
│       └── actions/
│           ├── post.tsx            # Post Server Actions (CRUD, like, comment)
│           └── auth.tsx            # Auth Server Actions (register)
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file at the root:

```env
DATABASE_URL="postgresql://user@localhost:5432/blog"

AUTH_SECRET="your-secret"

AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 3. Setup database

```bash
npx prisma migrate dev
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variable Notes

- `AUTH_SECRET` — generate with `openssl rand -hex 32`
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — from [Google Cloud Console](https://console.cloud.google.com). Set authorized origin to `http://localhost:3000` and redirect URI to `http://localhost:3000/api/auth/callback/google`
- Cloudinary credentials — from [Cloudinary Console](https://cloudinary.com)
