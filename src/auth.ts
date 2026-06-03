import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { query } from "@/lib/db"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        const email = credentials.email as string
        const password = credentials.password as string

        const res = await query('SELECT * FROM users WHERE email = $1', [email])
        let user = res.rows[0]

        // Auto-seed for AasaMedChem demo purposes
        if (!user) {
          if (email === "admin@example.com" && password === "admin123") {
            const hashedPassword = await bcrypt.hash(password, 10)
            const insertRes = await query(
              'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING *',
              [email, hashedPassword, 'Admin User', 'ADMIN']
            )
            user = insertRes.rows[0]
          } else if (email === "user@example.com" && password === "user123") {
            const hashedPassword = await bcrypt.hash(password, 10)
            const insertRes = await query(
              'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING *',
              [email, hashedPassword, 'User', 'SELLER']
            )
            user = insertRes.rows[0]
          }
        }

        if (!user) return null

        const passwordsMatch = await bcrypt.compare(password, user.password)

        if (passwordsMatch) {
          return { id: user.id, email: user.email, name: user.name, role: user.role }
        }

        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as "ADMIN" | "SELLER"
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
})
