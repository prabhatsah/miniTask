import { pool } from "../config/database";
import { TaskStatus } from "../types/task";

export class TaskService {
  async createTask(title: string, description: string | undefined, userId: number) {
    const result = await pool.query(
      `
      INSERT INTO tasks (
        title,
        description,
        user_id
      )
      VALUES ($1, $2, $3)
      RETURNING
        id,
        title,
        description,
        status,
        user_id AS "userId",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      `,
      [title, description ?? null, userId],
    );

    const task = result.rows[0];

    if (!task) {
      throw new Error("Failed to create task");
    }

    const userResult = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        created_at AS "createdAt"
      FROM users
      WHERE id = $1
      `,
      [userId],
    );

    return {
      ...task,
      user: userResult.rows[0] ?? null,
    };
  }

  async getTasks() {
    const result = await pool.query(`
      SELECT
        t.id,
        t.title,
        t.description,
        t.status,
        t.user_id AS "userId",
        t.created_at AS "createdAt",
        t.updated_at AS "updatedAt",

        u.id AS "userId",
        u.name AS "userName",
        u.email AS "userEmail"

      FROM tasks t
      INNER JOIN users u
        ON t.user_id = u.id

      ORDER BY t.created_at DESC
    `);

    return result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      userId: row.userId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,

      user: {
        id: row.userId,
        name: row.userName,
        email: row.userEmail,
      },
    }));
  }

  async getTaskById(id: number) {
    const result = await pool.query(
      `
      SELECT
        t.id,
        t.title,
        t.description,
        t.status,
        t.user_id AS "userId",
        t.created_at AS "createdAt",
        t.updated_at AS "updatedAt",

        u.id AS "userId",
        u.name AS "userName",
        u.email AS "userEmail"

      FROM tasks t
      INNER JOIN users u
        ON t.user_id = u.id

      WHERE t.id = $1
      `,
      [id],
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      userId: row.userId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,

      user: {
        id: row.userId,
        name: row.userName,
        email: row.userEmail,
      },
    };
  }

  async updateTask(
    id: number,
    data: {
      title?: string;
      description?: string;
      status?: TaskStatus;
    },
  ) {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (data.title !== undefined) {
      values.push(data.title);
      fields.push(`title = $${values.length}`);
    }

    if (data.description !== undefined) {
      values.push(data.description);
      fields.push(`description = $${values.length}`);
    }

    if (data.status !== undefined) {
      values.push(data.status);
      fields.push(`status = $${values.length}`);
    }

    if (fields.length === 0) {
      return null;
    }

    fields.push("updated_at = CURRENT_TIMESTAMP");

    values.push(id);

    const result = await pool.query(
      `
      UPDATE tasks
      SET ${fields.join(", ")}
      WHERE id = $${values.length}
      RETURNING
        id,
        title,
        description,
        status,
        user_id AS "userId",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      `,
      values,
    );

    return result.rows[0] ?? null;
  }

  async deleteTask(id: number) {
    const result = await pool.query(
      `
      DELETE FROM tasks
      WHERE id = $1
      RETURNING
        id,
        title,
        description,
        status,
        user_id AS "userId"
      `,
      [id],
    );

    return result.rows[0] ?? null;
  }
}
