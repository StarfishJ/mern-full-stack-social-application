import { PrismaAdapter } from "@lucia-auth/adapter-prisma"; // PrismaAdapter is a helper function that creates an adapter for the Prisma client
import { Google } from "arctic"; // Google is a helper function that creates a Google OAuth client
import { Lucia, Session, User } from "lucia"; // Lucia is a helper function that creates a Lucia client
import { cookies } from "next/headers"; // cookies is a helper function that creates a cookies object
import { cache } from "react"; // cache is a helper function that creates a cache object
import prisma from "./lib/prisma"; // prisma is a helper function that creates a Prisma client

const adapter = new PrismaAdapter(prisma.session, prisma.user); // adapter is a helper function that creates an adapter for the Prisma client

// lucia is a helper function that creates a Lucia client
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false, // this means that the session cookie will not expire
    attributes: {
      secure: process.env.NODE_ENV === "production", // this means that the session cookie will only be sent over HTTPS in production
    },
  },
  getUserAttributes(databaseUserAttributes) {
    return {
      id: databaseUserAttributes.id, // this is the id of the user  
      username: databaseUserAttributes.username, // this is the username of the user
      displayName: databaseUserAttributes.displayName, // this is the display name of the user
      avatarUrl: databaseUserAttributes.avatarUrl, // this is the avatar url of the user
      googleId: databaseUserAttributes.googleId, // this is the google id of the user
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia; // this is the Lucia client
    DatabaseUserAttributes: DatabaseUserAttributes; // this is the type of the user attributes
  }
}

interface DatabaseUserAttributes {
  id: string; // this is the id of the user
  username: string; // this is the username of the user
  displayName: string; // this is the display name of the user
  avatarUrl: string | null; // this is the avatar url of the user
  googleId: string | null; // this is the google id of the user
}

// google is a helper function that creates a Google OAuth client
export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!, // this is the client id of the Google OAuth client
  process.env.GOOGLE_CLIENT_SECRET!, // this is the client secret of the Google OAuth client
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google`, // this is the callback url of the Google OAuth client
);

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null; // this is the session id of the user  

    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId); // this is the result of the validateSession function

    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id); // this is the session cookie of the user
        cookies().set(
          sessionCookie.name, // this is the name of the session cookie
          sessionCookie.value, // this is the value of the session cookie
          sessionCookie.attributes, // this is the attributes of the session cookie
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie(); // this is the session cookie of the user
        cookies().set(
          sessionCookie.name, 
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
    } catch {}

    return result;
  },
);
