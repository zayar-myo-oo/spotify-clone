import { Router } from "express";
import { authCallback, getCurrentUser } from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/callback", authCallback);
router.get("/me", protectRoute, getCurrentUser);

export default router;
