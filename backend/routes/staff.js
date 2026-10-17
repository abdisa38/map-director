const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');

// Staff Login by Role and PIN
router.post('/login', async (req, res) => {
  try {
    const { role, pin, email } = req.body;
    let query = {};

    if (email) {
      query.email = email.toLowerCase().trim();
    } else if (role) {
      query.role = role;
    } else {
      return res.status(400).json({ success: false, error: 'Role or email required for staff login.' });
    }

    const staff = await Staff.findOne(query);
    if (!staff) {
      return res.status(404).json({ success: false, error: `No staff member found with role: ${role}` });
    }

    // Check PIN (default '1234')
    if (staff.pin && pin && staff.pin !== pin) {
      return res.status(401).json({ success: false, error: 'Incorrect staff PIN' });
    }

    staff.lastLogin = new Date();
    await staff.save();

    res.json({
      success: true,
      message: `Welcome back, ${staff.name} (${staff.role})`,
      data: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        role: staff.role,
        status: staff.status,
        lastLogin: staff.lastLogin
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET all staff
router.get('/', async (req, res) => {
  try {
    const staff = await Staff.find().select('-pin').sort({ createdAt: 1 });
    res.json({ success: true, data: staff });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST new staff member
router.post('/', async (req, res) => {
  try {
    const staff = new Staff(req.body);
    await staff.save();
    res.status(201).json({ success: true, data: staff });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT update staff
router.put('/:id', async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!staff) return res.status(404).json({ success: false, error: 'Staff member not found' });
    res.json({ success: true, data: staff });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE staff
router.delete('/:id', async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) return res.status(404).json({ success: false, error: 'Staff member not found' });
    res.json({ success: true, message: 'Staff member removed' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
