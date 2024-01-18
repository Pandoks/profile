import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
  default: async (event) => {
    const form_data = await event.request.formData();
    const username = form_data.get('username');
    const password = form_data.get('password');
  }
};
