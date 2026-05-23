const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { email, password, twoStepCode } = req.body;

    // ─── Input Validation ────────────────────────────────────────────────────
    if (!email || !password || !twoStepCode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, password, and 2-step code',
      });
    }

    // ─── Find Admin ──────────────────────────────────────────────────────────
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      // Generic message — never reveal whether email exists
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // ─── Verify Password ─────────────────────────────────────────────────────
    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // ─── Verify 2-Step Code ──────────────────────────────────────────────────
    const isCodeMatch = await bcrypt.compare(String(twoStepCode), admin.twoStepCode);
    if (!isCodeMatch) {
      return res.status(401).json({ success: false, message: 'Invalid 2-step code' });
    }

    // ─── Guard: JWT_SECRET must be set in production ─────────────────────────
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret && process.env.NODE_ENV === 'production') {
      console.error('❌ JWT_SECRET is not set in production environment');
      return res.status(500).json({ success: false, message: 'Server configuration error' });
    }

    // ─── Sign Token ──────────────────────────────────────────────────────────
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      jwtSecret || 'fallback_dev_secret_change_in_production',
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ success: false, message: 'Server error during authentication' });
  }
};
