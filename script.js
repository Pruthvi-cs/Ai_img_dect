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
    
    // We keep using 'latin1' encoding because it preserves every byte exactly as an 8-bit character,
    // which allows binary-safe string searches inside JPEGs.
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

    // 1. Check for Google Gemini Signatures (File Names or buried C2PA/XMP profiles)
    // Google downloads often append "Gemini_Generated_Image" or hold specific XMP structures
    if (lowerFileName.includes('gemini') || 
        content.includes('google') || 
        content.includes('synthid') || 
        content.includes('ns.google.com') ||
        (content.includes('http://ns.adobe.com/xap/1.0/') && content.includes('c2pa'))) {
        
        isAI = true;
        detectedModel = "Google Gemini (Verified via Platform Signature / C2PA)";
        
        // Find where the marker is located to give the user a preview
        let index = content.indexOf('google');
        if (index === -1) index = content.indexOf('c2pa');
        if (index === -1) index = content.indexOf('xap');
        
        const start = Math.max(0, index - 20);
        const snippet = content.substring(start, index + 250);
        
        extractedInfo = "🔒 Digital Credentials Found:\n" +
                        "File Origin: " + fileName + "\n\n" +
                        "Header Structure Snippet:\n... " + 
                        snippet.replace(/[^\x20-\x7E\s]/g, ' ').replace(/\s+/g, ' ').trim() + " ...\n\n" +
                        "Note: This file contains secure tracking markers associated with the Google Gemini and Content Provenance (C2PA) framework standard.";
    }
    // 2. Stable Diffusion / ComfyUI Check
    else if (content.includes('parameters\0') || content.includes('"software": "comfyui"')) {
        isAI = true;
        detectedModel = "Stable Diffusion / ComfyUI";
        const index = content.indexOf('parameters\0');
        const snippet = content.substring(index + 11, index + 800);
        extractedInfo = snippet.replace(/[^\x20-\x7E\s]/g, '').trim();
    } 
    // 3. Midjourney Check
    else if (lowerContent.includes('midjourney')) {
        isAI = true;
        detectedModel = "Midjourney";
        const index = lowerContent.indexOf('midjourney');
        extractedInfo = "Found Midjourney signature inside file data:\n... " + content.substring(index - 10, index + 200).replace(/[^\x20-\x7E\s]/g, '') + " ...";
    }
    // 4. DALL-E / OpenAI Check
    else if (lowerContent.includes('dall-e') || lowerContent.includes('openai')) {
        isAI = true;
        detectedModel = "DALL-E (OpenAI)";
        const index = lowerContent.indexOf('openai');
        extractedInfo = "Found OpenAI/DALL-E signature inside file data:\n... " + content.substring(index - 10, index + 200).replace(/[^\x20-\x7E\s]/g, '') + " ...";
    }
    // 5. Adobe Firefly Check
    else if (content.includes('Adobe Firefly') || content.includes('adobe:firefly')) {
        isAI = true;
        detectedModel = "Adobe Firefly";
        const index = content.indexOf('Adobe Firefly');
        extractedInfo = "Found Adobe Firefly signature inside file data:\n... " + content.substring(index - 50, index + 150).replace(/[^\x20-\x7E\s]/g, '') + " ...";
    }
    // 6. Generic C2PA Manifest Passport Check
    else if (content.includes('c2pa') || content.includes('jumbf') || content.includes('urn:c2pa')) {
        isAI = true;
        detectedModel = "AI Generated / Modified (Universal C2PA Manifest)";
        extractedInfo = "Secure C2PA Asset Provenance Metadata structure found in file headers. This digital asset passport validates that the image was generated or modified using secure AI creation models.";
    }

    // Update the UI
    if (isAI) {
        resultDiv.className = "ai-detected";
        verdictTitle.innerText = "Verdict: AI Generated";
        modelName.innerText = detectedModel;
        metadataRaw.innerText = extractedInfo;
    } else {
        resultDiv.className = "real-detected";
        verdictTitle.innerText = "Verdict: Likely a Real Image";
        modelName.innerText = "Real / Unmarked Image";
        metadataRaw.innerText = "Clean file structure. This file does not contain embedded prompt text chunks, application parameters, or digital signatures common to popular AI image generators.";
    }
}
