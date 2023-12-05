const express = require("express");
var cors = require("cors");
const shortid = require("shortid");

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

// Route for user to checkout their cart
app.post("/users/:userId/checkout", (req, res) => {
  const userId = req.params.userId; // Get user ID from URL
  const userCoupon = req.body?.coupon; // Get coupon code from request body, if any
  let discount = 0; // Initialize discount

  // Check if user exists
  if (!users[userId]) {
    return res.status(404).send("User not found");
  }

  // Check if cart is empty
  if (users[userId].cart.length === 0) {
    return res.status(404).send("Cart is Empty");
  }

  // Apply coupon if valid
  if (userCoupon) {
    if (users[userId].coupons[userCoupon]) {
      discount = 10; // Set discount rate
      users[userId].coupons[userCoupon] = false; // Mark coupon as used
    } else return res.status(404).send("Coupon is invalid");
  }
  checkedOutItems = users[userId].cart;
  // Calculate total price
  let totalPrice = 0;
  checkedOutItems.forEach((item) => {
    totalPrice += item.price;
  });
  let discountPrice = totalPrice * (discount / 100);
  let finalPrice = totalPrice - discountPrice;

  // Update various counts and clear the cart
  users[userId].cart = [];
  users[userId].checkoutCount += 1;
  if (users[userId].checkoutCount % n === 0) {
    users[userId].couponsLeft += 1; // Increment available coupons
  }

  // Update purchase stats
  itemsPurchasedCount += checkedOutItems.length;
  totalPurchaseAmount += finalPrice;
  discountAmount += discountPrice;

  // Send checkout details
  res.send({ checkedOutItems, price: finalPrice });
});

// Route to view a user's cart
app.get("/users/:userId/cart", (req, res) => {
  const userId = req.params.userId; // Get user ID from URL

  // Check if user exists
  if (!users[userId]) {
    return res.status(404).send("User not found");
  }

  res.send(users[userId].cart); // Send user's cart
});

// Admin route to generate a discount code for a user
app.get("/admin/generateCode/:userId/", (req, res) => {
  const userId = req.params.userId; // Get user ID from URL

  // Check if user exists
  if (!users[userId]) {
    return res.status(404).send("User not found");
  }

  // Check if user has coupons left to generate
  if (users[userId].couponsLeft !== 0) {
    const coupon = shortid.generate(); // Generate a unique coupon code
    users[userId].coupons[coupon] = true; // Add coupon to user's coupons
    users[userId].couponsLeft -= 1; // Decrement available coupons
    discountList.push(coupon); // Add coupon to the global list
    return res.send({ coupon }); // Send the generated coupon
  } else return res.status(404).send("No Coupon left"); // No coupons left
});

// Admin route to get Application stats
app.get("/admin/stats/", (req, res) => {
  return res.status(200).send({
    itemsPurchasedCount,
    totalPurchaseAmount,
    discountAmount,
    discountList,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
