import { Router } from "express";
import { FileController } from "../controllers/file.controller";
import { upload } from "../middleware/upload.middleware";

const router = Router();

const fileController = new FileController();

router.post("/upload", upload.single("file"), fileController.uploadFile.bind(fileController));

export default router;
