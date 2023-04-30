import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXT_PUBLIC_NEXTAUTH_SECRET } = process.env;

if (!GOOGLE_CLIENT_ID) throw new Error('You must provide GOOGLE_CLIENT_ID env var.');
if (!GOOGLE_CLIENT_SECRET) throw new Error('You must provide GOOGLE_CLIENT_SECRET env var.');
if (!NEXT_PUBLIC_NEXTAUTH_SECRET) throw new Error('You must provide NEXT_PUBLIC_NEXTAUTH_SECRET env var.');

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
});
