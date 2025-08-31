import { Router } from "express";
import * as AuthController from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", AuthController.register);

router.post("/login", AuthController.login);

router.get("/me", authMiddleware, AuthController.getMe);

export default router;
