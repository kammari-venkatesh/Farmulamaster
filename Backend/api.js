import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import questionRoutes from "./routes/questionRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to DB
connectDB();

app.get("/", (req, res) => {
  res.send("FormulaMaster API Running 🚀");
});

// Routes
app.use("/api/questions", questionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
