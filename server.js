const express = require("express");
var cors = require("cors");

const app = express();
app.use(express.json()); // Middleware for parsing JSON bodies
app.use(cors()); // Enable CORS for all routes



const port = 3000;

const n = 3; // The interval for providing discount coupons

// In-memory store
let users = {}; // Stores user data
let items = [
  // List of available items
  { id: 1, name: "Item 1", price: 10 },
  { id: 2, name: "Item 2", price: 50 },
];

let itemsPurchasedCount = 0; // Total number of items purchased
let totalPurchaseAmount = 0; // Total amount from all purchases
let discountAmount = 0; // Total discount amount given
let discountList = []; // List of all discount coupons

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
  