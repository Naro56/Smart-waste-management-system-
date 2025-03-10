const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const [admins] = await pool.query(
      'SELECT * FROM admins WHERE username = ? AND password = ?',
      [username, password]
    );

    if (admins.length === 0) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const admin = admins[0];
    res.json({
      success: true,
      admin: {
        id: admin.admin_id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Admin login failed', error: error.message });
  }
});



// Add driver route
router.post('/add-driver', async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
        const { 
            username, 
            email, 
            password, 
            phoneNumber, 
            address,
            licenseNumber,
            vehicleNumber 
        } = req.body;

        console.log('Received data:', req.body); // Debug log

        // Start transaction
        await connection.beginTransaction();

        // First, insert into users table
        const [userResult] = await connection.query(
            `INSERT INTO users (username, email, password, phone_number, address, role) 
             VALUES (?, ?, ?, ?, ?, 'driver')`,
            [username, email, password, phoneNumber, address]
        );

        console.log('User inserted:', userResult); // Debug log

        // Then, insert into driver_details table
        const [driverResult] = await connection.query(
            `INSERT INTO driver_details (user_id, license_number, vehicle_number, joining_date) 
             VALUES (?, ?, ?, CURRENT_DATE)`,
            [userResult.insertId, licenseNumber, vehicleNumber]
        );

        console.log('Driver details inserted:', driverResult); // Debug log

        // Commit the transaction
        await connection.commit();

        // Fetch the newly created driver
        const [newDriver] = await connection.query(
            'SELECT * FROM v_driver_info WHERE user_id = ?',
            [userResult.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'Driver added successfully',
            driver: newDriver[0]
        });

    } catch (error) {
        console.error('Error adding driver:', error);
        await connection.rollback();
        res.status(500).json({
            success: false,
            message: 'Failed to add driver: ' + error.message
        });
    } finally {
        connection.release();
    }
});

// Remove driver route
router.delete('/remove-driver/:id', async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM users WHERE user_id = ? AND role = ?',
      [req.params.id, 'driver']
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    res.json({
      success: true,
      message: 'Driver removed successfully'
    });

  } catch (error) {
    console.error('Error removing driver:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove driver'
    });
  }
});

module.exports = router;