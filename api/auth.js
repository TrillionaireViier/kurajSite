// Vercel Serverless Function: Authentication API for Admin and Users

// In-memory store for demo / serverless session context
const ADMIN_CREDENTIALS = {
  email: "admin@kuraj.com",
  username: "admin",
  passwords: ["admin123", "admin", "kuraj2026", "Admin123!"]
};

// Seed demo VIP user
const SEED_USERS = [
  {
    id: "usr_vip_demo",
    name: "VIP Member",
    email: "vip@kuraj.com",
    password: "vip123",
    role: "user",
    vipTier: "Black Diamond VIP",
    discount: "90% Off",
    balance: 250,
    referralCode: "KURAJ-VIP90",
    joinedDate: "2026-01-15",
    purchases: [
      {
        id: "ORD-9842",
        name: "Patek Philippe Nautilus 5712/1R-001",
        price: 2444,
        date: "2026-11-20",
        status: "Delivered",
        trackingNumber: "KRJ-9842-DHL"
      },
      {
        id: "ORD-8721",
        name: "Rolex Daytona Cosmograph Oyster",
        price: 1850,
        date: "2026-11-10",
        status: "Processing",
        trackingNumber: "KRJ-8721-FDX"
      }
    ]
  }
];

// Helper to parse JSON body safely
function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch(e) { return {}; }
  }
  return {};
}

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const queryAction = req.query.action;
  const body = parseBody(req);
  const action = queryAction || body.action || 'login';

  try {
    // 1. ADMIN OR USER LOGIN
    if (action === 'login' || (req.method === 'POST' && !queryAction && body.email)) {
      const email = (body.email || '').trim().toLowerCase();
      const password = (body.password || '').trim();

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email/username and password are required."
        });
      }

      // Check Admin Login
      if (
        (email === ADMIN_CREDENTIALS.email || email === ADMIN_CREDENTIALS.username) &&
        ADMIN_CREDENTIALS.passwords.includes(password)
      ) {
        const adminUser = {
          id: "admin_master",
          name: "Kuraj Administrator",
          email: "admin@kuraj.com",
          role: "admin",
          token: "token_adm_" + Buffer.from(Date.now() + ":admin").toString('base64'),
          permissions: ["all", "orders", "users", "inventory", "settings"]
        };

        return res.status(200).json({
          success: true,
          message: "Admin authentication successful",
          role: "admin",
          token: adminUser.token,
          user: adminUser
        });
      }

      // Check Demo VIP User
      const seedUser = SEED_USERS.find(u => u.email.toLowerCase() === email);
      if (seedUser && (seedUser.password === password || password === 'vip123' || password === 'password123')) {
        const { password: _, ...userSafe } = seedUser;
        const token = "token_usr_" + Buffer.from(Date.now() + ":" + seedUser.email).toString('base64');
        return res.status(200).json({
          success: true,
          message: "VIP member login successful",
          role: "user",
          token: token,
          user: userSafe
        });
      }

      // Allow dynamically registered users passed in request
      if (body.usersPool && Array.isArray(body.usersPool)) {
        const found = body.usersPool.find(u => u.email && u.email.toLowerCase() === email);
        if (found && found.password === password) {
          const { password: _, ...userSafe } = found;
          const token = "token_usr_" + Buffer.from(Date.now() + ":" + found.email).toString('base64');
          return res.status(200).json({
            success: true,
            message: "User login successful",
            role: found.role || "user",
            token: token,
            user: userSafe
          });
        }
      }

      // If user registered on client and passes credentials
      if (password.length >= 4) {
        // Fallback for custom user sign in
        const newUser = {
          id: "usr_" + Date.now().toString(36),
          name: body.name || email.split('@')[0],
          email: email,
          role: "user",
          vipTier: "Exclusive VIP Member",
          discount: "90% Off",
          balance: 100,
          referralCode: "KRJ-" + Math.random().toString(36).substring(2, 7).toUpperCase(),
          joinedDate: new Date().toISOString().split('T')[0],
          purchases: []
        };
        const token = "token_usr_" + Buffer.from(Date.now() + ":" + email).toString('base64');

        return res.status(200).json({
          success: true,
          message: "Signed in successfully",
          role: "user",
          token: token,
          user: newUser
        });
      }

      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    // 2. USER REGISTRATION
    if (action === 'register') {
      const email = (body.email || '').trim().toLowerCase();
      const password = (body.password || '').trim();
      const name = (body.name || '').trim();

      if (!email || !password || !name) {
        return res.status(400).json({
          success: false,
          message: "Name, email, and password are required."
        });
      }

      if (password.length < 4) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 4 characters long."
        });
      }

      // Check if trying to register as admin
      if (email === ADMIN_CREDENTIALS.email || email === ADMIN_CREDENTIALS.username) {
        return res.status(400).json({
          success: false,
          message: "Reserved system address. Please log in as admin."
        });
      }

      const newUser = {
        id: "usr_" + Date.now().toString(36),
        name: name,
        email: email,
        password: password, // kept for client-side storage sync
        role: "user",
        vipTier: "VIP Black Diamond",
        discount: "90% Off VIP",
        balance: 200, // $200 welcome bonus
        referralCode: "KURAJ-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        joinedDate: new Date().toISOString().split('T')[0],
        purchases: []
      };

      const token = "token_usr_" + Buffer.from(Date.now() + ":" + email).toString('base64');
      const { password: _, ...userSafe } = newUser;

      return res.status(201).json({
        success: true,
        message: "Account created successfully! Welcome to Kuraj VIP Club.",
        role: "user",
        token: token,
        user: userSafe,
        initialBonus: 200
      });
    }

    // 3. TOKEN / SESSION VERIFY
    if (action === 'verify') {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.replace(/^Bearer\s+/i, '') || body.token || req.query.token;

      if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
      }

      if (token.startsWith('token_adm_')) {
        return res.status(200).json({
          success: true,
          role: "admin",
          user: {
            id: "admin_master",
            name: "Kuraj Administrator",
            email: "admin@kuraj.com",
            role: "admin"
          }
        });
      }

      return res.status(200).json({
        success: true,
        role: "user",
        message: "Session is valid"
      });
    }

    // Unknown action
    return res.status(400).json({
      success: false,
      message: "Unsupported auth action: " + action
    });

  } catch (err) {
    console.error("Auth error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + err.message
    });
  }
};
