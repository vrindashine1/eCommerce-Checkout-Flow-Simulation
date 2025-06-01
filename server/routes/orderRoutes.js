
const express = require('express');
const router = express.Router();
const {
    checkout,
    getOrderDetails
} = require('../controllers/orderController');

router.post('/checkout', checkout);
router.get('/:orderNumber', getOrderDetails);

module.exports = router;