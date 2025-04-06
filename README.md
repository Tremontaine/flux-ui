# Flux UI

A comprehensive web-based interface for the Black Forest Labs Flux AI API, providing a user-friendly way to generate images, manage finetunes, and perform various image editing tasks.

![Flux AI Generator UI Screenshot](FluxImageGenerator.png)

## Features

- **Image Generation**: Support for all Flux models (Pro, Pro 1.1, Ultra, Dev) with model-specific parameters
- **Finetune Management**: Create, view, and manage your finetunes directly within the application
- **Inpainting**: Edit existing images by masking and regenerating specific areas
- **Outpainting**: Extend images beyond their original boundaries
- **Control**: Generate images using control images (Canny Edge or Depth Map)
- **Gallery**: Store and manage generated images locally in your browser
- **Client-side API key storage**: Your API key is stored securely in your browser's local storage

## Setup

### Running Locally

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
   npm start
   ```
4. Open `http://localhost:3589` in your browser.

## Usage

1. Enter your BFL API key (get one at https://blackforestlabs.ai if you don't have one)
2. Navigate through different tabs to access various features:
   - **Generator**: Create new images using text prompts
   - **Finetune**: Manage your finetunes
   - **Inpaint**: Edit existing images
   - **Outpaint**: Extend images
   - **Control**: Generate images using control images
   - **Gallery**: View and manage your generated images

### Generator Tab

- Select model, enter prompt, and adjust parameters
- Use finetunes if available
- Generate images and save to gallery

### Finetune Tab

- Create new finetunes by uploading training data
- Manage existing finetunes and view their details

### Inpaint Tab

- Upload an image and draw a mask
- Generate new content within the masked area based on your prompt

### Outpaint Tab

- Upload an image and set expansion dimensions
- Generate extended versions of the image

### Control Tab

- Upload a control image (Canny Edge or Depth Map)
- Generate images based on the control image and your prompt

### Gallery Tab

- View and manage all generated images
- Save, download, or copy image URLs and parameters

## Security Note

Your API key is stored locally in your browser and never sent to our servers. All API requests are made from your browser to your local server, which then forwards them to the BFL API.

## Deployment Options

You can deploy this application on various platforms that support Node.js applications, such as Heroku, Render, or a VPS like DigitalOcean.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).