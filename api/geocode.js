// Vercel Serverless Function (api/geocode.js)
// proxy to Nominatim to avoid CORS / client exposure
module.exports = async (req, res) => {
  const auth = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  const address = req.query.address;
  if (!address) return res.status(400).json({ error: 'address required' });
  const base = process.env.NOMINATIM_URL || 'https://nominatim.openstreetmap.org';
  const url = `${base}/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'customer-lookup-admin/1.0' } });
    const j = await r.json();
    if (j && j.length) {
      const item = j[0];
      return res.status(200).json({ lat: parseFloat(item.lat), lng: parseFloat(item.lon), display_name: item.display_name });
    } else {
      return res.status(404).json({ error: 'not found' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'geocode error' });
  }
};
