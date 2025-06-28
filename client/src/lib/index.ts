import { Auth0Client } from "@auth0/auth0-spa-js";
import ApiService from "./api";

const auth0Client = new Auth0Client({
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  authorizationParams: {
    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
  },
});

export const apiService = new ApiService(
  auth0Client,
  import.meta.env.VITE_SERVER_URL
);
