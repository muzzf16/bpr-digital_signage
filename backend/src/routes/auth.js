import express from 'express';
import { generateToken } from '../utils/auth.js';
import userService from '../services/userService.js';

const router = express.Router();

// Simple login route - in a real app, you'd validate credentials against a database
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt with:', { username, password });

  const user = await userService.verifyUser(username, password);

  if (user) {
    // Generate JWT token with user info
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } else {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }
});

export default router;