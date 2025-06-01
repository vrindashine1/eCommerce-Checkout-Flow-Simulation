
const Order = require('../models/Order');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const generateOrderNumber = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `ORD-${timestamp}-${random}`.toUpperCase();
};

// Mailtrap Transporter
const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
    }
});

const sendConfirmationEmail = async (order, status) => {
    let subject;
    let htmlContent;

    if (status === 'approved') {
        subject = `Order #${order.orderNumber} Confirmed - e-SalesOne`;
        htmlContent = `
            <h1>Order Confirmation</h1>
            <p>Dear ${order.customerInfo.fullName},</p>
            <p>Thank you for your purchase from e-SalesOne. Your order #${order.orderNumber} has been successfully placed and approved.</p>
            <h2>Order Summary:</h2>
            <p><strong>Product:</strong> ${order.productInfo.name} (${order.productInfo.variant || 'N/A'})</p>
            <p><strong>Quantity:</strong> ${order.productInfo.quantity}</p>
            <p><strong>Subtotal:</strong> Rs. ${order.subtotal.toFixed(2)}</p>
            <p><strong>Total:</strong> Rs. ${order.total.toFixed(2)}</p>
            <h2>Customer Information:</h2>
            <p><strong>Email:</strong> ${order.customerInfo.email}</p>
            <p><strong>Address:</strong> ${order.customerInfo.address}, ${order.customerInfo.city}, ${order.customerInfo.state} - ${order.customerInfo.zipCode}</p>
            <p>We will send you another email once your order has been shipped.</p>
            <p>Thank you,</p>
            <p>The e-SalesOne Team</p>
        `;
    } else {
        subject = `Order #${order.orderNumber} Failed - e-SalesOne`;
        htmlContent = `
            <h1>Transaction Failed</h1>
            <p>Dear ${order.customerInfo.fullName},</p>
            <p>We regret to inform you that your transaction for order #${order.orderNumber} could not be completed.</p>
            <p><strong>Reason:</strong> ${status === 'declined' ? 'Your card was declined.' : 'A gateway error occurred. Please try again later.'}</p>
            <p>Please review your payment details and try again, or contact our support team if the issue persists.</p>
            <p>Thank you,</p>
            <p>The e-SalesOne Team</p>
        `;
    }

    try {
        await transporter.sendMail({
            from: '"e-SalesOne" <no-reply@esalesone.com>',
            to: order.customerInfo.email,
            subject: subject,
            html: htmlContent
        });
        console.log(`Confirmation email sent for order ${order.orderNumber} (Status: ${status})`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

const checkout = async (req, res) => {
    const {
        customerInfo,
        productInfo,
        paymentInfo
    } = req.body;
    
    const orderNumber = generateOrderNumber();
    let transactionStatus;

    // Simulate transaction outcome based on card number
    if (paymentInfo.cardNumber.startsWith('1')) {
        transactionStatus = 'approved';
    } else if (paymentInfo.cardNumber.startsWith('2')) {
        transactionStatus = 'declined';
    } else if (paymentInfo.cardNumber.startsWith('3')) {
        transactionStatus = 'gateway_error';
    } else {
        transactionStatus = 'declined'; // Default for other numbers
    }

    const subtotal = productInfo.price * productInfo.quantity;
    const total = subtotal; // For simplicity, no taxes/shipping

    const newOrder = new Order({
        orderNumber,
        customerInfo,
        productInfo,
        transactionStatus,
        paymentInfo,
        subtotal,
        total
    });

    try {
        const savedOrder = await newOrder.save();

        // Simulate inventory update (simple decrement)
        // In a real app, you'd have a product model and update its stock
        console.log(`Inventory updated for product ${productInfo.name}. Remaining stock: X`);

        // Send confirmation email
        await sendConfirmationEmail(savedOrder, transactionStatus);

        res.status(200).json({
            message: 'Order processed successfully',
            orderId: savedOrder._id,
            orderNumber: savedOrder.orderNumber,
            transactionStatus: savedOrder.transactionStatus
        });
    } catch (err) {
        console.error('Error processing order:', err);
        res.status(500).json({
            message: 'Server error during checkout',
            error: err.message
        });
    }
};

const getOrderDetails = async (req, res) => {
    try {
        const order = await Order.findOne({
            orderNumber: req.params.orderNumber
        });
        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }
        res.json(order);
    } catch (err) {
        console.error('Error fetching order details:', err);
        res.status(500).json({
            message: 'Server error'
        });
    }
};

module.exports = {
    checkout,
    getOrderDetails
};