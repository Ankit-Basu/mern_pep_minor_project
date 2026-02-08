import express from "express";
import cors from "cors";
import complaintRoutes from "./routes/complaint.routes.js";
import { logger } from "./middleware/logger.middleware.js";
import { authMiddleware } from "./middleware/auth.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use(logger);
app.use(authMiddleware);

app.use("/", complaintRoutes);

export default app;
