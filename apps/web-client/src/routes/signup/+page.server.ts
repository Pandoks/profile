import { db } from '$lib/server/db/db';
import { users } from '$lib/server/db/schema';
import { fail, type Actions } from '@sveltejs/kit';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';
import { z } from 'zod';

const form_data_schema = z.object({
  username: z
    .string()
    .min(3)
    .max(31)
    .regex(/^[a-z0-9_-]+$/),
  password: z.string().min(6).max(255)
});

export const actions: Actions = {
  default: async (event) => {
    try {
      const form_data = await event.request.formData();
      const { username, password } = form_data_schema.parse(Object.fromEntries(form_data));
      const user_id = generateId(15);
      const hashed_password = await new Argon2id().hash(password);
      console.log('Inserting user');
      await db
        .insert(users)
        .values({ id: user_id, username: username, hashedPassword: hashed_password });
    } catch (error) {
      console.log(error);
      return fail(400, { message: 'Invalid inputs' });
    }
  }
};
