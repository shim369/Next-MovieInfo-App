import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

if (!GOOGLE_CLIENT_ID) throw new Error('You must provide GOOGLE_CLIENT_ID env var.');
if (!GOOGLE_CLIENT_SECRET) throw new Error('You must provide GOOGLE_CLIENT_SECRET env var.');

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
});
