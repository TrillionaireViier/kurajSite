// Vercel Serverless Function: Admin Backend API

// Default demo orders for admin management
const DEFAULT_ORDERS = [
  {
    id: "KRJ-9842",
    customerName: "Alexandre Dupont",
    customerEmail: "vip@kuraj.com",
    productName: "1x Patek Philippe Nautilus 5712/1R-001",
    total: 2444,
    date: "2026-11-20",
    status: "Delivered",
    shippingAddress: "12 Avenue Montaigne, Paris, France"
  },
  {
    id: "KRJ-8721",
    customerName: "Dmitri Volkov",
    customerEmail: "dmitri.v@luxury.ch",
    productName: "1x Rolex Daytona Cosmograph Oyster",
    total: 1850,
    date: "2026-11-18",
    status: "Shipped",
    shippingAddress: "Bahnhofstrasse 45, Zurich, Switzerland"
  },
  {
    id: "KRJ-7650",
    customerName: "Elena Rostova",
    customerEmail: "elena.r@fashion.mc",
    productName: "1x Cartier Santos de Cartier Gold Skeleton",
    total: 1290,
    date: "2026-11-22",
    status: "Processing",
    shippingAddress: "Boulevard des Moulins, Monte Carlo, Monaco"
  },
  {
    id: "KRJ-6541",
    customerName: "Marcus Sterling",
    customerEmail: "m.sterling@mayfair.co.uk",
    productName: "1x Audemars Piguet Royal Oak Double Balance",
    total: 3100,
    date: "2026-11-23",
    status: "Pending",
    shippingAddress: "Berkeley Square, Mayfair, London, UK"
  }
];

const DEFAULT_USERS = [
  {
    id: "usr_vip_demo",
    name: "VIP Member",
    email: "vip@kuraj.com",
    role: "user",
    vipTier: "Black Diamond VIP",
    discount: "90% Off",
    joinedDate: "2026-01-15",
    totalSpent: 4294,
    orderCount: 2
  },
  {
    id: "usr_2",
    name: "Dmitri Volkov",
    email: "dmitri.v@luxury.ch",
    role: "user",
    vipTier: "Platinum VIP",
    discount: "90% Off",
    joinedDate: "2026-02-01",
    totalSpent: 1850,
    orderCount: 1
  },
  {
    id: "usr_3",
    name: "Elena Rostova",
    email: "elena.r@fashion.mc",
    role: "user",
    vipTier: "Gold VIP",
    discount: "90% Off",
    joinedDate: "2026-03-12",
    totalSpent: 1290,
    orderCount: 1
  }
];

function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch(e) { return {}; }
  }
  return {};
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  const body = parseBody(req);
  const action = req.query.action || body.action || 'overview';

  // Verify Admin authorization
  const isAdminToken = token.startsWith('token_adm_') || body.adminPassword === 'admin123' || body.adminPassword === 'admin' || req.query.key === 'admin123';

  if (!isAdminToken && action !== 'public-stats') {
    return res.status(403).json({
      success: false,
      message: "Access denied. Administrator privileges required."
    });
  }

  try {
    // 1. STATS OVERVIEW & DATA
    if (action === 'overview' || action === 'data') {
      const clientOrders = (body.clientOrders || []);
      const mergedOrders = [...clientOrders, ...DEFAULT_ORDERS.filter(o => !clientOrders.some(co => co.id === o.id))];

      const clientUsers = (body.clientUsers || []);
      const mergedUsers = [...clientUsers, ...DEFAULT_USERS.filter(u => !clientUsers.some(cu => cu.email === u.email))];

      const totalRevenue = mergedOrders.reduce((sum, ord) => sum + (Number(ord.total) || 0), 0);
      const pendingCount = mergedOrders.filter(o => o.status === 'Pending').length;

      return res.status(200).json({
        success: true,
        stats: {
          totalRevenue: totalRevenue,
          totalOrders: mergedOrders.length,
          pendingOrders: pendingCount,
          totalVIPUsers: mergedUsers.length + 1420, // + simulated exclusive club membership base
          activeProducts: 54
        },
        orders: mergedOrders,
        users: mergedUsers
      });
    }

    // 2. UPDATE ORDER STATUS
    if (action === 'update_order_status') {
      const { orderId, newStatus } = body;
      if (!orderId || !newStatus) {
        return res.status(400).json({ success: false, message: "orderId and newStatus required" });
      }

      return res.status(200).json({
        success: true,
        message: `Order ${orderId} status successfully updated to ${newStatus}`,
        orderId: orderId,
        newStatus: newStatus,
        updatedAt: new Date().toISOString()
      });
    }

    // 3. DELETE / CANCEL ORDER
    if (action === 'cancel_order') {
      const { orderId } = body;
      return res.status(200).json({
        success: true,
        message: `Order ${orderId} has been cancelled.`,
        orderId: orderId
      });
    }

    return res.status(400).json({ success: false, message: "Unknown admin action" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
