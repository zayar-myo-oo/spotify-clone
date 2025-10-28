import { Router } from "express";
import { createArtistRequest, getAllArtistRequests, approveArtistRequest, rejectArtistRequest } from "../controller/artistRequest.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", protectRoute, createArtistRequest);
router.get("/", protectRoute, requireAdmin, getAllArtistRequests);
router.put("/:requestId/approve", protectRoute, requireAdmin, approveArtistRequest);
router.put("/:requestId/reject", protectRoute, requireAdmin, rejectArtistRequest);

export default router;