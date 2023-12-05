# Ecommerce-Store

This is a simple Express.js application demonstrating basic API functionalities including user management, item viewing, and a cart system with discount code generation.

## Features

- User registration and management.
- View a list of items.
- Add items to a shopping cart.
- Checkout functionality with cart clearing.
- Discount code generation and application.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them:

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/) (optional)

### Installing

A step-by-step series of examples that tell you how to get a development environment running:

Clone the repository

```bash
git clone https://github.com/TheCBKM/ecommerce-store-uniblox
```

#### Using Docker

1.  `cd ecommerce-store-uniblox`
2.  `docker-compose up`
3.  Your server should now be running on[ http://localhost:8080.](http://localhost:8080)

---

## API Endpoints

### User Management

#### Create User

- **URL**: `/users`
- **Method**: `POST`
- **Description**: Creates a new user and returns a unique user ID.
- **Response**: `{"userId": "<unique_user_id>"}`

#### View User Cart

- **URL**: `/users/:userId/cart`
- **Method**: `GET`
- **Description**: Retrieves the items in the cart of a specified user.
- **URL Parameters**: `userId=[string]`
- **Response**: Array of items in the user's cart.

### Item Management

#### View All Items

- **URL**: `/items`
- **Method**: `GET`
- **Description**: Retrieves a list of all available items.
- **Response**: Array of items.

#### Add Item to Cart

- **URL**: `/users/:userId/cart`
- **Method**: `POST`
- **Description**: Adds a specified item to a user's cart.
- **URL Parameters**: `userId=[string]`
- **Body Parameters**: `{"itemId": <item_id>}`
- **Response**: Updated array of items in the user's cart.

### Checkout

#### Checkout Cart Items

- **URL**: `/users/:userId/checkout`
- **Method**: `POST`
- **Description**: Processes the user's cart for checkout, optionally applying a discount code.
- **URL Parameters**: `userId=[string]`
- **Body Parameters**: `{"coupon": "<optional_coupon_code>"}`
- **Response**: `{"checkedOutItems": [...], "price": <final_price>}`

### Discount Code Management

#### Generate Discount Code

- **URL**: `/admin/generateCode/:userId/`
- **Method**: `GET`
- **Description**: Generates a discount code for a given user.
- **URL Parameters**: `userId=[string]`
- **Response**: `{"coupon": "<discount_code>"}`

### Admin Routes

#### Get Application Stats

- **URL**: `/admin/stats/`
- **Method**: `GET`
- **Description**: Retrieves application statistics such as items purchased count, total purchase amount, discount amount, and list of discount codes.
- **Response**: Object containing application statistics.

## Running the Server

To run the server, navigate to the project directory and execute:

```bash
node app.js
