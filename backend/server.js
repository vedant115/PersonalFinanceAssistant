import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.js";
import transactionRoutes from "./src/routes/transactionRoutes.js";
import receiptRoutes from "./src/routes/receiptRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running..");
});

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/receipts", receiptRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
