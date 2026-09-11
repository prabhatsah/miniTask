import { Pool } from "pg";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 2,
});

const snsClient = new SNSClient({
  region: process.env.AWS_REGIONS,
});

export const handler = async (event: any) => {
  console.log("STEP 1 - SQS event:", JSON.stringify(event));

  for (const record of event.Records) {
    console.log("STEP 2 - Processing message:", record.messageId);

    try {
      console.log("STEP 3 - Raw body:", record.body);

      const message = JSON.parse(record.body);

      console.log("STEP 4 - Parsed message:", JSON.stringify(message));

      console.log("STEP 5 - Starting DB insert");

      const result = await pool.query(
        `
        INSERT INTO tasks (title, description, user_id)
        VALUES ($1, $2, $3)
        RETURNING id
        `,
        [message.title, message.description ?? null, message.userId],
      );

      console.log("STEP 6 - DB insert successful");

      const taskId = result.rows[0].id;

      console.log("STEP 7 - Task ID:", taskId);

      const topicArn = process.env.SNS_TOPIC_ARN;

      console.log("STEP 8 - SNS topic ARN:", topicArn);

      if (!topicArn) {
        throw new Error("SNS_TOPIC_ARN is not configured");
      }

      console.log("STEP 9 - Publishing SNS message");

      const snsResult = await snsClient.send(
        new PublishCommand({
          TopicArn: topicArn,
          Subject: "Task Created",
          Message: JSON.stringify({
            event: "TASK_CREATED",
            taskId,
            title: message.title,
            userId: message.userId,
          }),
        }),
      );

      console.log("STEP 10 - SNS publish successful:", snsResult.MessageId);
    } catch (error) {
      console.error("STEP FAILED:", error);
      throw error;
    }
  }

  console.log("STEP 11 - Lambda completed successfully");
};
