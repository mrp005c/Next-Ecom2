import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";

const handler = NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    // CredentialsProvider info
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials.email === process.env.ADMIN_EMAIL) {
          const isValid = process.env.ADMIN_PASS === credentials.password;
          if (!isValid) throw new Error("Invalid password");

          return {
            name: "Admin NE",
            email: process.env.ADMIN_EMAIL,
            image: "",
            role: "admin",
          };
        }

        await connectDB();
        const user = await User.findOne({ email: credentials.email });

        if (!user) throw new Error("User not found");

        // const isValid = user.password === credentials.password;
        // hashed pass checked
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) throw new Error("Invalid password");

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role || "user",
        };
      },
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await connectDB();
        let existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          // create minimal user from provider data; avoid plain default passwords in production
          existingUser = await User.insertOne({
            name: user.name || "",
            email: user.email,
            image: user.image || "",
            password: null,
            role: user.email === process.env.ADMIN_EMAIL ? "admin" : "user", // don't store insecure default password in prod; better set null or random string
          });
        }

        user.id = existingUser._id.toString();
        user.role = existingUser.role;
        user.image = existingUser.image;
        user.phone = existingUser.phone;
        user.address = existingUser.address;

        if (user.email === process.env.ADMIN_EMAIL) {
          user.id = process.env.ADMIN_PASS;
          user.role = "admin";
          // return true;
        }

        return true;
      } catch (err) {
        console.error("signIn callback error:", err);
        return false;
      }
    },


    async jwt({ token, user, trigger, session }) {
      // On login, attach user data
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.image = user.image;
        token.phone = user.phone;
        token.address = user.address;
        token.name = user.name;
      }

      // When calling update()
      if (trigger === "update" && session) {
        token.name = session.name;
        token.image = session.image;
        token.phone = session.phone;
        token.address = session.address;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.role = token.role;
      session.user.id = token.id;
      session.user.image = token.image;
      session.user.phone = token.phone;
      session.user.address = token.address;
      return session;
    },
  },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
