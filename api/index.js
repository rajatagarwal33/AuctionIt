
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import notificationRouter from './routes/notification.route.js';
import cookieParser from 'cookie-parser';
import { setupWebSocket } from './wss-setup.js'; 
import { setWebSocketServer } from './controllers/listing.controller.js';
import {manageNotification, removeNotificationsForClosedAuctions} from './utils/manageNotification.js'
import cron from 'node-cron';

dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
  console.log('Connected');
}).catch((err) => {
  console.log(err);
});

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
app.use("/api/notification", notificationRouter)

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
});

const { server, wss } = setupWebSocket(app);
setWebSocketServer(wss);


server.listen(5000, () => {
  console.log('Server is running on port 5000');
});


cron.schedule('* * * * *', manageNotification);
cron.schedule('* * * * *', removeNotificationsForClosedAuctions);

