# Flux Image Generator UI

A simple, clean interface for the BFL Flux image generation API. This web-based tool allows users to create AI-generated images using various Flux models (Pro, Pro 1.1, Ultra, Dev) without needing to write code or format API requests.

![Flux AI Generator UI Screenshot](FluxImageGenerator.png)

## Features

- Support for all Flux models: Flux Pro 1.1, Flux Pro, Flux Dev, and Flux Ultra
- Model-specific parameter options that adapt to your selected model
- Image prompt capability
- Preset dimensions and aspect ratios for different models
- Adjustable generation parameters (steps, guidance, safety tolerance, etc.)
- Prompt upsampling option
- Random seed generation
- Image preview and download
- Parameter copying for reproducibility
- Client-side API key storage

## Setup

### Running Locally (Required)

1. Clone this repository:
```bash
git clone https://github.com/Tremontaine/flux-ui.git
cd flux-ui
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
node server.js
```

4. Open `http://localhost:3589` in your browser.

**Note:** The Node.js server is required for the application to work. It acts as a proxy between your browser and the BFL API to avoid CORS issues. The application cannot be run by simply opening the HTML file in a browser.

## Usage

1. Enter your API key from BFL (get one at https://blackforestlabs.ai if you don't have one)
2. Select your desired model
3. Enter a prompt describing the image you want to generate
4. Choose from available dimensions or aspect ratios
5. Adjust parameters as needed
6. Click "Generate Image"
7. Use the buttons below the image to open, copy URL, or copy the parameters

## Security Note

Your API key is stored locally in your browser and is never sent to our servers. All API requests are made from your browser to your local server, which then forwards them to the BFL API.

## Deployment Options

### Full Application Deployment

To deploy this application, you need to host both the frontend files (HTML, CSS, JS) and the Node.js server. Here are some options:

1. **Platform as a Service (PaaS)**: Deploy to Heroku, Render, Railway, etc., which support Node.js applications.
2. **Virtual Private Server (VPS)**: Deploy to a VPS like DigitalOcean, AWS EC2, etc.
3. **Serverless**: Adapt the server.js to run as serverless functions on platforms like Vercel, Netlify, or AWS Lambda.

**Important:** Static site hosting services alone (GitHub Pages, etc.) will not work for this application as they cannot run the Node.js server.

## How It Works

The application architecture:
1. Frontend (HTML/CSS/JavaScript) - The UI for interacting with the API
2. Node.js server (server.js) - Acts as a proxy between the frontend and the BFL API
3. BFL API - The actual image generation service

The proxy server is necessary to avoid CORS (Cross-Origin Resource Sharing) issues that would otherwise prevent the browser from directly accessing the BFL API.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).