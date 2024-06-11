import { defineConfig } from "drizzle-kit";
 
export default defineConfig({
  schema: "./configs/schema.js",
  out: "./drizzle",
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://AI-Form-Builder_owner:zeYEFKoI1Ud6@ep-dawn-cell-a5dbub2a.us-east-2.aws.neon.tech/AI-Form-Builder?sslmode=require'
  }
});