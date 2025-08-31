import { Router } from "express";
import multer from "multer";
import * as receiptController from "../controllers/receiptController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
  },
});

router.use(authMiddleware);

router.post(
  "/upload",
  upload.single("receipt"),
  receiptController.processReceipt
);

router.use((error, req, res, next) => {
  res.status(500).json({
    success: false,
    error: "Upload failed",
  });
});

export default router;
