import {auth} from "@/auth"
import cloudinary from "@/lib/cloudinary"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req:NextRequest) {
    const session = await auth()
    if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({error: "No File"}, {status: 400})
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
        {folder: "blog-thumbnails"},
        (error, result) => {
            if (error) reject(error)
            else resolve(result)
        }
    ).end(buffer)
  })

  return NextResponse.json(result)
}