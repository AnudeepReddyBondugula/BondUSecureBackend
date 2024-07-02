import express from 'express';
import userRouter from './routes/userRouter.js';
import authRouter from './routes/authRouter.js';
import adminRouter from './routes/adminRouter.js';

import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/admin", adminRouter);

app.use("*", (req, res) => {
    res.status(404).send("Page not found");
})


export default app;