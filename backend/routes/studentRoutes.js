import express from 'express';
import { getStudent, registerStudent } from '../controllers/studentController.js';

const router = express.Router();

router.get('/getStudent', getStudent);
router.post('/register-student', registerStudent);

export default router;