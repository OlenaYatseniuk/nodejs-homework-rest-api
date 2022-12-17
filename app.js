import * as dotenv from "dotenv";
import express from "express";
import logger from "morgan";
import cors from "cors";

import contactsRouter from "./routes/api/contacts.js";
import authRouter from "./routes/api/auth/auth.js";
import uploadsRouter from "./routes/api/uploadsRouter.js";

dotenv.config();

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use('/avatars', express.static('./public/avatars'))

app.use("/api/contacts", contactsRouter);
app.use("/api/users", authRouter);
app.use('/api/uploads', uploadsRouter)


app.use((req, res) => {
  res.status(404).json({ message: "Not found. Please use /api/contacts" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

export default app;
