import express from "express";
import multer from "multer";
import { logActivity } from "../controllers/activityController.js";

const router = express.Router();
const upload = multer();

// use upload.none() middleware here (not in controller)
router.post("/log-activity", upload.none(), logActivity);

export default router;