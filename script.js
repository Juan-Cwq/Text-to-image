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
        const response = await fetch(
            'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1-base',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: prompt,
                    options: {
                        wait_for_model: true
                    }
                }),
            }
        );
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        
        // Convert response to blob and display
        const blob = await response.blob();
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
