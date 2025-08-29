import { Router } from "express";
import * as transactionController from "../controllers/transactionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authMiddleware);
router.post("/", transactionController.create);

router.get("/", transactionController.getAll);
router.get("/:id", transactionController.getById);

export default router;
