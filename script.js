// Check if API key is saved
window.onload = function() {
    const savedApiKey = localStorage.getItem('hf_api_key');
    if (savedApiKey) {
        document.getElementById('apiKeySection').style.display = 'none';
        document.getElementById('resetKeySection').style.display = 'block';
    }
};

function resetApiKey() {
    localStorage.removeItem('hf_api_key');
    document.getElementById('apiKeySection').style.display = 'block';
    document.getElementById('resetKeySection').style.display = 'none';
    document.getElementById('apiKeyInput').value = '';
    showError('API token cleared. Please enter a new token.', false);
}

function saveApiKey() {
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    if (!apiKey) {
        showError('Please enter a valid API token');
        return;
    }
    
    localStorage.setItem('hf_api_key', apiKey);
    document.getElementById('apiKeySection').style.display = 'none';
    document.getElementById('resetKeySection').style.display = 'block';
    showError('API token saved successfully!', false);
    setTimeout(() => {
        document.getElementById('errorMessage').style.display = 'none';
    }, 3000);
}

async function generateImage() {
    const prompt = document.getElementById('promptInput').value.trim();
    
    // Validation
    if (!prompt) {
        showError('Please enter a prompt to generate an image');
        return;
    }
    
    // UI updates
    const generateBtn = document.getElementById('generateBtn');
    const btnText = document.getElementById('btnText');
    const loader = document.getElementById('loader');
    const imageContainer = document.getElementById('imageContainer');
    const errorMessage = document.getElementById('errorMessage');
    
    generateBtn.disabled = true;
    btnText.textContent = 'Generating...';
    loader.style.display = 'inline-block';
    imageContainer.style.display = 'none';
    errorMessage.style.display = 'none';
    
    try {
        // Use Pollinations.ai - Free, no API key required!
        // This is a simple URL-based API that returns images directly
        const encodedPrompt = encodeURIComponent(prompt);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`;
        
        // Create a new image to test if it loads
        const img = new Image();
        
        // Wait for image to load
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = imageUrl;
        });
        
        // Display the image
        const generatedImage = document.getElementById('generatedImage');
        generatedImage.src = imageUrl;
        generatedImage.dataset.imageUrl = imageUrl; // Store for download
        
        imageContainer.style.display = 'block';
        
    } catch (error) {
        console.error('Error:', error);
        showError(`Error generating image: ${error.message}. Please try again.`);
    } finally {
        // Reset button
        generateBtn.disabled = false;
        btnText.textContent = 'Generate Image';
        loader.style.display = 'none';
    }
}

function showError(message, isError = true) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    errorMessage.style.background = isError ? '#fee' : '#efe';
    errorMessage.style.color = isError ? '#c33' : '#3c3';
    errorMessage.style.borderLeft = isError ? '4px solid #c33' : '4px solid #3c3';
}

async function downloadImage() {
    const generatedImage = document.getElementById('generatedImage');
    const imageUrl = generatedImage.dataset.imageUrl;
    
    try {
        // Fetch the image and convert to blob for download
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = 'ai-generated-image.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Clean up
        URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error('Download error:', error);
        // Fallback: open in new tab
        window.open(imageUrl, '_blank');
    }
}

// Allow Enter key to generate (Shift+Enter for new line)
document.getElementById('promptInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        generateImage();
    }
});
