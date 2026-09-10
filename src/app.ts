import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import taskRoutes from "./routes/task.routes";
import fileRoutes from "./routes/file.routes";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json());

app.use(morgan("combined"));

app.get("/health", (req, res) => {
  console.log("Reached");

  res.json({
    status: "UP",
    service: "task-api",
  });
});

app.use("/api/tasks", taskRoutes);
app.use("/api/files", fileRoutes);

app.use(errorMiddleware);

export default app;
