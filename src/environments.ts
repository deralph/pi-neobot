<<<<<<< HEAD
import dotenv from 'dotenv';

console.log("NODE_ENV: " + process.env.NODE_ENV);

const result = dotenv.config()

if (result.error) {
  if (process.env.NODE_ENV === "development") {
    console.error(".env file not found. This is an error condition in development. Additional error is logged below");
=======
import dotenv from "dotenv";

console.log("NODE_ENV: " + process.env.NODE_ENV);

const result = dotenv.config();

if (result.error) {
  if (process.env.NODE_ENV === "development") {
    console.error(
      ".env file not found. This is an error condition in development. Additional error is logged below"
    );
>>>>>>> f152c337469d0627ee62e194b7fa8938d798bf73
    throw result.error;
  }

  // In production, environment variables are injected into the container environment. We should not even have
  // a .env file inside the running container.
}

interface Environment {
<<<<<<< HEAD
  session_secret: string,
  pi_api_key: string,
  platform_api_url: string,
  mongo_host: string,
  mongo_db_name: string,
  mongo_user: string,
  mongo_password: string,
  frontend_url: string,
=======
  session_secret: string;
  pi_api_key: string;
  platform_api_url: string;
  mongo_host: string;
  mongo_db_name: string;
  mongo_user: string;
  mongo_password: string;
  frontend_url: string;
>>>>>>> f152c337469d0627ee62e194b7fa8938d798bf73
}

const env: Environment = {
  session_secret: process.env.SESSION_SECRET || "This is my session secret",
<<<<<<< HEAD
  pi_api_key: process.env.PI_API_KEY || '',
  platform_api_url: process.env.PLATFORM_API_URL || '',
  mongo_host: process.env.MONGO_HOST || 'localhost:27017',
  mongo_db_name: process.env.MONGODB_DATABASE_NAME || 'demo-app',
  mongo_user: process.env.MONGODB_USERNAME || '',
  mongo_password: process.env.MONGODB_PASSWORD || '',
  frontend_url: process.env.FRONTEND_URL || 'http://localhost:3314',
=======
  pi_api_key: process.env.PI_API_KEY || "",
  platform_api_url: process.env.PLATFORM_API_URL || "",
  mongo_host: process.env.MONGO_HOST || "localhost:27017",
  mongo_db_name: process.env.MONGODB_DATABASE_NAME || "demo-app",
  mongo_user: process.env.MONGODB_USERNAME || "",
  mongo_password: process.env.MONGODB_PASSWORD || "",
  frontend_url: process.env.FRONTEND_URL || "http://localhost:3000/",
>>>>>>> f152c337469d0627ee62e194b7fa8938d798bf73
};

export default env;
