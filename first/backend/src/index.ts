import express from 'express';
import cors from 'cors';
import sequelize from './config/db';
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';


const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

const PORT = 5050;

sequelize.sync({ force: false }).then(() => {
  console.log('DB connected');
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
