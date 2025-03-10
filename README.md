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

### Option 1: Use the hosted version

Visit [https://tremontaine.github.io/flux-ui](https://tremontaine.github.io/flux-ui) to use the tool without setting up anything locally.

### Option 2: Run locally

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

4. Open `http://localhost:3000` in your browser.

## Usage

1. Enter your API key from BFL (get one at https://blackforestlabs.ai if you don't have one)
2. Select your desired model
3. Enter a prompt describing the image you want to generate
4. Choose from available dimensions or aspect ratios
5. Adjust parameters as needed
6. Click "Generate Image"
7. Use the buttons below the image to open, copy URL, or copy the parameters

## Security Note

Your API key is stored locally in your browser and is never sent to our servers. All API requests are made directly from your browser to the BFL API.

## Deployment Options

### Static Site (Limited Functionality)

You can deploy just the HTML file to any static hosting provider (GitHub Pages, Netlify, etc.). However, the image preview functionality won't work due to CORS limitations - users will need to use the "Open Image" button.

### Full Application (Complete Functionality)

Deploy both the HTML and Node.js server to a provider that supports Node.js (Heroku, Render, Railway, etc.) to preserve the image preview functionality.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
