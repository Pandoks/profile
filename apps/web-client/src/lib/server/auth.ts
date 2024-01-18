import { DrizzleMySQLAdapter } from '@lucia-auth/adapter-drizzle';
import { Lucia } from 'lucia';
import { db, sessions, users } from './db';
import { ENV } from '$env/static/private';

export const lucia = new Lucia(new DrizzleMySQLAdapter(db, sessions, users), {
  sessionCookie: {
    attributes: {
      secure: ENV === 'production'
    }
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username
    };
  }
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  username: string;
}
