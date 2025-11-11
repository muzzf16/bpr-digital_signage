import express from 'express';
import { generateToken } from '../utils/auth.js';

const router = express.Router();

// Simple login route - in a real app, you'd validate credentials against a database
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // In a real implementation, validate username/password against database
  // For now, we'll just check for demo credentials
  if (username === 'admin' && password === process.env.ADMIN_PASSWORD) {
    // Generate JWT token with user info
    const token = generateToken({
      id: 1,
      username: username,
      role: 'admin'
    });
    
    return res.json({
      success: true,
      token,
      user: {
        id: 1,
        username: username,
        role: 'admin'
      }
    });
  } else {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

export default router;