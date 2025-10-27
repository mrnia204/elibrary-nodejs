import express from "express";
import multer from "multer";
import { authenticate } from "../controllers/authController.js";

const router = express.Router();
const upload = multer();

// use upload.none() middleware here (not in controller)
router.post("/authenticate", upload.none(), authenticate);

export default router;
