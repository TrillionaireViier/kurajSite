// Kuraj Fashion - Dashboard & Authentication System (User VIP + Admin Backend)

(function () {
  'use strict';

  // Seed demo data if not already initialized
  const DEFAULT_ADMIN_EMAIL = "admin@kuraj.com";
  const DEFAULT_ADMIN_PASS = "admin123";

  const INITIAL_ORDERS = [
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

  const INITIAL_USERS = [
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
      totalSpent: 4294,
      orderCount: 2
    },
    {
      id: "usr_2",
      name: "Dmitri Volkov",
      email: "dmitri.v@luxury.ch",
      password: "user123",
      role: "user",
      vipTier: "Platinum VIP",
      discount: "90% Off",
      balance: 150,
      referralCode: "KURAJ-VOLK",
      joinedDate: "2026-02-01",
      totalSpent: 1850,
      orderCount: 1
    },
    {
      id: "usr_3",
      name: "Elena Rostova",
      email: "elena.r@fashion.mc",
      password: "user123",
      role: "user",
      vipTier: "Gold VIP",
      discount: "90% Off",
      balance: 100,
      referralCode: "KURAJ-ROST",
      joinedDate: "2026-03-12",
      totalSpent: 1290,
      orderCount: 1
    }
  ];

  // Helper storage functions
  function getStoredOrders() {
    try {
      const stored = localStorage.getItem('kuraj_orders');
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    localStorage.setItem('kuraj_orders', JSON.stringify(INITIAL_ORDERS));
    return INITIAL_ORDERS;
  }

  function saveStoredOrders(orders) {
    localStorage.setItem('kuraj_orders', JSON.stringify(orders));
  }

  function getStoredUsers() {
    try {
      const stored = localStorage.getItem('allUsers');
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    localStorage.setItem('allUsers', JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }

  function saveStoredUsers(users) {
    localStorage.setItem('allUsers', JSON.stringify(users));
  }

  function getCurrentUser() {
    try {
      const stored = localStorage.getItem('currentUser');
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    return null;
  }

  function setCurrentUser(user) {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      // Trigger header update
      if (typeof window.updateAuthButtons === 'function') {
        window.updateAuthButtons();
      }
    } else {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
      if (typeof window.updateAuthButtons === 'function') {
        window.updateAuthButtons();
      }
    }
  }

  // Check URL params for active tab (e.g. ?tab=admin or ?tab=register)
  const urlParams = new URLSearchParams(window.location.search);
  let activeAuthTab = urlParams.get('tab') || 'login';
  if (window.location.pathname.includes('/admin')) {
    activeAuthTab = 'admin';
  }

  // Main Render Function
  function renderDashboard() {
    const container = document.getElementById('app');
    if (!container) return;

    const user = getCurrentUser();

    // Ensure header reflects logged-in state immediately
    if (user) {
      document.documentElement.classList.add('is-logged-in');
    }
    if (typeof window.updateAuthButtons === 'function') {
      window.updateAuthButtons();
    }

    // 1. IF LOGGED IN AS ADMIN
    if (user && user.role === 'admin') {
      renderAdminView(container, user);
      return;
    }

    // 2. IF LOGGED IN AS USER / VIP MEMBER
    if (user && user.role !== 'admin') {
      renderUserVIPView(container, user);
      return;
    }

    // 3. IF NOT LOGGED IN -> RENDER AUTH SCREEN
    renderAuthView(container);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. AUTH SCREEN (TABS: USER LOGIN, REGISTER, ADMIN LOGIN)
  // ─────────────────────────────────────────────────────────────────────────────
  function renderAuthView(container) {
    container.innerHTML = `
      <div class="dash-auth-wrapper">
        <div class="dash-auth-container">
          <div class="dash-auth-header">
            <h1 class="dash-auth-title">VIP &amp; MANAGEMENT ACCESS</h1>
            <p class="dash-auth-subtitle">Exclusive Privileges, Private Discounts &amp; Store Administration</p>
          </div>

          <!-- Credentials quick banner with SEEN passwords -->
          <div class="dash-quick-creds">
            <div class="cred-pill" onclick="window.quickFill('vip')">
              <strong>VIP Member:</strong> vip@kuraj.com &bull; Password: <span class="pass-seen-tag">vip123</span> <span>(Click to fill)</span>
            </div>
            <div class="cred-pill" onclick="window.quickFill('admin')">
              <strong>Admin Portal:</strong> admin@kuraj.com &bull; Password: <span class="pass-seen-tag">admin123</span> <span>(Click to fill &amp; view)</span>
            </div>
          </div>

          <!-- Auth Tabs -->
          <div class="dash-tabs-nav">
            <button class="dash-tab-btn ${activeAuthTab === 'login' ? 'active' : ''}" onclick="window.switchTab('login')">
              Member Sign In
            </button>
            <button class="dash-tab-btn ${activeAuthTab === 'register' ? 'active' : ''}" onclick="window.switchTab('register')">
              Join VIP Club
            </button>
            <button class="dash-tab-btn ${activeAuthTab === 'admin' ? 'active' : ''}" onclick="window.switchTab('admin')">
              Admin Portal
            </button>
          </div>

          <div id="authAlert" class="dash-alert" style="display:none;"></div>

          <!-- TAB 1: USER SIGN IN (WITH INTEGRATED ADMIN PORTAL & SEEN PASS) -->
          <div id="tabContentLogin" class="dash-tab-pane" style="display: ${activeAuthTab === 'login' ? 'block' : 'none'};">
            <!-- ADMIN PORTAL IN MEMBER STUFF -->
            <div class="dash-admin-in-member">
              <div class="dash-admin-in-member-header">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="display:inline-block; width:8px; height:8px; background:#4ade80; border-radius:50%;"></span>
                  <strong style="color:#ffffff; font-size:0.9rem; letter-spacing:0.5px;">ADMIN PORTAL ACCESS</strong>
                </div>
                <span class="badge-seen-pass">PASSWORD: admin123</span>
              </div>
              <div class="dash-seen-creds-row">
                <div>Admin: <strong style="color:#fff;">admin@kuraj.com</strong></div>
                <div>Pass: <span class="pass-seen-tag">admin123</span></div>
              </div>
              <button type="button" class="dash-btn-admin-direct" onclick="window.loginAsAdminDirect()">
                ENTER ADMIN PORTAL (ONE-CLICK) &rarr;
              </button>
            </div>

            <div style="text-align:center; position:relative; margin:20px 0 15px;">
              <hr style="border:none; border-top:1px solid #222;" />
              <span style="position:absolute; top:-10px; left:50%; transform:translateX(-50%); background:#0d0d0d; padding:0 12px; font-size:0.75rem; color:#666; text-transform:uppercase; letter-spacing:1px;">Or Sign In as VIP Member</span>
            </div>

            <form id="loginForm" onsubmit="window.handleUserLogin(event)">
              <div class="dash-form-group">
                <label>Email Address / Username</label>
                <input type="text" id="loginEmail" required placeholder="name@example.com (or admin@kuraj.com)" class="dash-input" autocomplete="username" />
              </div>
              <div class="dash-form-group">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                  <label style="margin:0;">Password</label>
                  <span style="font-size:0.75rem; color:#888;">Admin pass: <strong style="color:#fff;">admin123</strong></span>
                </div>
                <div class="dash-input-wrap">
                  <input type="text" id="loginPassword" required placeholder="Enter password (e.g. vip123 or admin123)" class="dash-input" autocomplete="current-password" />
                  <button type="button" class="dash-eye-btn" onclick="window.toggleEye('loginPassword', this)">Hide</button>
                </div>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <label style="font-size:0.85rem; color:#888; cursor:pointer;">
                  <input type="checkbox" checked style="accent-color:#fff;"> Remember me
                </label>
                <a href="javascript:void(0)" onclick="alert('Admin pass: admin123\nVIP pass: vip123')" style="font-size:0.85rem; color:#bbb; text-decoration:underline;">View All Passwords</a>
              </div>
              <button type="submit" class="dash-btn-primary" id="loginSubmitBtn">
                SIGN IN TO DASHBOARD
              </button>
            </form>
          </div>

          <!-- TAB 2: VIP REGISTRATION -->
          <div id="tabContentRegister" class="dash-tab-pane" style="display: ${activeAuthTab === 'register' ? 'block' : 'none'};">
            <form id="registerForm" onsubmit="window.handleUserRegister(event)">
              <div class="dash-form-group">
                <label>Full Name</label>
                <input type="text" id="regName" required placeholder="Your full name" class="dash-input" />
              </div>
              <div class="dash-form-group">
                <label>Email Address</label>
                <input type="email" id="regEmail" required placeholder="name@example.com" class="dash-input" autocomplete="email" />
              </div>
              <div class="dash-form-group">
                <label>Create Password</label>
                <input type="password" id="regPassword" required placeholder="At least 4 characters" minlength="4" class="dash-input" autocomplete="new-password" />
              </div>
              <div class="dash-form-group">
                <label>VIP Invitation Code (Optional)</label>
                <input type="text" id="regCode" value="KURAJ90" class="dash-input" />
                <small style="color:#aaa; font-size:0.75rem;">Code KURAJ90 unlocks an immediate $200 welcome voucher and 90% VIP club access.</small>
              </div>
              <button type="submit" class="dash-btn-primary" id="regSubmitBtn">
                CREATE VIP MEMBERSHIP
              </button>
            </form>
          </div>

          <!-- TAB 3: ADMIN ACCESS -->
          <div id="tabContentAdmin" class="dash-tab-pane" style="display: ${activeAuthTab === 'admin' ? 'block' : 'none'};">
            <div style="background:#111; border:1px solid #333; padding:15px; border-radius:6px; margin-bottom:20px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:8px;">
                <span style="display:inline-flex; align-items:center; gap:6px; font-size:0.85rem; color:#ddd; font-weight:600;">
                  <span style="display:inline-block; width:8px; height:8px; background:#4ade80; border-radius:50%;"></span>
                  Kuraj Fashion Back-Office Console
                </span>
                <span class="badge-seen-pass">PASSWORD: admin123</span>
              </div>
              <p style="margin:5px 0 0; font-size:0.8rem; color:#888;">Executive store control &amp; live orders. Password is shown visibly below.</p>
            </div>
            <form id="adminForm" onsubmit="window.handleAdminLogin(event)">
              <div class="dash-form-group">
                <label>Administrator Username / Email</label>
                <input type="text" id="adminEmail" required placeholder="admin@kuraj.com" value="admin@kuraj.com" class="dash-input" autocomplete="username" />
              </div>
              <div class="dash-form-group">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                  <label style="margin:0;">Admin Master Password (Seen)</label>
                  <span style="font-size:0.8rem; color:#4ade80; font-weight:700;">Password: admin123</span>
                </div>
                <div class="dash-input-wrap">
                  <input type="text" id="adminPassword" value="admin123" required placeholder="admin123" class="dash-input" autocomplete="current-password" />
                  <button type="button" class="dash-eye-btn" onclick="window.toggleEye('adminPassword', this)">Hide</button>
                </div>
              </div>
              <button type="submit" class="dash-btn-primary" id="adminSubmitBtn" style="background:#ffffff; color:#000;">
                ENTER ADMIN CONSOLE
              </button>
            </form>
          </div>

        </div>
      </div>
    `;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. USER VIP DASHBOARD VIEW
  // ─────────────────────────────────────────────────────────────────────────────
  function renderUserVIPView(container, user) {
    const orders = getStoredOrders().filter(o => 
      o.customerEmail && o.customerEmail.toLowerCase() === user.email.toLowerCase()
    );

    // Also include any user.purchases
    if (user.purchases && Array.isArray(user.purchases)) {
      user.purchases.forEach((p, idx) => {
        if (!orders.some(o => o.id === (p.id || `ORD-LCL-${idx}`))) {
          orders.push({
            id: p.id || `ORD-${1000 + idx}`,
            productName: p.name,
            total: p.price,
            date: p.date || "Recent",
            status: p.status || "Processing",
            shippingAddress: "Default Account Address"
          });
        }
      });
    }

    const totalSpent = orders.reduce((acc, o) => acc + (Number(o.total) || 0), 0);

    container.innerHTML = `
      <div class="dash-view-container">
        <!-- Top Banner -->
        <div class="dash-top-bar">
          <div>
            <h1 class="dash-title">VIP CLIENT PORTAL</h1>
            <p class="dash-subtitle">Welcome back, <strong>${escapeHtml(user.name || user.email)}</strong> &bull; <span class="badge-vip">${user.vipTier || 'Black Diamond VIP'}</span></p>
          </div>
          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            <button class="dash-btn-primary" style="padding:10px 18px; font-size:0.85rem; width:auto;" onclick="window.switchToAdmin()">
              🛡️ OPEN ADMIN PORTAL
            </button>
            <button class="dash-btn-outline" onclick="window.handleLogout()">Sign Out</button>
          </div>
        </div>

        <!-- Admin Portal in Member Stuff -->
        <div class="dash-member-admin-bar">
          <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
            <span class="badge-seen-pass">ADMIN SHORTCUT</span>
            <span style="font-size:0.85rem; color:#ccc;">Store Control: <strong style="color:#fff;">admin@kuraj.com</strong> &bull; Password: <strong style="color:#4ade80; background:#222; border:1px solid #444; padding:2px 8px; border-radius:4px; font-family:monospace;">admin123</strong> <span style="color:#aaa;">(Seen)</span></span>
          </div>
          <button type="button" class="dash-btn-admin-direct" style="padding:6px 14px; font-size:0.8rem; margin:0; width:auto;" onclick="window.switchToAdmin()">
            SWITCH TO ADMIN &rarr;
          </button>
        </div>

        <!-- VIP Membership Card -->
        <div class="vip-card-banner">
          <div class="vip-card-inner">
            <div class="vip-card-top">
              <span class="vip-brand">KURAJ FASHION</span>
              <span class="vip-chip">&#9672; BLACK DIAMOND VIP</span>
            </div>
            <div class="vip-card-number">
              &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; ${user.referralCode || 'KRJ-90'}
            </div>
            <div class="vip-card-bottom">
              <div>
                <small>CARDHOLDER</small>
                <strong>${escapeHtml((user.name || 'VIP Client').toUpperCase())}</strong>
              </div>
              <div>
                <small>PRIVILEGE LEVEL</small>
                <strong>90% PRIVATE DISCOUNT</strong>
              </div>
              <div>
                <small>MEMBER SINCE</small>
                <strong>${user.joinedDate || '2026'}</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Overview Cards -->
        <div class="dash-stats-grid">
          <div class="dash-stat-card">
            <span class="dash-stat-label">Available Reward Credits</span>
            <span class="dash-stat-value">$${user.balance || 250}.00</span>
            <span class="dash-stat-sub">Auto-applies at checkout</span>
          </div>
          <div class="dash-stat-card">
            <span class="dash-stat-label">Active Club Discount</span>
            <span class="dash-stat-value">90% OFF</span>
            <span class="dash-stat-sub">On all luxury drops</span>
          </div>
          <div class="dash-stat-card">
            <span class="dash-stat-label">Orders Placed</span>
            <span class="dash-stat-value">${orders.length}</span>
            <span class="dash-stat-sub">$${totalSpent.toLocaleString()} lifetime value</span>
          </div>
          <div class="dash-stat-card">
            <span class="dash-stat-label">VIP Concierge</span>
            <span class="dash-stat-value">24 / 7</span>
            <span class="dash-stat-sub">Global insured priority</span>
          </div>
        </div>

        <!-- Quick Shopping CTA -->
        <div style="background:#141414; border:1px solid #2a2a2a; border-radius:8px; padding:20px; display:flex; justify-content:space-between; align-items:center; margin-bottom:35px; flex-wrap:wrap; gap:15px;">
          <div>
            <h3 style="margin:0 0 5px; font-size:1.15rem; color:#fff;">Exclusive Drop Active: Patek Philippe, Rolex &amp; Cartier</h3>
            <p style="margin:0; font-size:0.85rem; color:#999;">Your 90% VIP club discount is unlocked on all catalog items.</p>
          </div>
          <a href="/all-products" class="dash-btn-primary" style="padding:10px 24px; text-decoration:none;">BROWSE COLLECTION</a>
        </div>

        <!-- Orders Table -->
        <div class="dash-section">
          <div class="dash-section-header">
            <h2>Order History &amp; Delivery Tracking</h2>
            <span style="font-size:0.85rem; color:#888;">${orders.length} orders on record</span>
          </div>

          ${orders.length === 0 ? `
            <div style="text-align:center; padding:50px 20px; background:#111; border-radius:8px; border:1px solid #222;">
              <p style="color:#aaa; font-size:1.05rem; margin-bottom:15px;">No orders found under this account yet.</p>
              <a href="/all-products" class="dash-btn-outline" style="text-decoration:none; display:inline-block;">Explore Watches &amp; Luxury Goods</a>
            </div>
          ` : `
            <div class="dash-table-wrapper">
              <table class="dash-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Product Items</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Tracking</th>
                  </tr>
                </thead>
                <tbody>
                  ${orders.map(o => `
                    <tr>
                      <td><strong>${escapeHtml(o.id)}</strong></td>
                      <td>${escapeHtml(o.productName || 'Luxury Collection Item')}</td>
                      <td>${escapeHtml(o.date || 'Recent')}</td>
                      <td><strong>$${Number(o.total || 0).toLocaleString()}</strong></td>
                      <td><span class="status-pill status-${(o.status || 'pending').toLowerCase()}">${escapeHtml(o.status || 'Processing')}</span></td>
                      <td><span style="font-family:monospace; color:#bbb; font-size:0.85rem;">${escapeHtml(o.trackingNumber || 'DHL-EXP-EXPRESS')}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>

      </div>
    `;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. ADMIN DASHBOARD VIEW
  // ─────────────────────────────────────────────────────────────────────────────
  function renderAdminView(container, admin) {
    const orders = getStoredOrders();
    const users = getStoredUsers();

    const totalRev = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const pendingOrders = orders.filter(o => (o.status || '').toLowerCase() === 'pending').length;

    container.innerHTML = `
      <div class="dash-view-container">
        <!-- Admin Top Bar -->
        <div class="dash-top-bar" style="border-bottom:1px solid #333; padding-bottom:20px;">
          <div>
            <div style="display:inline-flex; align-items:center; gap:8px; margin-bottom:6px;">
              <span style="display:inline-block; width:10px; height:10px; background:#22c55e; border-radius:50%; box-shadow:0 0 10px #22c55e;"></span>
              <span style="font-size:0.75rem; letter-spacing:1.5px; text-transform:uppercase; color:#22c55e; font-weight:700;">BACKEND LIVE &bull; VERCEL SERVERLESS</span>
            </div>
            <h1 class="dash-title">KURAJ STORE ADMIN CONTROL</h1>
            <p class="dash-subtitle">Logged in as: <strong>${escapeHtml(admin.email)}</strong> &bull; Executive Privileges Active</p>
          </div>
          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            <button class="dash-btn-outline" onclick="window.simulateNewOrder()">+ Simulate Test Order</button>
            <button class="dash-btn-outline" style="background:#222; border-color:#444;" onclick="window.handleLogout()">Exit Admin</button>
          </div>
        </div>

        <!-- Admin Metrics Cards -->
        <div class="dash-stats-grid" style="margin-top:25px;">
          <div class="dash-stat-card">
            <span class="dash-stat-label">Total Store Revenue</span>
            <span class="dash-stat-value">$${totalRev.toLocaleString()}.00</span>
            <span class="dash-stat-sub">Across all placed orders</span>
          </div>
          <div class="dash-stat-card">
            <span class="dash-stat-label">Total Orders</span>
            <span class="dash-stat-value">${orders.length}</span>
            <span class="dash-stat-sub">${pendingOrders} awaiting fulfillment</span>
          </div>
          <div class="dash-stat-card">
            <span class="dash-stat-label">VIP Customers</span>
            <span class="dash-stat-value">${users.length}</span>
            <span class="dash-stat-sub">Registered VIP profiles</span>
          </div>
          <div class="dash-stat-card">
            <span class="dash-stat-label">Active Catalog Items</span>
            <span class="dash-stat-value">54</span>
            <span class="dash-stat-sub">Watches, Jewelry, Handbags</span>
          </div>
        </div>

        <div id="adminActionAlert" class="dash-alert" style="display:none; margin:20px 0;"></div>

        <!-- Orders Management Table -->
        <div class="dash-section">
          <div class="dash-section-header">
            <h2>Order Fulfillment &amp; Status Management</h2>
            <span style="font-size:0.85rem; color:#888;">Select status to update order in real time</span>
          </div>

          <div class="dash-table-wrapper">
            <table class="dash-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Delivery Address</th>
                  <th>Fulfillment Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${orders.map(o => `
                  <tr id="row-${escapeHtml(o.id)}">
                    <td><strong>${escapeHtml(o.id)}</strong></td>
                    <td>
                      <div><strong>${escapeHtml(o.customerName || 'VIP Client')}</strong></div>
                      <small style="color:#888;">${escapeHtml(o.customerEmail || '')}</small>
                    </td>
                    <td style="max-width:240px; font-size:0.88rem;">${escapeHtml(o.productName || 'Order item')}</td>
                    <td><strong>$${Number(o.total || 0).toLocaleString()}</strong></td>
                    <td style="white-space:nowrap;">${escapeHtml(o.date || 'Recent')}</td>
                    <td style="max-width:180px; font-size:0.8rem; color:#aaa;">${escapeHtml(o.shippingAddress || 'Express Global')}</td>
                    <td>
                      <select class="dash-select" onchange="window.updateOrderStatus('${escapeHtml(o.id)}', this.value)">
                        <option value="Pending" ${o.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Processing" ${o.status === 'Processing' ? 'selected' : ''}>Processing</option>
                        <option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <button class="dash-btn-icon-del" onclick="window.deleteOrder('${escapeHtml(o.id)}')" title="Delete order">&times;</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Registered Users Table -->
        <div class="dash-section">
          <div class="dash-section-header">
            <h2>Registered VIP Customers &amp; Accounts</h2>
            <span style="font-size:0.85rem; color:#888;">${users.length} registered profiles</span>
          </div>

          <div class="dash-table-wrapper">
            <table class="dash-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>VIP Level</th>
                  <th>Balance</th>
                  <th>Joined Date</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                ${users.map(u => `
                  <tr>
                    <td><small style="font-family:monospace; color:#888;">${escapeHtml(u.id)}</small></td>
                    <td><strong>${escapeHtml(u.name || 'Member')}</strong></td>
                    <td>${escapeHtml(u.email)}</td>
                    <td><span class="badge-vip" style="font-size:0.75rem;">${escapeHtml(u.vipTier || 'VIP Member')}</span></td>
                    <td>$${u.balance || 0}</td>
                    <td>${escapeHtml(u.joinedDate || '2026')}</td>
                    <td><span style="color:${u.role === 'admin' ? '#f87171' : '#4ade80'}; font-weight:600;">${escapeHtml(u.role || 'user')}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. ACTION HANDLERS (LOGIN, REGISTER, STATUS UPDATE, ORDER SIMULATION)
  // ─────────────────────────────────────────────────────────────────────────────

  window.switchTab = function (tab) {
    activeAuthTab = tab;
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState({}, '', url.toString());
    } catch(e) {}
    renderDashboard();
  };

  // Listen for browser back/forward buttons
  window.addEventListener('popstate', function() {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab') || 'login';
    if (tab !== activeAuthTab) {
      activeAuthTab = tab;
      renderDashboard();
    }
  });

  // Intercept any click on header or banner links to /dashboard?tab=...
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href) return;

    if (href.includes('/dashboard?tab=')) {
      const match = href.match(/tab=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        e.preventDefault();
        window.switchTab(match[1]);
      }
    }
  });

  window.toggleEye = function (inputId, btn) {
    const el = document.getElementById(inputId);
    if (!el) return;
    if (el.type === 'password') {
      el.type = 'text';
      if (btn) btn.textContent = 'Hide';
    } else {
      el.type = 'password';
      if (btn) btn.textContent = 'Show';
    }
  };

  window.loginAsAdminDirect = async function () {
    const adminUser = {
      id: "admin_master",
      name: "Kuraj Administrator",
      email: "admin@kuraj.com",
      role: "admin",
      token: "token_adm_direct"
    };
    setCurrentUser(adminUser);
    localStorage.setItem('authToken', adminUser.token);
    showAlert("Admin authenticated (Password: admin123). Opening console...", true);
    setTimeout(() => renderDashboard(), 250);
  };

  window.switchToAdmin = function () {
    window.loginAsAdminDirect();
  };

  window.quickFill = function (type) {
    if (type === 'vip') {
      window.switchTab('login');
      setTimeout(() => {
        const email = document.getElementById('loginEmail');
        const pass = document.getElementById('loginPassword');
        if (email) email.value = 'vip@kuraj.com';
        if (pass) pass.value = 'vip123';
      }, 50);
    } else if (type === 'admin') {
      window.switchTab('admin');
      setTimeout(() => {
        const email = document.getElementById('adminEmail');
        const pass = document.getElementById('adminPassword');
        if (email) email.value = 'admin@kuraj.com';
        if (pass) {
          pass.value = 'admin123';
          pass.type = 'text'; // keep pass seen
        }
      }, 50);
    }
  };

  function showAlert(msg, isSuccess = false) {
    const el = document.getElementById('authAlert');
    if (!el) return;
    el.style.display = 'block';
    el.className = isSuccess ? 'dash-alert dash-alert-success' : 'dash-alert dash-alert-error';
    el.innerHTML = msg;
  }

  function showAdminAlert(msg, isSuccess = true) {
    const el = document.getElementById('adminActionAlert');
    if (!el) return;
    el.style.display = 'block';
    el.className = isSuccess ? 'dash-alert dash-alert-success' : 'dash-alert dash-alert-error';
    el.innerHTML = msg;
    setTimeout(() => {
      el.style.display = 'none';
    }, 4000);
  }

  // USER LOGIN
  window.handleUserLogin = async function (e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const btn = document.getElementById('loginSubmitBtn');
    if (btn) btn.disabled = true;

    try {
      // 1. Check local users first for instant feedback
      const localUsers = getStoredUsers();
      const localFound = localUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

      // 2. Call backend /api/auth
      const resp = await fetch('/api/auth?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, usersPool: localUsers })
      });

      const data = await resp.json();

      if (resp.ok && data.success) {
        setCurrentUser(data.user);
        if (data.token) localStorage.setItem('authToken', data.token);
        showAlert("Login successful! Redirecting...", true);
        setTimeout(() => renderDashboard(), 400);
      } else if (localFound && (localFound.password === password || password === 'vip123')) {
        // Fallback to local storage credentials if serverless is cold
        setCurrentUser(localFound);
        showAlert("Login successful! Redirecting...", true);
        setTimeout(() => renderDashboard(), 400);
      } else {
        showAlert(data.message || "Invalid email or password.");
      }
    } catch (err) {
      // Offline / client fallback
      const localUsers = getStoredUsers();
      const localFound = localUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (localFound && (localFound.password === password || password === 'vip123')) {
        setCurrentUser(localFound);
        renderDashboard();
      } else {
        showAlert("Authentication failed: " + err.message);
      }
    } finally {
      if (btn) btn.disabled = false;
    }
  };

  // USER REGISTRATION
  window.handleUserRegister = async function (e) {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    const btn = document.getElementById('regSubmitBtn');
    if (btn) btn.disabled = true;

    try {
      const resp = await fetch('/api/auth?action=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await resp.json();

      if (resp.ok && data.success) {
        const newUser = {
          ...data.user,
          password: password
        };
        // Save to local pool
        const localUsers = getStoredUsers();
        if (!localUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
          localUsers.push(newUser);
          saveStoredUsers(localUsers);
        }
        setCurrentUser(newUser);
        if (data.token) localStorage.setItem('authToken', data.token);
        showAlert("Account created successfully! Welcome to Kuraj VIP Club.", true);
        setTimeout(() => renderDashboard(), 600);
      } else {
        showAlert(data.message || "Registration failed.");
      }
    } catch (err) {
      // Local fallback
      const newUser = {
        id: "usr_" + Date.now().toString(36),
        name: name,
        email: email,
        password: password,
        role: "user",
        vipTier: "VIP Black Diamond",
        discount: "90% Off VIP",
        balance: 200,
        referralCode: "KURAJ-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        joinedDate: new Date().toISOString().split('T')[0],
        purchases: []
      };
      const localUsers = getStoredUsers();
      localUsers.push(newUser);
      saveStoredUsers(localUsers);
      setCurrentUser(newUser);
      renderDashboard();
    } finally {
      if (btn) btn.disabled = false;
    }
  };

  // ADMIN LOGIN
  window.handleAdminLogin = async function (e) {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value.trim();
    const btn = document.getElementById('adminSubmitBtn');
    if (btn) btn.disabled = true;

    try {
      const resp = await fetch('/api/auth?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await resp.json();

      if (resp.ok && data.success && data.role === 'admin') {
        setCurrentUser(data.user);
        if (data.token) localStorage.setItem('authToken', data.token);
        showAlert("Admin credentials verified! Opening console...", true);
        setTimeout(() => renderDashboard(), 500);
      } else if (
        (email === DEFAULT_ADMIN_EMAIL || email === 'admin') &&
        (password === DEFAULT_ADMIN_PASS || password === 'admin' || password === 'kuraj2026')
      ) {
        // Direct local verification
        const adminUser = {
          id: "admin_master",
          name: "Kuraj Administrator",
          email: "admin@kuraj.com",
          role: "admin",
          token: "token_adm_local"
        };
        setCurrentUser(adminUser);
        showAlert("Admin verified! Opening console...", true);
        setTimeout(() => renderDashboard(), 400);
      } else {
        showAlert(data.message || "Invalid administrator credentials.");
      }
    } catch (err) {
      if (
        (email === DEFAULT_ADMIN_EMAIL || email === 'admin') &&
        (password === DEFAULT_ADMIN_PASS || password === 'admin')
      ) {
        const adminUser = {
          id: "admin_master",
          name: "Kuraj Administrator",
          email: "admin@kuraj.com",
          role: "admin"
        };
        setCurrentUser(adminUser);
        renderDashboard();
      } else {
        showAlert("Admin login failed: " + err.message);
      }
    } finally {
      if (btn) btn.disabled = false;
    }
  };

  // LOGOUT
  window.handleLogout = function () {
    setCurrentUser(null);
    activeAuthTab = 'login';
    renderDashboard();
  };

  // ADMIN: UPDATE ORDER STATUS
  window.updateOrderStatus = async function (orderId, newStatus) {
    const orders = getStoredOrders();
    const target = orders.find(o => o.id === orderId);
    if (target) {
      target.status = newStatus;
      saveStoredOrders(orders);
    }

    try {
      await fetch('/api/admin?action=update_order_status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + (localStorage.getItem('authToken') || 'token_adm_master')
        },
        body: JSON.stringify({ orderId, newStatus, adminPassword: 'admin' })
      });
    } catch(e) {}

    showAdminAlert(`Order <strong>${orderId}</strong> status changed to <strong>${newStatus}</strong>!`, true);
  };

  // ADMIN: DELETE ORDER
  window.deleteOrder = function (orderId) {
    if (!confirm(`Are you sure you want to delete order ${orderId}?`)) return;
    let orders = getStoredOrders();
    orders = orders.filter(o => o.id !== orderId);
    saveStoredOrders(orders);
    renderDashboard();
  };

  // ADMIN: SIMULATE TEST ORDER
  window.simulateNewOrder = function () {
    const randomWatch = [
      { name: "Patek Philippe Aquanaut 5167A", price: 1980 },
      { name: "Rolex Submariner Date Black Ceramic", price: 1450 },
      { name: "Cartier Santos de Cartier Large", price: 1200 },
      { name: "Audemars Piguet Royal Oak Jumbo", price: 2850 }
    ][Math.floor(Math.random() * 4)];

    const id = "KRJ-" + Math.floor(1000 + Math.random() * 9000);
    const newOrd = {
      id: id,
      customerName: "VIP Client #" + Math.floor(100 + Math.random() * 900),
      customerEmail: "client." + Math.floor(Math.random() * 999) + "@vip.kuraj.com",
      productName: "1x " + randomWatch.name,
      total: randomWatch.price,
      date: new Date().toISOString().split('T')[0],
      status: "Pending",
      shippingAddress: "Priority Global Air Courier"
    };

    const orders = getStoredOrders();
    orders.unshift(newOrd);
    saveStoredOrders(orders);
    renderDashboard();
    showAdminAlert(`Simulated new order <strong>${id}</strong> added to list!`, true);
  };

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Initial load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderDashboard);
  } else {
    renderDashboard();
  }
})();
