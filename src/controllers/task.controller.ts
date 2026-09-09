import { Request, Response, NextFunction } from "express";
import { TaskService } from "../services/task.service";
import { TaskStatus } from "../types/task";

const taskService = new TaskService();

export class TaskController {
  async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description, userId } = req.body;

      if (!title || !userId) {
        return res.status(400).json({
          message: "title and userId are required",
        });
      }

      const task = await taskService.createTask(title, description, Number(userId));

      return res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  }

  async getTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const tasks = await taskService.getTasks();

      return res.json(tasks);
    } catch (error) {
      next(error);
    }
  }

  async getTaskById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const task = await taskService.getTaskById(id);

      if (!task) {
        return res.status(404).json({
          message: "Task not found",
        });
      }

      return res.json(task);
    } catch (error) {
      next(error);
    }
  }

  async updateTask(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const { title, description, status } = req.body;

      if (status && !Object.values(TaskStatus).includes(status)) {
        return res.status(400).json({
          message: "Invalid task status",
        });
      }

      const task = await taskService.updateTask(id, {
        title,
        description,
        status,
      });

      return res.json(task);
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      await taskService.deleteTask(id);

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
