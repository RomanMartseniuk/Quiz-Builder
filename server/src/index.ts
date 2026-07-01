import express from "express";
import "dotenv/config";

import quizRouter from "./routes/quiz.js";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json());

app.get("/", (req, res) => {
   res.send("server is running");
});

app.use("/api", quizRouter);

app.listen(PORT, () => {
   console.log(`Server running on http://localhost:${PORT}`);
});