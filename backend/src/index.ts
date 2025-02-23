import 'dotenv/config'; 
import express from "express";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes";
import pool from "./config/db";

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/", taskRoutes);

// Test DB connection
pool
  .getConnection()
  .then((connection) => {
    console.log("Connected to MySQL");
    connection.release();
  })
  .catch((err) => {
    console.error("Error connecting to MySQL:", err);
  });

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
