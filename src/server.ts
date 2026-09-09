import "dotenv/config";
import app from "./app";

async function startServer() {
  try {
    console.log({
      DB_HOST: process.env.DB_HOST,
      DB_PORT: process.env.DB_PORT,
      DB_USER: process.env.DB_USER,
      DB_PASSWORD_EXISTS: typeof process.env.DB_PASSWORD === "string",
      DB_NAME: process.env.DB_NAME,
    });

    app.listen(process.env.port, () => {
      console.log(`Server running on http://localhost:${process.env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);

    process.exit(1);
  }
}

startServer();
