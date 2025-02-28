import 'dotenv/config'; 
import express from "express";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes";
import pool from "./config/db";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use("/api", taskRoutes);

pool
  .getConnection()
  .then((connection) => {
    console.log("Connected to MySQL");
    connection.release();
  })
  .catch((err) => {
    console.error("Error connecting to MySQL:", err);
  });

app.listen(port, () => {
  console.log(`Serverr unning at http://localhost:${port}`);
});
