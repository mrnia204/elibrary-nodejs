import express from "express";
import multer from "multer";
import { adminDashboard } from "../controllers/adminController.js";

const router = express.Router();
const upload = multer();

// use upload.none() middleware here (not in controller)
router.get("/adminDashboard", adminDashboard);

export default router;