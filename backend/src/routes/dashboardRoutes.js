import { Router } from "express";
import * as dashboardController from "../controllers/dashboardController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

// All dashboard routes are protected
router.use(authMiddleware);

router.get("/", dashboardController.getDashboardData);

export default router;
