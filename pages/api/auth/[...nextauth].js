import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // Perform any additional checks or store user data in your database
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Customize the redirect behavior after successful authentication
      return baseUrl;
    },
    async session({ session, user, token }) {
      // Customize the session object if needed
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      // Customize the JWT token if needed
      return token;
    },
  },
});