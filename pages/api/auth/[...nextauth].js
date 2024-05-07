// ./auth/[...nextauth].js
import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import TwitterProvider from 'next-auth/providers/twitter';

export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      version: "2.0",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // Perform any additional checks or store user data in your database
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Customize the redirect behavior after successful authentication
      if (url.startsWith(baseUrl)) {
        return url;
      } else {
        return baseUrl;
      }
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
};

export default NextAuth(authOptions);