import { Router, Request, Response } from 'express';
import Task from '../models/Task';
import authMiddleware from './auth';

const router = Router();

// CREATE
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  const { title, description, status } = req.body;
  const task = await Task.create({ title, description, status });
  res.json(task);
});

// READ 
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  const { status } = req.query;
  const where: any = {};
  if (status) where.status = status;
  const tasks = await Task.findAll({ where });
  res.json(tasks);
});

// UPDATE
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  const task = await Task.findByPk(id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  await task.update({ title, description, status });
  res.json(task);
});

// DELETE
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;
  const task = await Task.findByPk(id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  await task.destroy();
  res.json({ message: 'Task deleted' });
});

export default router;
