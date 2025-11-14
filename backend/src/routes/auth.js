import express from 'express';
import { generateToken } from '../utils/auth.js';
import userService from '../services/userService.js';

const router = express.Router();

// Login route with error handling
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt with:', { username });

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
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during login',
    });
  }
});

export default router;