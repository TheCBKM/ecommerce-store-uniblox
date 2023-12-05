const express = require("express");
var cors = require("cors");

const app = express();
app.use(express.json()); // Middleware for parsing JSON bodies
app.use(cors()); // Enable CORS for all routes



const port = 3000;

const n = 3; // The interval for providing discount coupons


// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
  