import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env.development' });

export const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTHO_SECRET,
  baseURL: process.env.AUTHO_AUDIENCE,
  clientID: process.env.AUTHO_CLIENT_ID,
  issuerBaseURL: process.env.AUTHO_BASE_URL,
};
