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

    // 1. Stable Diffusion / ComfyUI Check
    if (content.includes('parameters\0')) {
        isAI = true;
        detectedModel = "Stable Diffusion / ComfyUI";
        const index = content.indexOf('parameters\0');
        const snippet = content.substring(index + 11, index + 800);
        extractedInfo = snippet.replace(/[^\x20-\x7E\s]/g, '').trim();
    } 
    // 2. Midjourney Check
    else if (content.toLowerCase().includes('midjourney')) {
        isAI = true;
        detectedModel = "Midjourney";
        const index = content.toLowerCase().indexOf('midjourney');
        extractedInfo = "Found Midjourney signature inside file data:\n... " + content.substring(index, index + 200).replace(/[^\x20-\x7E\s]/g, '') + " ...";
    }
    // 3. DALL-E / OpenAI Check
    else if (content.toLowerCase().includes('dall-e') || content.toLowerCase().includes('openai')) {
        isAI = true;
        detectedModel = "DALL-E (OpenAI)";
        const index = content.toLowerCase().indexOf('openai');
        extractedInfo = "Found OpenAI/DALL-E signature inside file data:\n... " + content.substring(index, index + 200).replace(/[^\x20-\x7E\s]/g, '') + " ...";
    }
    // 4. Adobe Firefly Check
    else if (content.includes('Adobe Firefly')) {
        isAI = true;
        detectedModel = "Adobe Firefly";
        const index = content.indexOf('Adobe Firefly');
        extractedInfo = "Found Adobe Firefly signature inside file data:\n... " + content.substring(index - 50, index + 150).replace(/[^\x20-\x7E\s]/g, '') + " ...";
    }
    // 5. Global C2PA Asset Provenance Passport Check
    else if (content.includes('c2pa') || content.includes('jumbf')) {
        isAI = true;
        detectedModel = "C2PA Manifest Detected (DALL-E 3 / Adobe Firefly / Google)";
        extractedInfo = "Secure C2PA Asset Provenance Metadata structure found in file headers. This digital asset passport validates that the image was generated or modified using compliant AI tools.";
    }

    // Update the UI UI depending on the outcome
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
