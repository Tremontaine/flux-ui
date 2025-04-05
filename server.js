const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 3589;

// Enable CORS for all routes
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Serve static files from the current directory
app.use(express.static('.'));

// Proxy endpoint for images
app.get('/proxy-image', async (req, res) => {
  try {
    const imageUrl = req.query.url;
    if (!imageUrl) {
      return res.status(400).send('Image URL is required');
    }

    console.log('Proxying image:', imageUrl);
    
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return res.status(response.status).send('Failed to fetch image');
    }

    // Get content type from original response
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }

    // Pipe the image data to the response
    response.body.pipe(res);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).send('Proxy error: ' + error.message);
  }
});

// Proxy endpoint for API POST requests (model generation)
app.post('/api-proxy/:endpoint', async (req, res) => {
  try {
    const endpoint = req.params.endpoint;
    const apiKey = req.headers['x-key'];
    const requestBody = req.body;
    
    console.log(`Proxying API request to ${endpoint}`);
    
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }
    
    const response = await fetch(`https://api.us1.bfl.ai/v1/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-key': apiKey
      },
      body: JSON.stringify(requestBody)
    });
    
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('API proxy error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Proxy endpoint for API GET requests (poll for results)
app.get('/api-proxy/get_result', async (req, res) => {
  try {
    const taskId = req.query.id;
    const apiKey = req.headers['x-key'];
    
    if (!taskId) {
      return res.status(400).json({ error: 'Task ID is required' });
    }
    
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }
    
    console.log(`Proxying get_result request for task: ${taskId}`);
    
    const response = await fetch(`https://api.us1.bfl.ai/v1/get_result?id=${taskId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-key': apiKey
      }
    });
    
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('API proxy error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});