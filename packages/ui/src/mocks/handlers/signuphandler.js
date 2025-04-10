import { http, HttpResponse } from "msw";

export const signupHandler = [
  http.post(`${import.meta.env.VITE_BASE_URL}/api/auth/signup`, async () => {
    return HttpResponse.json(true);
  }),
];
