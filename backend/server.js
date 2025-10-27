import express from 'express';
import cors from 'cors';
import multer from 'multer';
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import activityRoutes from './routes/activityRoutes.js';

const app = express();
const upload = multer();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register route groups
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/student', studentRoutes);
app.use('/activity', activityRoutes);

app.get('/', (req, res) => res.send('server is running...'));

app.listen(3001, () => console.log('server running on port 3001'));