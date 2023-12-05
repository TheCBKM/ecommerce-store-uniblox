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

// Route to create a new user
app.post("/users", (req, res) => {
    const userId = Date.now().toString(); // Generate a unique user ID
    // Initialize user data
    users[userId] = { cart: [], checkoutCount: 0, coupons: {}, couponsLeft: 0 };
    res.send({ userId: userId }); // Send back the new user ID
  });
  
  // Route to get the list of all items
  app.get("/items", (req, res) => {
    res.send({ items }); // Send the list of items
  });
  
  // Route to add an item to a user's cart
  app.post("/users/:userId/cart", (req, res) => {
    const userId = req.params.userId; // Get user ID from URL
    const itemId = req.body.itemId; // Get item ID from request body
  
    // Check if user exists
    if (!users[userId]) {
      return res.status(404).send("User not found");
    }
  
    // Find the item by its ID
    const item = items.find((i) => i.id === itemId);
    if (!item) {
      return res.status(404).send("Item not found");
    }
  
    // Add item to user's cart
    users[userId].cart.push(item);
    res.send(users[userId].cart); // Send the updated cart
  });
  
  // Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
