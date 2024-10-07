// const express = require('express');
// const app = express();
// const port = 3000;

// app.get('/', (req, res) => {
//   res.send('Hello, World!');
// });

// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to serve static files from each folder
app.use('/admin_login', express.static(path.join(__dirname, 'folder1')));
app.use('/folder2', express.static(path.join(__dirname, 'folder2')));
app.use('/folder3', express.static(path.join(__dirname, 'folder3')));
app.use('/folder4', express.static(path.join(__dirname, 'folder4')));

// Route to serve the main HTML file from folder1
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'folder1', 'index.html'));
});

// Example route to serve an HTML file from folder2
app.get('/folder2', (req, res) => {
  res.sendFile(path.join(__dirname, 'folder2', 'index.html'));
});

// Example route to serve an HTML file from folder3
app.get('/folder3', (req, res) => {
  res.sendFile(path.join(__dirname, 'folder3', 'index.html'));
});

// Example route to serve an HTML file from folder4
app.get('/folder4', (req, res) => {
  res.sendFile(path.join(__dirname, 'folder4', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
