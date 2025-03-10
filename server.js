const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 3589;

// Enable CORS for all routes
app.use(cors());

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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
