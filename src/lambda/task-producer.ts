import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sqsClient = new SQSClient({
  region: process.env.AWS_REGIONS,
});

interface TaskRequest {
  title: string;
  description?: string;
  userId: number;
}

export const handler = async (event: any) => {
  try {
    console.log("Lambda event:", JSON.stringify(event));

    const body: TaskRequest = typeof event.body === "string" ? JSON.parse(event.body) : event.body;

    if (!body?.title || !body?.userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "title and userId are required",
        }),
      };
    }

    const queueUrl = process.env.SQS_QUEUE_URL;

    if (!queueUrl) {
      throw new Error("SQS_QUEUE_URL is not configured");
    }

    const message = {
      title: body.title,
      description: body.description,
      userId: body.userId,
    };

    const command = new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(message),
    });

    const result = await sqsClient.send(command);

    console.log("Message sent to SQS:", result.MessageId);

    return {
      statusCode: 202,
      body: JSON.stringify({
        message: "Task creation accepted",
        messageId: result.MessageId,
      }),
    };
  } catch (error) {
    console.error("Lambda error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to process task",
      }),
    };
  }
};
