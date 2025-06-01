import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ThankYouPage.css';

const ThankYouPage = () => {
  const { orderNumber } = useParams();
  const location = useLocation();
  const transactionStatus = location.state?.transactionStatus;

  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/orders/${orderNumber}`);
        setOrderDetails(res.data);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Could not fetch order details. Please contact support.');
      } finally {
        setLoading(false);
      }
    };

    if (orderNumber) {
      fetchOrderDetails();
    } else {
      setLoading(false);
      setError('No order number provided.');
    }
  }, [orderNumber]);

  if (loading) {
    return <div className="thank-you-page">Loading order details...</div>;
  }

  if (error) {
    return <div className="thank-you-page error-message">{error}</div>;
  }

  if (!orderDetails) {
    return <div className="thank-you-page">No order found.</div>;
  }

  const isApproved = orderDetails.transactionStatus === 'approved';

  return (
    <div className="thank-you-page">
      <h1>{isApproved ? 'Thank You for Your Order!' : 'Transaction Outcome'}</h1>
      <div className={`status-message ${isApproved ? 'success' : 'failure'}`}>
        {isApproved
          ? `Your order #${orderDetails.orderNumber} has been successfully placed.`
          : `Your transaction for order #${orderDetails.orderNumber} ${
              orderDetails.transactionStatus === 'declined'
                ? 'was declined.'
                : 'failed due to a gateway error.'
            }`}
      </div>

      <h2>Order Details</h2>
      <div className="detail-section">
        <p><strong>Order Number:</strong> {orderDetails.orderNumber}</p>
        <h3>Product Information</h3>
        <p>
          <strong>Product:</strong> {orderDetails.productInfo.name}
          {orderDetails.productInfo.variant ? ` (${orderDetails.productInfo.variant})` : ''}
        </p>
        <p><strong>Quantity:</strong> {orderDetails.productInfo.quantity}</p>
        <p><strong>Price per item:</strong> Rs. {orderDetails.productInfo.price.toFixed(2)}</p>
        <p><strong>Subtotal:</strong> Rs. {orderDetails.subtotal.toFixed(2)}</p>
        <p><strong>Total:</strong> Rs. {orderDetails.total.toFixed(2)}</p>
      </div>

      <h2>Customer Information</h2>
      <div className="detail-section">
        <p><strong>Full Name:</strong> {orderDetails.customerInfo.fullName}</p>
        <p><strong>Email:</strong> {orderDetails.customerInfo.email}</p>
        <p><strong>Phone Number:</strong> {orderDetails.customerInfo.phoneNumber}</p>
        <p>
          <strong>Address:</strong> {orderDetails.customerInfo.address}, {orderDetails.customerInfo.city}, {orderDetails.customerInfo.state} - {orderDetails.customerInfo.zipCode}
        </p>
      </div>

      {!isApproved && (
        <div className="retry-instructions">
          <p>Please note: An email with the transaction outcome has been sent to {orderDetails.customerInfo.email}.</p>
          <p>If you would like to try again, please return to the <a href="/">home page</a> and re-select your product.</p>
        </div>
      )}
    </div>
  );
};

export default ThankYouPage;
