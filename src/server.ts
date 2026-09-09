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

    const port = Number(process.env.PORT) || 3000;

    app.listen(port, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);

    process.exit(1);
  }
}

startServer();
