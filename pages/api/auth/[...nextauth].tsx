import GoogleProvider from 'next-auth/providers/google';
import NextAuth, { User, Account, Profile } from "next-auth";
import { Session as DefaultSession } from 'next-auth';
import type { JWT as JWTType } from "next-auth/jwt";
import type { AdapterUser } from "next-auth/adapters";

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXT_PUBLIC_NEXTAUTH_SECRET } = process.env;

if (!GOOGLE_CLIENT_ID) throw new Error('You must provide GOOGLE_CLIENT_ID env var.');
if (!GOOGLE_CLIENT_SECRET) throw new Error('You must provide GOOGLE_CLIENT_SECRET env var.');
if (!NEXT_PUBLIC_NEXTAUTH_SECRET) throw new Error('You must provide NEXT_PUBLIC_NEXTAUTH_SECRET env var.');

type SignInCallbackParams = {
  user: User | AdapterUser;
  account: Account | null;
  profile?: Profile;
};

type RedirectCallbackParams = {
  url: string;
  baseUrl: string;
};

interface Session extends DefaultSession {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
  jwt: {
    secret: NEXT_PUBLIC_NEXTAUTH_SECRET,
  },
  callbacks: {
    signIn: async function signIn({ user, account, profile }: SignInCallbackParams) {
      return true;
    },
    async redirect({ url, baseUrl }: RedirectCallbackParams) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async session(params: { session: DefaultSession; token: JWTType; user: AdapterUser; }): Promise<Session> {
      const { session, token } = params;
      if (token && token.sub) {
        const customSession: Session = {
          ...session,
          user: {
            ...session.user,
            id: token.sub,
          },
        };
        return customSession;
      }
      return session as Session;
    },
    async jwt(params: { token: JWTType; user?: User | AdapterUser; account?: Account | null; profile?: Profile }): Promise<JWTType> {
      const { token, user } = params;
      if (user && "id" in user) {
        token.sub = user.id;
      }
      return token;
    },
  },
});
