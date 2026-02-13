import Groq from "groq-sdk";
import dotenv from "dotenv";

// Ensure environment variables are loaded
dotenv.config();

if (!process.env.GROQ_API_KEY) {
    console.error("WARNING: GROQ_API_KEY is not set in .env file");
}

export const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});
