import { Request, Response } from "express";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

import { s3Client } from "../config/s3";

export class FileController {
  async uploadFile(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "File is required",
        });
      }

      const bucketName = process.env.S3_BUCKET_NAME;

      if (!bucketName) {
        throw new Error("S3_BUCKET_NAME is not configured");
      }

      const file = req.file;

      const fileExtension = file.originalname.includes(".") ? file.originalname.substring(file.originalname.lastIndexOf(".")) : "";

      const fileName = `${crypto.randomUUID()}${fileExtension}`;

      const key = `uploads/${fileName}`;

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await s3Client.send(command);

      return res.status(201).json({
        message: "File uploaded successfully",
        file: {
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          key,
          bucket: bucketName,
        },
      });
    } catch (error) {
      console.error("S3 upload failed:", error);

      return res.status(500).json({
        message: "Failed to upload file",
      });
    }
  }
}
