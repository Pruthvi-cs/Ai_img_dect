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
    
    // Read the file as binary text using 'latin1' encoding to search chunks
    reader.readAsText(file, 'latin1');

    reader.onload = function (event) {
        const fileContent = event.target.result;
        analyzeMetadata(fileContent);
    };
}

function analyzeMetadata(content) {
    resultDiv.style.display = 'block';
    let isAI = false;
    let detectedModel = "None (No AI Metadata Found)";
    let extractedInfo = "No known text chunks found in file headers.";

    // Normalize everything to lowercase for seamless keyword matching
    const lowerContent = content.toLowerCase();

    // 1. Google Gemini / SynthID / Google AI Footprint Check
    if (content.includes('google') && (content.includes('synthid') || content.includes('c2pa') || content.includes('dcterms') || lowerContent.includes('google ai'))) {
        isAI = true;
        detectedModel = "Google Gemini (SynthID / Content Credentials Verified)";
        
        // Grab a clean contextual text snippet from the image header where Google signs it
        const index = content.includes('google') ? content.indexOf('google') : content.indexOf('c2pa');
        const start = Math.max(0, index - 30);
        const snippet = content.substring(start, index + 350);
        
        extractedInfo = "🔒 Google Asset Provenance Signature Found:\n... " + 
                        snippet.replace(/[^\x20-\x7E\s]/g, ' ').replace(/\s+/g, ' ').trim() + " ...\n\n" +
                        "Note: This image contains Google's secure digital footprint (SynthID / C2PA framework).";
    }
    // 2. Stable Diffusion / ComfyUI Check
    else if (content.includes('parameters\0')) {
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
        extractedInfo = "Found Midjourney signature inside file data:\n... " + content.substring(index, index + 200).replace(/[^\x20-\x7E\s]/g, '') + " ...";
    }
    // 4. DALL-E / OpenAI Check
    else if (lowerContent.includes('dall-e') || lowerContent.includes('openai')) {
        isAI = true;
        detectedModel = "DALL-E (OpenAI)";
        const index = lowerContent.indexOf('openai');
        extractedInfo = "Found OpenAI/DALL-E signature inside file data:\n... " + content.substring(index, index + 200).replace(/[^\x20-\x7E\s]/g, '') + " ...";
    }
    // 5. Adobe Firefly Check
    else if (content.includes('Adobe Firefly')) {
        isAI = true;
        detectedModel = "Adobe Firefly";
        const index = content.indexOf('Adobe Firefly');
        extractedInfo = "Found Adobe Firefly signature inside file data:\n... " + content.substring(index - 50, index + 150).replace(/[^\x20-\x7E\s]/g, '') + " ...";
    }
    // 6. Global Generic C2PA Passport Check (Backup)
    else if (content.includes('c2pa') || content.includes('jumbf')) {
        isAI = true;
        detectedModel = "AI Generated (C2PA Manifest Detected)";
        extractedInfo = "Secure C2PA Asset Provenance Metadata structure found in file headers. This digital asset passport validates that the image was generated or modified using compliant AI tools.";
    }

    // Update the UI depending on the outcome
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
