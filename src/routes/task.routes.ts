import { Router } from "express";
import { TaskController } from "../controllers/task.controller";

const router = Router();

const controller = new TaskController();

router.post("/", controller.createTask.bind(controller));

router.get("/", controller.getTasks.bind(controller));

router.get("/:id", controller.getTaskById.bind(controller));

router.put("/:id", controller.updateTask.bind(controller));

router.delete("/:id", controller.deleteTask.bind(controller));

export default router;
