import { prisma } from "../config/database";
import { TaskStatus } from "../../generated/prisma/client";

export class TaskService {
  async createTask(title: string, description: string | undefined, userId: number) {
    return prisma.task.create({
      data: {
        title,
        description,
        userId,
      },
      include: {
        user: true,
      },
    });
  }

  async getTasks() {
    return prisma.task.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getTaskById(id: number) {
    return prisma.task.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });
  }

  async updateTask(
    id: number,
    data: {
      title?: string;
      description?: string;
      status?: TaskStatus;
    },
  ) {
    return prisma.task.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteTask(id: number) {
    return prisma.task.delete({
      where: {
        id,
      },
    });
  }
}
