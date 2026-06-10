import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import {  z } from "zod"

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const {handlers, auth, signIn, signOut} = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {strategy: "jwt"},
    providers: [
        Google,
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const parsed = signInSchema.safeParse(credentials) // validate the input
                if (!parsed.success) return null

                const { email, password } = parsed.data
                const user = await prisma.user.findUnique({ where: { email } }) // find the user by email
                if (!user) return null

                const isValid = await bcrypt.compare(password, user.password!) // compare the provided password with the hashed password in the database
                if (!isValid) return null

                return user
            },

        }),
    ],

    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.id = user.id
                token.email = user.email
            }
            return token
        }, 
        session: async ({ session, token }) => {
            if (token) {
                session.user.id = token.id as string
                session.user.email = token.email as string
            }
            return session
        }


    }
})