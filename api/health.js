export default async function handler(req, res) {
  // Health check endpoint
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      message: 'DIMA Deals API is running'
    });
  }

  return res.status(405).json({
    error: 'Method not allowed'
  });
}
