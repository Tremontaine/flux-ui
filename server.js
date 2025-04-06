const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const port = process.env.PORT || 3589;

const API_BASE_URL = 'https://api.us1.bfl.ai/v1'; // Define API base URL

// Enable CORS for all routes
app.use(cors());

// Parse JSON request bodies
app.use(express.json({ limit: '50mb' }));  // Increased size limit for larger image uploads

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Proxy endpoint for images
app.get('/proxy-image', async (req, res) => {
  try {
    const imageUrl = req.query.url;
    if (!imageUrl) {
      return res.status(400).send('Image URL is required');
    }

    console.log('Proxying image:', imageUrl);
    
    const response = await fetch(imageUrl, {
      timeout: 30000  // 30 second timeout
    });
    
    if (!response.ok) {
      return res.status(response.status).send('Failed to fetch image');
    }

    // Get content type from original response
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }

    // Set cache headers
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours

    // Pipe the image data to the response, handling errors
    response.body.pipe(res).on('error', (err) => {
      console.error('Pipe error:', err);
      // Avoid sending another response if headers already sent
      if (!res.headersSent) {
        res.status(500).send('Failed to stream image');
      }
    });
  } catch (error) {
    console.error('Proxy error:', error);
    // Avoid sending another response if headers already sent (e.g., by pipe error)
    if (!res.headersSent) {
      res.status(500).send('Proxy error: ' + error.message);
    }
  }
});

// Middleware to check for API key
const requireApiKey = (req, res, next) => {
  const apiKey = req.headers['x-key'];
  if (!apiKey) {
    return res.status(400).json({ error: 'API key (x-key header) is required' });
  }
  req.apiKey = apiKey; // Attach key to request object for later use
  next();
};

// Proxy endpoint for API POST requests (model generation) - Apply middleware
app.post('/api-proxy/:endpoint', requireApiKey, async (req, res) => { // Use middleware
  try {
    const endpoint = req.params.endpoint;
    // const apiKey = req.headers['x-key']; // No longer needed here, middleware handles it
    const apiKey = req.apiKey; // Get key from middleware
    const requestBody = req.body;

    console.log(`Proxying API request to ${endpoint}`);

    // API key check is now handled by the middleware

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, { // Use constant
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-key': apiKey
      },
      body: JSON.stringify(requestBody),
      timeout: 60000  // 60 second timeout
    });
    
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('API proxy error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Proxy endpoint for API GET requests (poll for results) - Apply middleware
app.get('/api-proxy/get_result', requireApiKey, async (req, res) => { // Use middleware
  try {
    const taskId = req.query.id;
    // const apiKey = req.headers['x-key']; // No longer needed here, middleware handles it
    const apiKey = req.apiKey; // Get key from middleware

    if (!taskId) {
      return res.status(400).json({ error: 'Task ID is required' });
    }

    // API key check is now handled by the middleware

    console.log(`Proxying get_result request for task: ${taskId}`);
    
    const response = await fetch(`${API_BASE_URL}/get_result?id=${taskId}`, { // Use constant
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-key': apiKey
      },
      timeout: 30000  // 30 second timeout
    });
    
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('API proxy error:', error);
    res.status(500).json({ error: error.message });
  }
});

// For any routes not handled by static or API routes, serve the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});