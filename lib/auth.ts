import NextAuth, { type NextAuthConfig } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"

export const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.coursework.me.readonly",
        },
      },
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null
        
        let user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })
        
        if (!user) {
          user = await prisma.user.create({
            data: {
              email: credentials.email as string,
              name: (credentials.email as string).split("@")[0],
              onboardingComplete: false,
            },
          })
        }
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
        
        let dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        })
        
        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name || user.email!.split("@")[0],
              image: user.image,
              onboardingComplete: false,
            },
          })
        }
        
        token.id = dbUser.id
        token.onboardingComplete = dbUser.onboardingComplete
      }
      
      if (account?.provider === "google") {
        token.accessToken = account.access_token
        
        if (account.providerAccountId && token.email) {
          await prisma.account.upsert({
            where: {
              provider_providerAccountId: {
                provider: "google",
                providerAccountId: account.providerAccountId,
              },
            },
            create: {
              userId: token.id as string,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              token_type: account.token_type,
              scope: account.scope,
            },
            update: {
              access_token: account.access_token,
              token_type: account.token_type,
              scope: account.scope,
            },
          })
        }
      }
      
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id as string
        (session.user as any).onboardingComplete = token.onboardingComplete as boolean
        (session as any).accessToken = token.accessToken as string | undefined
      }
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnLoginPage = nextUrl.pathname.startsWith('/login')
      
      if (isOnLoginPage) {
        if (isLoggedIn) return Response.redirect(new URL('/', nextUrl))
        return true
      }
      
      return isLoggedIn
    },
  },
  pages: {
    signIn: "/login",
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)

export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}
