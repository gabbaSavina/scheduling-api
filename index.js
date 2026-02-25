// Import the Express framework
const express = require("express");

// Create an Express application instance
const app = express();

// Middleware to parse incoming JSON requests
// This allows us to access data using req.body
app.use(express.json());

// Define the port where the server will run
const PORT = 3000;

// Define a basic route (endpoint)
// When someone accesses the root URL ("/"),
// the server responds with a JSON message
app.get("/", (req, res) => {
    res.json({ message: "Scheduling API is running 🚀" });
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});