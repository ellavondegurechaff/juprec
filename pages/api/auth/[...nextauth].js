import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import TwitterProvider from 'next-auth/providers/twitter';

const adminEmails = process.env.ADMIN_EMAILS?.split(',');

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
    async signIn({ user, account, profile, email }) {
      
      user.email = profile.email ?? email ?? null;
      
      const adminEmails = process.env.ADMIN_EMAILS.split(',');
      user.isAdmin = user.email ? adminEmails.includes(user.email) : false;
      
      return true; 
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        return url;
      } else {
        return baseUrl;
      }
    },
    async session({ session, token }) {
      session.user.isAdmin = token.isAdmin ? true : false;
      return session;
  },
  async jwt({ token, user }) {
      if (user) {  
          token.isAdmin = user.isAdmin;
      }
      return token;
  },
  },
};

export default NextAuth(authOptions);