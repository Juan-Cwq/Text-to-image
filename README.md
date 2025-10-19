# AI Image Generator

A beautiful web application that generates images from text prompts using Stable Diffusion via the Hugging Face Inference API.

## Features

- 🎨 Generate images from text descriptions
- 🚀 Fast and responsive UI
- 💾 Download generated images
- 🔐 Secure API key storage (local only)
- 📱 Mobile-friendly design

## Setup

### 1. Get a Hugging Face API Token

1. Go to [Hugging Face](https://huggingface.co/settings/tokens)
2. Create a new token (read access is sufficient)
3. Copy the token

### 2. Deploy to Netlify

#### Option A: Deploy via Netlify UI
1. Go to [Netlify](https://app.netlify.com/)
2. Drag and drop this folder to deploy
3. Your site will be live in seconds!

#### Option B: Deploy via Netlify CLI
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### 3. Use the App

1. Open your deployed site
2. Enter your Hugging Face API token (stored locally in your browser)
3. Enter a prompt and click "Generate Image"
4. Wait for the magic to happen!

## Files

- `index.html` - Main HTML structure
- `styles.css` - Beautiful, modern styling
- `script.js` - JavaScript for API calls and interactions
- `netlify.toml` - Netlify configuration

## How It Works

This app uses the **Hugging Face Inference API** to generate images without needing a GPU or Python backend. The API calls are made directly from the browser, making it perfect for static hosting on Netlify.

## Example Prompts

- "a photo of an astronaut riding a horse on mars"
- "a beautiful sunset over mountains, oil painting style"
- "a cute robot playing guitar, digital art"
- "a futuristic city with flying cars, cyberpunk style"

## Notes

- First generation may take 20-30 seconds as the model loads
- Subsequent generations are faster
- Free tier has rate limits
- API token is stored only in your browser (localStorage)

## Alternative Deployment Options

If you need more control or want to run the Python version:

- **Hugging Face Spaces** - Deploy the Python notebook directly
- **Render/Railway** - For Python backend with GPU support
- **Replicate** - Serverless GPU inference

Enjoy creating AI art! 🎨✨
