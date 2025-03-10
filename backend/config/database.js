const mysql = require('mysql2/promise');
export const API_BASE_URL = 'http://192.168.56.1:3000/api';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',  // Your MySQL username
  password: 'prasad',   // Your MySQL password
  database: 'smart_waste_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

testConnection();

module.exports = pool;