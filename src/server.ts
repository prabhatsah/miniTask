import app from "./app";
import { env } from "./config/env";
import { prisma } from "./config/database";

async function startServer() {
  try {
    await prisma.$connect();

    console.log("Database connected");
    console.log("DATABASE_URL:", process.env.DATABASE_URL);

    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);

    await prisma.$disconnect();

    process.exit(1);
  }
}

startServer();
