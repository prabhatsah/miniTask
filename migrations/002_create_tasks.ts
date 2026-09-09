import type { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createType("task_status", ["TODO", "IN_PROGRESS", "COMPLETED"]);

  pgm.createTable("tasks", {
    id: {
      type: "serial",
      primaryKey: true,
    },

    title: {
      type: "varchar(255)",
      notNull: true,
    },

    description: {
      type: "text",
    },

    status: {
      type: "task_status",
      notNull: true,
      default: "TODO",
    },

    user_id: {
      type: "integer",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
    },

    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },

    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  pgm.createIndex("tasks", "user_id");
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("tasks");
  pgm.dropType("task_status");
}
