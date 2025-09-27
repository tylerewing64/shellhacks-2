// server.js

// 1. Import the Express module
const express = require('express');

// 2. Create an Express application instance
const app = express();
const port = 3000; // Define the port

// 3. Define a basic route (the root '/')
app.get('/', (req, res) => {
  res.send('Hello from your Express server!');
});

// 4. Start the server and listen on the defined port
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});