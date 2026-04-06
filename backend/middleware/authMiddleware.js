const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'profix_jwt_secret_change_in_production';

// Protect routes — verifies JWT from Authorization header
const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized — no token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.shopId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Not authorized — invalid token' });
  }
};

// Admin-only middleware (simple check via env variable for now)
const adminOnly = (req, res, next) => {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== (process.env.ADMIN_KEY || 'profix_admin_key')) {
    return res.status(403).json({ success: false, error: 'Admin access required' });
  }
  next();
};

module.exports = { protect, adminOnly, JWT_SECRET };
