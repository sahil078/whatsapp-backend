import { Router } from "express";
import { conversationsController } from "../controllers/conversations.controller.js";
const router = Router();
router.get("/", conversationsController.list);
export default router;
