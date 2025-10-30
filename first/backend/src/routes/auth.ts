import { Router, Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = 'supersecret'; // пізніше в .env


const authMiddleware = (req: Request, res: Response, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};


router.post('/register', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const exists = await User.findOne({ where: { username } });
    if (exists) return res.status(400).json({ message: 'Username already exists' });

    await User.create({ username, password });
    return res.status(201).json({ message: 'User created' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(400).json({ message: 'Invalid username or password' });

    const valid = user.checkPassword(password);
    if (!valid) return res.status(400).json({ message: 'Invalid username or password' });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err });
  }
});

router.get('/login', authMiddleware, async (req: Request, res: Response) => {
  const user = (req as any).user;
  return res.json({ user });
});

export default router;
