import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CheckoutPage.css';

const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [product, setProduct] = useState(location.state?.product || null);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!product) {
            setMessage('No product selected. Please go back to the home page.');
            // navigate('/');
        }
    }, [product, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName) newErrors.fullName = 'Full Name is required';

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email format is invalid';
        }

        if (!formData.phoneNumber) {
            newErrors.phoneNumber = 'Phone Number is required';
        } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Phone number must be 10 digits';
        }

        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.state) newErrors.state = 'State is required';
        if (!formData.zipCode) newErrors.zipCode = 'Zip Code is required';

        if (!formData.cardNumber) {
            newErrors.cardNumber = 'Card Number is required';
        } else if (!/^\d{16}$/.test(formData.cardNumber)) {
            newErrors.cardNumber = 'Card Number must be 16 digits';
        }

        if (!formData.expiryDate) {
            newErrors.expiryDate = 'Expiry Date is required';
        } else {
            const [month, year] = formData.expiryDate.split('/');
            const currentYear = new Date().getFullYear() % 100;
            const currentMonth = new Date().getMonth() + 1;

            if (
                !month || !year ||
                month.length !== 2 || year.length !== 2 ||
                !/^\d{2}$/.test(month) || !/^\d{2}$/.test(year) ||
                parseInt(month) < 1 || parseInt(month) > 12
            ) {
                newErrors.expiryDate = 'Invalid Expiry Date format (MM/YY)';
            } else {
                const expiryYear = parseInt(year);
                const expiryMonth = parseInt(month);

                if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
                    newErrors.expiryDate = 'Expiry Date must be in the future';
                }
            }
        }

        if (!formData.cvv) {
            newErrors.cvv = 'CVV is required';
        } else if (!/^\d{3}$/.test(formData.cvv)) {
            newErrors.cvv = 'CVV must be 3 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!product) {
            setMessage('Error: No product selected for checkout.');
            return;
        }

        if (!validateForm()) {
            setMessage('Please correct the errors in the form.');
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                customerInfo: {
                    fullName: formData.fullName,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zipCode,
                },
                productInfo: {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: product.quantity,
                    variant: product.variant
                },
                paymentInfo: {
                    cardNumber: formData.cardNumber,
                    expiryDate: formData.expiryDate,
                    cvv: formData.cvv
                }
            };

            const res = await axios.post('http://localhost:5000/api/orders/checkout', orderData);
            setMessage(res.data.message);
            navigate(`/thank-you/${res.data.orderNumber}`, {
                state: { transactionStatus: res.data.transactionStatus }
            });
        } catch (err) {
            console.error('Checkout error:', err.response ? err.response.data : err.message);
            setMessage(`Checkout failed: ${err.response?.data?.message || 'Server error'}`);
        } finally {
            setLoading(false);
        }
    };

    if (!product) {
        return <div className="checkout-page">{message || 'Loading product details...'}</div>;
    }

    const subtotal = product.price * product.quantity;
    const total = subtotal;

    return (
        <div className="checkout-page">
            <h1>Checkout</h1>
            {message && <div className="message">{message}</div>}

            <div className="checkout-container">
                <div className="order-summary">
                    <h2>Order Summary</h2>
                    <div className="summary-item">
                        <span>Product:</span>
                        <span>{product.name} {product.variant ? `(${product.variant})` : ''}</span>
                    </div>
                    <div className="summary-item">
                        <span>Quantity:</span>
                        <span>{product.quantity}</span>
                    </div>
                    <div className="summary-item">
                        <span>Price per item:</span>
                        <span>Rs. {product.price.toFixed(2)}</span>
                    </div>
                    <div className="summary-item total">
                        <span>Subtotal:</span>
                        <span>Rs. {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-item total">
                        <span>Total:</span>
                        <span>Rs. {total.toFixed(2)}</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="checkout-form">
                    <h2>Customer Information</h2>
                    {[
                        { label: 'Full Name', name: 'fullName' },
                        { label: 'Email', name: 'email', type: 'email' },
                        { label: 'Phone Number', name: 'phoneNumber', type: 'tel' },
                        { label: 'Address', name: 'address' },
                        { label: 'City', name: 'city' },
                        { label: 'State', name: 'state' },
                        { label: 'Zip Code', name: 'zipCode' }
                    ].map(({ label, name, type = 'text' }) => (
                        <div className="form-group" key={name}>
                            <label>{label}</label>
                            <input
                                type={type}
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                            />
                            {errors[name] && <span className="error">{errors[name]}</span>}
                        </div>
                    ))}

                    <h2>Payment Information</h2>
                    {[
                        { label: 'Card Number', name: 'cardNumber', placeholder: 'Enter 1 for Approved, ...' },
                        { label: 'Expiry Date (MM/YY)', name: 'expiryDate' },
                        { label: 'CVV', name: 'cvv' }
                    ].map(({ label, name, placeholder = '', type = 'text' }) => (
                        <div className="form-group" key={name}>
                            <label>{label}</label>
                            <input
                                type={type}
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                                placeholder={placeholder}
                            />
                            {errors[name] && <span className="error">{errors[name]}</span>}
                        </div>
                    ))}

                    <button type="submit" disabled={loading}>
                        {loading ? 'Processing...' : 'Place Order'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;
