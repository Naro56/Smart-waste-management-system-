const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const multer = require('multer');
const path = require('path');
const { authenticateToken } = require('../middleware/auth');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: './uploads/payments',
    filename: function(req, file, cb) {
        cb(null, 'payment-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Get all waste types
router.get('/types', authenticateToken, async (req, res) => {
    try {
        const [types] = await pool.query('SELECT * FROM waste_types');
        res.json({ success: true, data: types });
    } catch (error) {
        console.error('Error fetching waste types:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch waste types' });
    }
});

// Calculate cost
router.post('/calculate-cost', authenticateToken, async (req, res) => {
    try {
        const { waste_type_id, quantity } = req.body;
        const [type] = await pool.query(
            'SELECT price_per_unit FROM waste_types WHERE type_id = ?',
            [waste_type_id]
        );

        if (type.length === 0) {
            return res.status(404).json({ success: false, message: 'Waste type not found' });
        }

        const total_cost = type[0].price_per_unit * quantity;
        res.json({ success: true, data: { total_cost } });
    } catch (error) {
        console.error('Error calculating cost:', error);
        res.status(500).json({ success: false, message: 'Failed to calculate cost' });
    }
});

// Submit waste collection request
router.post('/submit-request', authenticateToken, async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { waste_type_id, quantity, total_amount } = req.body;
        const user_id = req.user.id;

        const [result] = await connection.query(
            `INSERT INTO waste_requests (user_id, waste_type_id, quantity, total_amount) 
             VALUES (?, ?, ?, ?)`,
            [user_id, waste_type_id, quantity, total_amount]
        );

        // Create notification for admin
        await connection.query(
            `INSERT INTO notifications (user_id, title, message, type) 
             SELECT user_id, 'New Waste Request', 'A new waste collection request needs review', 'alert'
             FROM users WHERE role = 'admin'`
        );

        await connection.commit();
        res.json({ 
            success: true, 
            data: { request_id: result.insertId },
            message: 'Request submitted successfully' 
        });
    } catch (error) {
        await connection.rollback();
        console.error('Error submitting request:', error);
        res.status(500).json({ success: false, message: 'Failed to submit request' });
    } finally {
        connection.release();
    }
});

// Upload payment screenshot
router.post('/upload-payment/:requestId', authenticateToken, upload.single('payment'), async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const requestId = req.params.requestId;
        const filename = req.file.filename;

        // Update request status
        await connection.query(
            `UPDATE waste_requests 
             SET payment_status = 'uploaded', payment_screenshot = ? 
             WHERE request_id = ? AND user_id = ?`,
            [filename, requestId, req.user.id]
        );

        // Notify admin
        await connection.query(
            `INSERT INTO notifications (user_id, title, message, type) 
             SELECT user_id, 'Payment Uploaded', 'A new payment screenshot has been uploaded for review', 'alert'
             FROM users WHERE role = 'admin'`
        );

        await connection.commit();
        res.json({ success: true, message: 'Payment screenshot uploaded successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Error uploading payment:', error);
        res.status(500).json({ success: false, message: 'Failed to upload payment' });
    } finally {
        connection.release();
    }
});

// Admin routes
// Verify payment
router.post('/admin/verify-payment/:requestId', authenticateToken, async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { requestId } = req.params;
        const { status } = req.body;

        if (!['verified', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        // Update request status
        await connection.query(
            `UPDATE waste_requests 
             SET payment_status = ?, status = ? 
             WHERE request_id = ?`,
            [status, status === 'verified' ? 'paid' : 'rejected', requestId]
        );

        if (status === 'verified') {
            // Generate receipt
            const receiptNumber = 'RCP' + Date.now();
            const [request] = await connection.query(
                'SELECT total_amount, user_id FROM waste_requests WHERE request_id = ?',
                [requestId]
            );

            // Create receipt
            await connection.query(
                `INSERT INTO payment_receipts (request_id, amount, receipt_number) 
                 VALUES (?, ?, ?)`,
                [requestId, request[0].total_amount, receiptNumber]
            );

            // Notify user
            await connection.query(
                `INSERT INTO notifications (user_id, title, message, type) 
                 VALUES (?, 'Payment Verified', 'Your payment has been verified and receipt generated', 'success')`,
                [request[0].user_id]
            );
        }

        await connection.commit();
        res.json({ success: true, message: `Payment ${status} successfully` });
    } catch (error) {
        await connection.rollback();
        console.error('Error verifying payment:', error);
        res.status(500).json({ success: false, message: 'Failed to verify payment' });
    } finally {
        connection.release();
    }
});

// Assign driver
router.post('/admin/assign-driver/:requestId', authenticateToken, async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { requestId } = req.params;
        const { driverId } = req.body;

        // Update request
        await connection.query(
            'UPDATE waste_requests SET driver_id = ? WHERE request_id = ?',
            [driverId, requestId]
        );

        // Call stored procedure to handle driver assignment and notifications
        await connection.query('CALL assign_driver_to_request(?, ?)', [requestId, driverId]);

        await connection.commit();
        res.json({ success: true, message: 'Driver assigned successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Error assigning driver:', error);
        res.status(500).json({ success: false, message: 'Failed to assign driver' });
    } finally {
        connection.release();
    }
});

module.exports = router;