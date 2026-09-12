import NextAuth, { type NextAuthConfig } from 'next-auth'
import type { Provider } from 'next-auth/providers'
import Resend from 'next-auth/providers/resend'
import Google from 'next-auth/providers/google'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { eq } from 'drizzle-orm'
import { db, users, accounts, sessions, verificationTokens, type UserRole } from '@/app/lib/db'
import { SITE, BASE_URL } from '@/app/lib/site'

// Passwordless sign-in. Magic link by email is the primary method because it
// needs only the Resend key the lead alerts already use, so there is no extra
// vendor to configure. Google is added when its credentials are present.
//
// Sessions are JWTs, not database rows: the proxy can then gate /admin and
// /dashboard on cookie presence without a database call, and the session
// survives a database outage. Roles are copied into the token at sign-in and
// refreshed from the allowlist on every token refresh.

const ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
)

export function roleForEmail(email: string | null | undefined, stored?: UserRole): UserRole {
  if (email && ADMIN_EMAILS.has(email.toLowerCase())) return 'admin'
  return stored ?? 'client'
}

function providers(): Provider[] {
  const list: Provider[] = []
  const resendKey = process.env.AUTH_RESEND_KEY || process.env.RESEND_API_KEY
  // Magic links need somewhere to store the one-time token, so the provider is
  // only offered when the database exists.
  if (resendKey && db) {
    list.push(
      Resend({
        apiKey: resendKey,
        from: process.env.AUTH_EMAIL_FROM || process.env.LEADS_FROM_EMAIL || `login@${new URL(BASE_URL).hostname}`,
        async sendVerificationRequest({ identifier, url, provider }) {
          const host = new URL(url).host
          const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { Authorization: `Bearer ${provider.apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              from: `${SITE.name} <${provider.from}>`,
              to: identifier,
              subject: `Sign in to ${SITE.name}`,
              text: [
                `Sign in to ${SITE.name}`,
                '',
                `Open this link to sign in: ${url}`,
                '',
                'The link works once and expires in 24 hours.',
                'If you did not request this, you can ignore this email.',
                '',
                `${SITE.name} · ${host}`,
              ].join('\n'),
              html: `<div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#0f172a">
  <p style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#64748b;margin:0 0 8px">${SITE.name}</p>
  <h1 style="font-size:22px;margin:0 0 16px">Sign in to ${SITE.name}</h1>
  <p style="margin:0 0 24px;line-height:1.6;color:#475569">Click the button to sign in. The link works once and expires in 24 hours.</p>
  <a href="${url}" style="display:inline-block;background:#059669;color:#fff;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:8px">Sign in</a>
  <p style="margin:24px 0 0;font-size:12px;color:#64748b;line-height:1.6">If you did not request this, ignore this email. Nothing happens unless the link is opened.<br>${host}</p>
</div>`,
            }),
          })
          if (!res.ok) {
            const body = await res.text().catch(() => '')
            throw new Error(`Resend responded ${res.status}: ${body.slice(0, 200)}`)
          }
        },
      })
    )
  }
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    list.push(
      Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        allowDangerousEmailAccountLinking: true,
      })
    )
  }
  return list
}

export const authConfig: NextAuthConfig = {
  // Without a database there is nothing to adapt; NextAuth still initialises
  // so pages that call auth() render as signed-out instead of crashing.
  adapter: db ? DrizzleAdapter(db, { usersTable: users, accountsTable: accounts, sessionsTable: sessions, verificationTokensTable: verificationTokens }) : undefined,
  providers: providers(),
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: '/login', verifyRequest: '/login?sent=1', error: '/login' },
  trustHost: true,
  callbacks: {
    async jwt({ token, user, trigger }) {
      // On sign-in `user` is the adapter row. Copy the id and resolve the role.
      if (user) {
        token.uid = user.id
        const stored = (user as { role?: UserRole }).role
        token.role = roleForEmail(user.email, stored)
        // Promote in the database too, so the role is visible in admin lists.
        if (db && user.id && token.role === 'admin' && stored !== 'admin') {
          try {
            await db.update(users).set({ role: 'admin' }).where(eq(users.id, user.id))
          } catch (err) {
            console.error('[auth] role promotion failed:', err)
          }
        }
      }
      // Re-check the allowlist when the token is updated so a removed admin
      // loses access without waiting for the JWT to expire.
      if (trigger === 'update' && token.email) {
        token.role = roleForEmail(token.email as string, token.role as UserRole)
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.uid as string) ?? session.user.id
        session.user.role = (token.role as UserRole) ?? 'client'
      }
      return session
    },
  },
}

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig)

// Session helper that never throws: with no AUTH_SECRET in the environment
// NextAuth refuses to run, and a marketing page must not 500 because of it.
export async function getSession() {
  if (!process.env.AUTH_SECRET) return null
  try {
    return await auth()
  } catch (err) {
    console.error('[auth] session read failed:', err)
    return null
  }
}

export const authAvailable = Boolean(process.env.AUTH_SECRET) && providers().length > 0

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: UserRole
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}
