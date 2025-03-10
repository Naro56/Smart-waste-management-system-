const express = require('express');
const router = express.Router();

// Get user profile
router.get('/users/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const [users] = await pool.query(
        `SELECT user_id, username, email, phone_number, address, role 
         FROM users 
         WHERE user_id = ?`,
        [userId]
      );
      
      if (users.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(users[0]);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Failed to fetch user profile', error: error.message });
    }
  });

module.exports = router;