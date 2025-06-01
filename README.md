# eCommerce Checkout Flow Simulation
eCommerce Checkout Flow Simulation is  a 3-page mini eCommerce flow that simulates a real-world product
purchase journey, including:

● Landing Page
● Checkout Page
● Thank You Page

# Pages & Functional Requirements

Landing Page
Includes:
● Product Image
● Product Title
● Product Description
● Product Price
● Variant Selector (e.g., color, size)
● Quantity Selector
● “Buy Now” Button

Functionality:

● On clicking Buy Now, the user should be redirected to the Checkout Page.
● You may mock the product using:
○ Static JSON
○ Dummy API
○ Simple DB record


Checkout Page
Form Inputs:
● Full Name
● Email (validate format)
● Phone Number (validate format)
● Address
● City, State, Zip Code
● Card Number (16-digit validation)
● Expiry Date (must be a future date)
● CVV (3-digit validation)

Dynamic Order Summary Section
● Display product name, selected variant, quantity, subtotal, and total.
● Should dynamically reflect previous selections from Landing Page.

Transaction Simulation (Important)
Simulate the following outcomes:
● Approved Transaction
● Declined Transaction
● Gateway Error / Failure

On form submission:
● Store all input data and selected product
● Generate a unique order number
● Store everything in your database
● Update product inventory count
● Redirect to Thank You Page

Thank You Page

Display the following:
● Unique Order Number
● Full Order Summary
● All Customer Input Data
● Final Confirmation Message
Fetch data from your database, not browser storage
Order Confirmation Email (via Mailtrap.io)
Use https://mailtrap.io (sandbox mode) to simulate confirmation emails. Create a free Mailtrap
account to access your SMTP credentials.
Send:
● Approved Transaction Email
○ Order number, product info, customer info, confirmation message
● Declined/Failed Transaction Email
○ Notify customer that the transaction failed
○ Optionally provide retry or support instructions

# Tech Stack

You may use any of your preferred stack.
● Frontend: React , HTML + JS, etc.
● Backend:Node.js (Express) etc.
● Database: MongoDB
● Email Service:Mailtrap.io

## Project Setup Instructions

1.  **Clone the Repository**

2.  **Set up Environment Variables:**
    * Create a file named `.env` in the root of your project.
    * Add the following variables to it:
        .env
        
   MONGO_URI=mongodb+srv://username:YOUR_ACTUAL_DB_PASSWORD@cluster0.0n35eqr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   MAILTRAP_USER=..........
   MAILTRAP_PASS=........
   MAILTRAP_HOST=sandbox.smtp.mailtrap.io
   MAILTRAP_PORT=2525

        
    * **Important:**
        * Replace `YOUR_ACTUAL_DB_PASSWORD` with the actual password for your MongoDB  
        


## How to Run Locally


1.  **Open your terminal or command prompt.**
2.  **Navigate to your project's root directory:**
    bash
    cd e-commerce-checkout-simulation
    
3.  **Start the client:**
    bash
    cd client
    npm start

4.  **Start the server:**
    bash
    cd server
    npm start
    
    