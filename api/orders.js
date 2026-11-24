// Vercel Serverless Function: Orders API

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

  const body = parseBody(req);

  try {
    // CREATE NEW ORDER
    if (req.method === 'POST') {
      const orderId = body.id || ("KRJ-" + Math.floor(1000 + Math.random() * 9000));
      const order = {
        id: orderId,
        customerName: body.customerName || ((body.customer && (body.customer.firstName + ' ' + (body.customer.lastName || ''))) || "VIP Client"),
        customerEmail: body.customerEmail || (body.customer && body.customer.email) || "client@kuraj.com",
        items: body.items || [],
        productName: body.productName || (Array.isArray(body.items) ? body.items.map(i => `${i.quantity || 1}x ${i.name}`).join(', ') : "Luxury Collection Order"),
        total: Number(body.total) || 0,
        status: body.status || "Processing",
        shippingAddress: body.shippingAddress || (body.shipping ? `${body.shipping.address}, ${body.shipping.city}, ${body.shipping.country}` : "Global Priority Express"),
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString()
      };

      return res.status(201).json({
        success: true,
        message: "Order placed successfully",
        order: order
      });
    }

    // GET ORDERS
    if (req.method === 'GET') {
      const userEmail = req.query.email;
      return res.status(200).json({
        success: true,
        orders: []
      });
    }

    return res.status(405).json({ success: false, message: "Method not allowed" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
