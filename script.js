// Check if API key is saved
window.onload = function() {
    const savedApiKey = localStorage.getItem('hf_api_key');
    if (savedApiKey) {
        document.getElementById('apiKeySection').style.display = 'none';
    }
};

function saveApiKey() {
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    if (!apiKey) {
        showError('Please enter a valid API token');
        return;
    }
    
    localStorage.setItem('hf_api_key', apiKey);
    document.getElementById('apiKeySection').style.display = 'none';
    showError('API token saved successfully!', false);
    setTimeout(() => {
        document.getElementById('errorMessage').style.display = 'none';
    }, 3000);
}

async function generateImage() {
    const prompt = document.getElementById('promptInput').value.trim();
    const apiKey = localStorage.getItem('hf_api_key');
    
    // Validation
    if (!apiKey) {
        showError('Please enter your Hugging Face API token first');
        return;
    }
    
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
        // Call Hugging Face Inference API
        // Using a more accessible model that doesn't require special permissions
        const response = await fetch(
            'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    inputs: prompt,
                    options: {
                        wait_for_model: true
                    }
                }),
            }
        );
        
        // Check if response is ok
        if (!response.ok) {
            let errorMsg = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.json();
                if (errorData.error) {
                    errorMsg = errorData.error;
                    // Check for permission errors
                    if (errorMsg.includes('permissions') || errorMsg.includes('Inference Providers')) {
                        errorMsg = 'API Token Error: Your token needs "Make calls to the serverless Inference API" permission. Please create a new token at https://huggingface.co/settings/tokens with the correct permissions.';
                    }
                }
            } catch (e) {
                // If error response is not JSON, use status text
            }
            throw new Error(errorMsg);
        }
        
        // Check content type to ensure it's an image
        const contentType = response.headers.get('content-type');
        
        // If it's JSON, it's probably an error or "model loading" message
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            // Model is loading
            if (data.estimated_time) {
                throw new Error(`Model is loading. Please wait ${Math.ceil(data.estimated_time)} seconds and try again.`);
            }
            throw new Error('Unexpected response from API. Please try again.');
        }
        
        // Convert response to blob and display
        const blob = await response.blob();
        
        // Verify it's actually an image
        if (!blob.type.startsWith('image/')) {
            throw new Error('API did not return an image. The model might be loading. Please wait 20-30 seconds and try again.');
        }
        
        const imageUrl = URL.createObjectURL(blob);
        
        const generatedImage = document.getElementById('generatedImage');
        generatedImage.src = imageUrl;
        generatedImage.dataset.blob = imageUrl; // Store for download
        
        imageContainer.style.display = 'block';
        
    } catch (error) {
        console.error('Error:', error);
        showError(`Error generating image: ${error.message}`);
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

function downloadImage() {
    const generatedImage = document.getElementById('generatedImage');
    const imageUrl = generatedImage.dataset.blob;
    
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = 'generated-image.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Allow Enter key to generate (Shift+Enter for new line)
document.getElementById('promptInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        generateImage();
    }
});
