  import express, { Request, Response } from 'express';
  import mysql from 'mysql2';
  import cors from 'cors';
  import taskRoutes from './routes/taskRoutes'; 

  const app = express();
  const port = 5000;

  app.use(cors());

  // db connection
  const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "sqlredirect0110config3000Q-‘", 
    database: 'task_manager',  
  });

  app.use(express.json());

  // Test db connection
  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');
  });

  app.get('/', (req: Request, res: Response) => {
    res.send('API is running'); 
  });

  // Use the task routes 
  app.use(taskRoutes);

  // Start the server
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
