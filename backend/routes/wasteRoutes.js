const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Create waste collection request
router.post('/waste-requests/create', async (req, res) => {
  try {
    const { userId, wasteType, quantity, pickupDate, address, additionalNotes } = req.body;
    
    const [result] = await pool.query(
      `INSERT INTO waste_requests (user_id, waste_type, quantity, pickup_date, address, additional_notes) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, wasteType, quantity, pickupDate, address, additionalNotes]
    );

    // Fetch the created request with user details
    const [newRequest] = await pool.query(
      `SELECT wr.*, u.username as user_name 
       FROM waste_requests wr 
       JOIN users u ON wr.user_id = u.user_id 
       WHERE wr.request_id = ?`,
      [result.insertId]
    );

    res.status(201).json(newRequest[0]);
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ message: 'Failed to create request', error: error.message });
  }
});

// Get all waste requests (for admin)
router.get('/waste-requests/all', async (req, res) => {
  try {
    const [requests] = await pool.query(
      `SELECT wr.*, u.username as user_name, d.username as driver_name 
       FROM waste_requests wr 
       JOIN users u ON wr.user_id = u.user_id 
       LEFT JOIN users d ON wr.driver_id = d.user_id 
       ORDER BY wr.created_at DESC`
    );
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch requests', error: error.message });
  }
});

// Get user's waste requests
router.get('/waste-requests/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const [requests] = await pool.query(
      `SELECT wr.*, d.username as driver_name 
       FROM waste_requests wr 
       LEFT JOIN users d ON wr.driver_id = d.user_id 
       WHERE wr.user_id = ? 
       ORDER BY wr.created_at DESC`,
      [userId]
    );
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch requests', error: error.message });
  }
});

// Assign driver to request
router.post('/waste-requests/assign', async (req, res) => {
  try {
    const { requestId, driverId } = req.body;
    
    await pool.query(
      `UPDATE waste_requests SET driver_id = ?, status = 'assigned' WHERE request_id = ?`,
      [driverId, requestId]
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Failed to assign driver', error: error.message });
  }
});

// Mark request as complete
router.post('/waste-requests/complete', async (req, res) => {
  try {
    const { requestId } = req.body;
    
    await pool.query(
      `UPDATE waste_requests SET status = 'completed' WHERE request_id = ?`,
      [requestId]
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Failed to complete request', error: error.message });
  }
});

module.exports = router;