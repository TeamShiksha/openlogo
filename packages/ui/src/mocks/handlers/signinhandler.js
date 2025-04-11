import { http, HttpResponse } from "msw";

export const signinHandler = [
  http.post(`${import.meta.env.VITE_BASE_URL}/api/auth/signin`, async () => {
    return HttpResponse.json(true);
  }),
];
