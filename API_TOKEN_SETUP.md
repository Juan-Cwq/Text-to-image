# 🔑 How to Fix the API Token Permission Error

## The Problem
You're seeing this error:
```
Error generating image: This authentication method does not have sufficient permissions to call Inference Providers on behalf of user idk-jc
```

## The Solution

Your Hugging Face API token doesn't have the right permissions. Here's how to fix it:

### Step 1: Create a New Token with Correct Permissions

1. **Go to Hugging Face Token Settings:**
   👉 https://huggingface.co/settings/tokens

2. **Click "Create new token"**

3. **Configure the token:**
   - **Name:** Give it a name like "Text-to-Image Generator"
   - **Type:** Select "Read" (this is sufficient)
   - **Permissions:** ⚠️ **IMPORTANT** - Make sure to check:
     - ✅ **"Make calls to the serverless Inference API"**
   
4. **Click "Create token"**

5. **Copy the token** (you won't be able to see it again!)

### Step 2: Update Your Token in the App

1. Go back to your deployed app
2. Clear your browser's localStorage or just refresh the page
3. Enter the new token
4. Click "Save Token"
5. Try generating an image again!

## Visual Guide

When creating your token, the permissions section should look like this:

```
Token Type: Read
Permissions:
  ☐ Read access to contents of all public gated repos you can access
  ☑ Make calls to the serverless Inference API  ← THIS ONE IS REQUIRED!
  ☐ Create and manage Inference Endpoints
```

## Alternative: Use a Different Model

If you continue to have issues, you can also try using a different model that might have fewer restrictions. Edit `script.js` and change line 55 to:

```javascript
'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5',
```

## Still Having Issues?

1. **Check your token is valid:** Make sure you copied the entire token
2. **Try a fresh token:** Delete the old one and create a brand new one
3. **Check Hugging Face status:** Visit https://status.huggingface.co/
4. **Rate limits:** Free tier has rate limits - wait a few minutes and try again

## Need Help?

If you're still stuck, check:
- Hugging Face Documentation: https://huggingface.co/docs/api-inference/
- Hugging Face Discord: https://hf.co/join/discord
