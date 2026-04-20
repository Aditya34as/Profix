const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Shop = require('../models/Shop');
const Lead = require('../models/Lead');
const Review = require('../models/Review');
const { protect, protectUser, requireAdmin, JWT_SECRET } = require('../middleware/authMiddleware');
const User = require('../models/User');
const upload = require('../middleware/upload');

const router = express.Router();

// GET /api/shops/search — Geo-search for shops near a location
// Query: ?lat=28.6&lng=77.2&service=ac-repair&radius=15&page=1
router.get('/search', async (req, res) => {
  try {
    const { lat, lng, service, radius = 15, page = 1 } = req.query;
    const limit = 12;
    const skip = (parseInt(page) - 1) * limit;

    if (!lat || !lng) {
      return res.status(400).json({ success: false, error: 'Latitude and longitude are required' });
    }

    const geoQuery = {
      isApproved: true,
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius) * 1000
        }
      }
    };

    if (service && service !== 'all') {
      geoQuery.services = { $in: [service] };
    }

    let shops;
    let total;
    let usedGeo = true;

    try {
      shops = await Shop.find(geoQuery)
        .select('-password')
        .skip(skip)
        .limit(limit);
      total = await Shop.countDocuments(geoQuery);
    } catch (geoErr) {
      // Geo query failed (e.g., missing 2dsphere index) — fall back to non-geo query
      console.warn('Geo-search failed, falling back to non-geo query:', geoErr.message);
      usedGeo = false;
      const fallbackQuery = { isApproved: true, isActive: true };
      if (service && service !== 'all') {
        fallbackQuery.services = { $in: [service] };
      }
      shops = await Shop.find(fallbackQuery)
        .select('-password')
        .sort({ rating: -1, totalReviews: -1 })
        .skip(skip)
        .limit(limit);
      total = await Shop.countDocuments(fallbackQuery);
    }

    // Calculate distance for each shop (only if geo query succeeded)
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);

    const shopsWithDistance = shops.map(shop => {
      const shopObj = shop.toObject();
      if (shop.location?.coordinates?.length === 2) {
        const [shopLng, shopLat] = shop.location.coordinates;
        shopObj.distance = haversineDistance(userLat, userLng, shopLat, shopLng);
      }
      return shopObj;
    });

    res.json({
      success: true,
      shops: shopsWithDistance,
      geoAvailable: usedGeo,
      pagination: {
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ success: false, error: 'Server error during search' });
  }
});

// GET /api/shops — List all approved shops (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { service, city, page = 1 } = req.query;
    const limit = 20;
    const skip = (parseInt(page) - 1) * limit;

    const query = { isApproved: true, isActive: true };

    if (service && service !== 'all') {
      query.services = { $in: [service] };
    }
    if (city) {
      query['address.city'] = new RegExp(city, 'i');
    }

    const shops = await Shop.find(query)
      .select('-password')
      .sort({ rating: -1, totalReviews: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Shop.countDocuments(query);

    res.json({
      success: true,
      shops,
      pagination: {
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/shops/me — Get logged-in shop's full profile
router.get('/me', protect, async (req, res) => {
  try {
    const shop = await Shop.findById(req.shopId).select('-password');
    if (!shop) return res.status(404).json({ success: false, error: 'Shop not found' });
    res.json({ success: true, shop });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// PUT /api/shops/me — Update logged-in shop's profile
router.put('/me', protect, async (req, res) => {
  try {
    const allowedFields = [
      'businessName', 'ownerName', 'phone', 'whatsappNumber',
      'services', 'address', 'description', 'openingHours'
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    // Handle location update separately
    if (req.body.longitude && req.body.latitude) {
      updates.location = {
        type: 'Point',
        coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
      };
    }

    const shop = await Shop.findByIdAndUpdate(req.shopId, updates, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!shop) return res.status(404).json({ success: false, error: 'Shop not found' });

    res.json({ success: true, shop, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ success: false, error: 'Server error during update' });
  }
});

// POST /api/shops/me/upload — Upload profile or gallery images
router.post('/me/upload', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image file provided' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const { imageType } = req.body; // 'profile' or 'gallery'

    const shop = await Shop.findById(req.shopId);
    if (!shop) return res.status(404).json({ success: false, error: 'Shop not found' });

    if (imageType === 'gallery') {
      shop.galleryImages.push(imageUrl);
    } else {
      shop.profileImage = imageUrl;
    }

    await shop.save();

    res.json({
      success: true,
      imageUrl,
      message: `${imageType === 'gallery' ? 'Gallery' : 'Profile'} image uploaded successfully`
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, error: 'Server error during upload' });
  }
});

// --- Admin routes (before /:id so paths like /admin are not captured as ids) ---

// GET /api/shops/admin/pending — List pending shops (admin)
router.get('/admin/pending', protectUser, requireAdmin, async (req, res) => {
  try {
    const shops = await Shop.find({ isApproved: false })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json({ success: true, shops });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// PUT /api/shops/:id/approve — Admin approve/reject a shop
router.put('/:id/approve', protectUser, requireAdmin, async (req, res) => {
  try {
    const { approved } = req.body;
    const shop = await Shop.findByIdAndUpdate(
      req.params.id,
      { isApproved: approved !== false },
      { new: true }
    ).select('-password');

    if (!shop) return res.status(404).json({ success: false, error: 'Shop not found' });

    res.json({
      success: true,
      shop,
      message: `Shop ${shop.isApproved ? 'approved' : 'rejected'} successfully`
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/shops/admin/stats — Platform-wide KPIs (admin only)
router.get('/admin/stats', protectUser, requireAdmin, async (req, res) => {
  try {
    const [totalShops, approvedShops, pendingShops, suspendedShops, totalLeads, totalReviews, totalCustomers, avgRatingAgg] = await Promise.all([
      Shop.countDocuments(),
      Shop.countDocuments({ isApproved: true, isActive: true }),
      Shop.countDocuments({ isApproved: false }),
      Shop.countDocuments({ isActive: false }),
      Lead.countDocuments(),
      Review.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Shop.aggregate([
        { $match: { isApproved: true, isActive: true, totalReviews: { $gt: 0 } } },
        { $group: { _id: null, avg: { $avg: '$rating' } } },
      ]),
    ]);

    const leadsByStatus = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const statusMap = {};
    leadsByStatus.forEach(s => { statusMap[s._id] = s.count; });

    res.json({
      success: true,
      stats: {
        totalShops,
        approvedShops,
        pendingShops,
        suspendedShops,
        totalLeads,
        totalReviews,
        totalCustomers,
        avgRating: avgRatingAgg[0] ? Math.round(avgRatingAgg[0].avg * 10) / 10 : 0,
        leadsByStatus: statusMap,
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/shops/admin/all — All shops with filters (admin only)
router.get('/admin/all', protectUser, requireAdmin, async (req, res) => {
  try {
    const { status, service, city, search, page = 1 } = req.query;
    const limit = 20;
    const skip = (parseInt(page) - 1) * limit;
    const query = {};

    if (status === 'approved') { query.isApproved = true; query.isActive = true; }
    else if (status === 'pending') { query.isApproved = false; }
    else if (status === 'suspended') { query.isActive = false; }

    if (service && service !== 'all') {
      query.services = { $in: [service] };
    }
    if (city) {
      query['address.city'] = new RegExp(city, 'i');
    }
    if (search) {
      query.$or = [
        { businessName: new RegExp(search, 'i') },
        { ownerName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
      ];
    }

    const shops = await Shop.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Shop.countDocuments(query);

    res.json({
      success: true,
      shops,
      pagination: { page: parseInt(page), totalPages: Math.ceil(total / limit), total },
    });
  } catch (error) {
    console.error('Admin all shops error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// DELETE /api/shops/admin/:id — Admin force-delete a shop (cascades reviews + leads)
router.delete('/admin/:id', protectUser, requireAdmin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, error: 'Invalid shop ID' });
    }
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ success: false, error: 'Shop not found' });

    // Cascade delete reviews and leads
    await Promise.all([
      Review.deleteMany({ shopId: shop._id }),
      Lead.deleteMany({ shopId: shop._id }),
      Shop.findByIdAndDelete(shop._id),
    ]);

    res.json({ success: true, message: `Shop "${shop.businessName}" and all associated data deleted` });
  } catch (error) {
    console.error('Admin delete shop error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/shops/admin/leads — All leads across all shops (admin only)
router.get('/admin/leads', protectUser, requireAdmin, async (req, res) => {
  try {
    const { status, service, page = 1 } = req.query;
    const limit = 30;
    const skip = (parseInt(page) - 1) * limit;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }
    if (service && service !== 'all') {
      query.serviceRequested = service;
    }

    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('shopId', 'businessName email')
      .lean();

    const total = await Lead.countDocuments(query);

    res.json({
      success: true,
      leads,
      pagination: { page: parseInt(page), totalPages: Math.ceil(total / limit), total },
    });
  } catch (error) {
    console.error('Admin leads error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// PUT /api/shops/:id/suspend — Admin toggle shop active/inactive
router.put('/:id/suspend', protectUser, requireAdmin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, error: 'Invalid shop ID' });
    }
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ success: false, error: 'Shop not found' });

    shop.isActive = !shop.isActive;
    await shop.save();

    res.json({
      success: true,
      shop: { _id: shop._id, businessName: shop.businessName, isActive: shop.isActive },
      message: `Shop "${shop.businessName}" ${shop.isActive ? 'reactivated' : 'suspended'} successfully`,
    });
  } catch (error) {
    console.error('Suspend shop error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// DELETE /api/shops/me — Shop owner self-delete (requires password)
router.delete('/me', protect, async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ success: false, error: 'Password is required to delete your account' });
    }

    const shop = await Shop.findById(req.shopId);
    if (!shop) return res.status(404).json({ success: false, error: 'Shop not found' });

    const bcrypt = require('bcryptjs');
    const isMatch = await bcrypt.compare(password, shop.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Incorrect password' });
    }

    // Cascade delete
    await Promise.all([
      Review.deleteMany({ shopId: shop._id }),
      Lead.deleteMany({ shopId: shop._id }),
      Shop.findByIdAndDelete(shop._id),
    ]);

    res.json({ success: true, message: 'Your shop account and all associated data have been permanently deleted' });
  } catch (error) {
    console.error('Shop self-delete error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/shops/me/leads — Leads for logged-in shop
router.get('/me/leads', protect, async (req, res) => {
  try {
    const leads = await Lead.find({ shopId: req.shopId })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();
    res.json({ success: true, leads });
  } catch (error) {
    console.error('Leads list error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// PATCH /api/shops/me/leads/:leadId — Update lead status
router.patch('/me/leads/:leadId', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['new', 'contacted', 'completed', 'cancelled'];
    if (!status || !allowed.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }
    const lead = await Lead.findOne({ _id: req.params.leadId, shopId: req.shopId });
    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }
    lead.status = status;
    await lead.save();
    res.json({ success: true, lead });
  } catch (error) {
    console.error('Lead update error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/shops/me/reviews — Reviews for logged-in shop (owner)
router.get('/me/reviews', protect, async (req, res) => {
  try {
    const reviews = await Review.find({ shopId: req.shopId }).sort({ createdAt: -1 }).limit(100).lean();
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/shops/:id/reviews — Public reviews (must be before GET /:id)
router.get('/:id/reviews', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, error: 'Shop not found' });
    }
    const shop = await Shop.findById(req.params.id).select('isApproved isActive');
    if (!shop || !shop.isApproved || !shop.isActive) {
      return res.status(404).json({ success: false, error: 'Shop not found' });
    }
    const reviews = await Review.find({ shopId: req.params.id }).sort({ createdAt: -1 }).limit(100).lean();
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST /api/shops/:id/reviews — Submit a review
router.post('/:id/reviews', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, error: 'Shop not found' });
    }
    const { reviewerName, rating, comment } = req.body;
    const raw = parseInt(String(rating), 10);
    if (!reviewerName?.trim() || !Number.isFinite(raw) || raw < 1 || raw > 5) {
      return res.status(400).json({ success: false, error: 'Name and rating (1–5) are required' });
    }
    const r = raw;
    const shop = await Shop.findById(req.params.id);
    if (!shop || !shop.isApproved || !shop.isActive) {
      return res.status(404).json({ success: false, error: 'Shop not found' });
    }
    const review = new Review({
      shopId: shop._id,
      reviewerName: reviewerName.trim().slice(0, 80),
      rating: r,
      comment: (comment || '').trim().slice(0, 1500),
    });
    await review.save();
    const agg = await Review.aggregate([
      { $match: { shopId: new mongoose.Types.ObjectId(shop._id) } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    const row = agg[0];
    await Shop.findByIdAndUpdate(shop._id, {
      rating: row ? Math.min(5, Math.round(row.avg * 10) / 10) : 0,
      totalReviews: row ? row.count : 0,
    });
    res.status(201).json({ success: true, review });
  } catch (error) {
    console.error('Review error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/shops/:id — Public shop profile (pending/inactive hidden unless owner)
router.get('/:id', async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).select('-password');
    if (!shop) return res.status(404).json({ success: false, error: 'Shop not found' });

    let isOwner = false;
    const auth = req.headers.authorization;
    if (auth && auth.startsWith('Bearer')) {
      try {
        const token = auth.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        isOwner = decoded.id.toString() === req.params.id;
      } catch {
        /* invalid token — treat as anonymous */
      }
    }

    if ((!shop.isApproved || !shop.isActive) && !isOwner) {
      return res.status(404).json({ success: false, error: 'Shop not found' });
    }

    res.json({ success: true, shop });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});


// Haversine formula to calculate distance between two coordinates (in km)
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Round to 1 decimal
}

module.exports = router;
