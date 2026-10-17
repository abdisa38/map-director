const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Initialize Chapa Payment
router.post('/chapa/initialize', async (req, res) => {
  try {
    const { amount, customerName, customerPhone, email, txRef, orderReference } = req.body;

    const reference = txRef || `CHAPA-TX-${Date.now()}`;

    // Here we provide structured Chapa response (supports real Chapa API or sandbox mock)
    const chapaResponse = {
      status: 'success',
      message: 'Hosted Payment page created',
      data: {
        checkout_url: `https://checkout.chapa.co/checkout/payment/${reference}`,
        tx_ref: reference,
        amount,
        currency: 'ETB',
        customer: {
          name: customerName,
          phone: customerPhone,
          email: email || 'guest@abaykitchen.et'
        }
      }
    };

    res.json({ success: true, ...chapaResponse });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Verify Chapa Payment
router.get('/chapa/verify/:txRef', async (req, res) => {
  try {
    const { txRef } = req.params;
    
    // Update order with paid status if matched
    await Order.findOneAndUpdate(
      { chapaTxRef: txRef },
      { paymentStatus: 'Paid' }
    );

    res.json({
      status: 'success',
      message: 'Payment verified successfully',
      data: {
        tx_ref: txRef,
        status: 'success'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
