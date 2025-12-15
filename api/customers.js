// Vercel Serverless Function (api/customers.js)
// Supports:
// GET /api/customers?phone=
// POST /api/customers
// PUT /api/customers/:id
const { Pool } = require('pg');
const { parsePhoneNumberFromString } = require('libphonenumber-js');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

function normalizePhone(raw) {
  if (!raw) return raw;
  try {
    const p = parsePhoneNumberFromString(raw, 'GR');
    if (p && p.isValid()) return p.format('E.164');
    return raw;
  } catch (e) {
    return raw;
  }
}

function unauthorized(res) {
  res.status(401).json({ error: 'unauthorized' });
}

module.exports = async (req, res) => {
  // simple adminAuth
  const auth = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return unauthorized(res);
  }

  try {
    if (req.method === 'GET') {
      const { phone } = req.query;
      if (!phone) return res.status(400).json({ error: 'phone required' });
      const norm = normalizePhone(phone);
      const r = await pool.query('SELECT * FROM customers WHERE phone=$1', [norm]);
      return res.status(200).json(r.rows);
    }

    if (req.method === 'POST') {
      const { phone, name, floor, buzzer, address_text, lat, lng, notes } = req.body;
      if (!phone) return res.status(400).json({ error: 'phone required' });
      const norm = normalizePhone(phone);
      const q = `INSERT INTO customers (phone,name,floor,buzzer,address_text,lat,lng,notes)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`;
      const r = await pool.query(q, [norm,name,floor,buzzer,address_text,lat,lng,notes]);
      return res.status(201).json(r.rows[0]);
    }

    if (req.method === 'PUT') {
      const id = req.query.id || (req.url.split('/').pop()); // safety
      const { name, floor, buzzer, address_text, lat, lng, notes } = req.body;
      const q = `UPDATE customers SET name=$1,floor=$2,buzzer=$3,address_text=$4,lat=$5,lng=$6,notes=$7,updated_at=now()
                 WHERE id=$8 RETURNING *`;
      const r = await pool.query(q, [name,floor,buzzer,address_text,lat,lng,notes,id]);
      if (!r.rows.length) return res.status(404).json({ error: 'not found' });
      return res.status(200).json(r.rows[0]);
    }

    res.setHeader('Allow', 'GET,POST,PUT');
    return res.status(405).end('Method Not Allowed');
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
};
