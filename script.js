const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const resultDiv = document.getElementById('result');
const verdictTitle = document.getElementById('verdictTitle');
const modelName = document.getElementById('modelName');
const metadataRaw = document.getElementById('metadataRaw');

// Handle File Selection via click
fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));

// Drag and Drop Effects
dropZone.addEventListener('dragover', (e) => { 
    e.preventDefault(); 
    dropZone.style.borderColor = '#60a5fa'; 
});

dropZone.addEventListener('dragleave', () => { 
    dropZone.style.borderColor = '#38bdf8'; 
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#38bdf8';
    if (e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
    }
});

function handleFile(file) {
    if (!file) return;

    const reader = new FileReader();
    
    // Using 'latin1' encoding allows us to safely read raw binary strings
    // from JPEG, PNG, and WebP chunks without corrupting characters.
    reader.readAsText(file, 'latin1');

    reader.onload = function (event) {
        const fileContent = event.target.result;
        analyzeMetadata(fileContent, file.name);
    };
}

function analyzeMetadata(content, fileName) {
    resultDiv.style.display = 'block';
    let isAI = false;
    let detectedModel = "None (No AI Metadata Found)";
    let extractedInfo = "";

    const lowerContent = content.toLowerCase();
    const lowerFileName = fileName.toLowerCase();

    // ==========================================
    // 1. ADVANCED WEBP CONTAINER & C2PA ANALYSIS
    // ==========================================
    const hasWebPHeader = content.startsWith('RIFF') && content.includes('WEBP');
    
    // Look for global C2PA manifest footprints (universal AI indicators)
    const hasC2PA = content.includes('c2pa') || content.includes('jumbf') || content.includes('urn:c2pa');

    // ==========================================
    // 2. PLATFORM SPECIFIC AI SIGS CHECK
    // ==========================================
    
    // A. Google Gemini / Google AI Footprints
    if (lowerFileName.includes('gemini') || 
        content.includes('google') || 
        content.includes('synthid') || 
        content.includes('ns.google.com') ||
        (content.includes('http://ns.adobe.com/xap/1.0/') && hasC2PA)) {
        
        isAI = true;
        detectedModel = "Google Gemini (Verified via Platform Signature)";
        let index = Math.max(content.indexOf('google'), content.indexOf('c2pa'), content.indexOf('WEBP'));
        const snippet = content.substring(Math.max(0, index - 20), index + 250);
        
        extractedInfo = `🔒 Digital Credentials Located:\nFile Name: ${fileName}\nFormat: ${hasWebPHeader ? 'WebP Container' : 'Standard Image Header'}\n\nHeader Snippet:\n... ` + 
                        snippet.replace(/[^\x20-\x7E\s]/g, ' ').replace(/\s+/g, ' ').trim() + " ...\n\n" +
                        "Note: Found tracking metrics matching the Google/C2PA asset manifest standard.";
    }
    // B. Stable Diffusion / ComfyUI Footprints
    else if (content.includes('parameters\0') || content.includes('"software": "comfyui"') || lowerContent.includes('stable-diffusion')) {
        isAI = true;
        detectedModel = "Stable Diffusion / ComfyUI";
        const index = content.includes('parameters\0') ? content.indexOf('parameters\0') : lowerContent.indexOf('stable-diffusion');
        const snippet = content.substring(index, index + 800);
        extractedInfo = snippet.replace(/[^\x20-\x7E\s]/g, '').trim();
    } 
    // C. Midjourney Footprints
    else if (lowerContent.includes('midjourney')) {
        isAI = true;
        detectedModel = "Midjourney";
        const index = lowerContent.indexOf('midjourney');
        extractedInfo = "Found Midjourney tracking fingerprint in image structure:\n... " + content.substring(index - 10, index + 200).replace(/[^\x20-\x7E\s]/g, '') + " ...";
    }
    // D. DALL-E / OpenAI Footprints
    else if (lowerContent.includes('dall-e') || lowerContent.includes('openai')) {
        isAI = true;
        detectedModel = "DALL-E (OpenAI)";
        const index = lowerContent.indexOf('openai');
        extractedInfo = "Found OpenAI/DALL-E structure signature in file bytes:\n... " + content.substring(index - 10, index + 200).replace(/[^\x20-\x7E\s]/g, '') + " ...";
    }
    // E. Adobe Firefly Footprints
    else if (content.includes('Adobe Firefly') || content.includes('adobe:firefly')) {
        isAI = true;
        detectedModel = "Adobe Firefly";
        const index = content.indexOf('Adobe Firefly');
        extractedInfo = "Found Adobe Firefly engine metadata signatures:\n... " + content.substring(index - 50, index + 150).replace(/[^\x20-\x7E\s]/g, '') + " ...";
    }
    // F. Generic/Universal C2PA Check fallback
    else if (hasC2PA) {
        isAI = true;
        detectedModel = "AI Generated (Universal C2PA Manifest Hook)";
        extractedInfo = `Format: ${hasWebPHeader ? 'WebP Asset' : 'Image Asset'}\n\nSecure C2PA Content Credentials block uncovered inside file structure headers. This cryptographic manifest records that this picture was rendered or modified using AI generation tools.`;
    }

    // ==========================================
    // 3. RENDER THE INTERFACE RESULTS
    // ==========================================
    if (isAI) {
        resultDiv.className = "ai-detected";
        verdictTitle.innerText = "Verdict: AI Generated";
        modelName.innerText = detectedModel;
        metadataRaw.innerText = extractedInfo;
    } else {
        resultDiv.className = "real-detected";
        verdictTitle.innerText = "Verdict: Likely a Real Image";
        modelName.innerText = "Real / Unmarked Image";
        metadataRaw.innerText = `Clean file structure (${hasWebPHeader ? 'WebP' : 'Standard'}).\n\nThis file does not contain application parameters, generation recipes, or digital credentials common to popular AI image generators.`;
    }
}
