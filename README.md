# 🤖 AI Image Detector

A lightweight, client-side web application that analyzes image files for **AI-generation signatures, metadata, and content provenance indicators**.

The tool runs entirely in the browser and can identify common fingerprints associated with AI image generators such as **Google Gemini, Stable Diffusion, ComfyUI, Midjourney, DALL·E, and Adobe Firefly**, along with C2PA-related provenance information.

> **Note:** This project is primarily a metadata and digital-forensics detector. It does not use a trained deep-learning model to analyze the visual pixels of an image.

---

## ✨ Features

- 🖼️ Drag-and-drop image upload
- 📂 Image file selection
- 🔍 Raw image-content inspection
- 🤖 AI generator signature detection
- 🔐 C2PA / Content Credentials detection
- 🧩 Metadata and fingerprint extraction
- 🎨 Detection for multiple AI platforms
- ⚡ Runs entirely in the browser
- 🔒 No image upload to a backend server
- 📱 Responsive and clean user interface

---

## 🧠 How It Works

The application reads the selected image directly in the browser and analyzes its raw file contents for known signatures and metadata patterns.

```text
                 ┌──────────────────┐
                 │    User Image    │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │   File Reader    │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │ Raw File Content │
                 └────────┬─────────┘
                          │
                          ▼
              ┌─────────────────────────┐
              │ Signature / Metadata    │
              │       Analysis          │
              └────────────┬────────────┘
                           │
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
          C2PA         AI Metadata    Generator
        Detection       Detection     Signatures
            │              │              │
            └──────────────┼──────────────┘
                           ▼
                  ┌─────────────────┐
                  │ Detection Result│
                  └─────────────────┘
```

---

## 🤖 Supported Detection Signatures

The current implementation checks for indicators associated with:

| Platform / Technology | Detection |
|---|---|
| Google Gemini | ✅ |
| Stable Diffusion | ✅ |
| ComfyUI | ✅ |
| Midjourney | ✅ |
| DALL·E / OpenAI | ✅ |
| Adobe Firefly | ✅ |
| C2PA | ✅ |
| Generic AI metadata | ✅ |

Detection is based on signatures and metadata found inside the image file.

---

## 🔐 Privacy

This application is designed to work **locally inside the browser**.

The selected image is read using the browser's `FileReader` API.

```text
Image
  │
  ▼
Your Browser
  │
  ├── Read file
  ├── Analyze contents
  └── Display result
```

There is currently no dedicated backend server or image database involved in the detection process.

---

## 🛠️ Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript

### Browser APIs

- File API
- FileReader API
- Drag & Drop API
- DOM API

### Detection Techniques

- Metadata inspection
- Raw file-content analysis
- String/signature matching
- C2PA-related fingerprint detection

---

## 📁 Project Structure

```text
Ai_img_dect/
│
├── index.html      # Main application interface
├── style.css       # UI styling and responsive design
├── script.js       # Image analysis and detection logic
└── README.md       # Project documentation
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Pruthvi-cs/Ai_img_dect.git
```

### 2. Open the project

```bash
cd Ai_img_dect
```

### 3. Run the application

Because this is a client-side web application, you can open:

```text
index.html
```

directly in a modern browser.

For development, you can also use a local server such as VS Code Live Server.

---

## 🖥️ Usage

1. Open the application.
2. Select an image or drag an image into the upload area.
3. Wait for the analysis to complete.
4. View the detection result.
5. Check the detected source or AI generator.
6. Inspect the extracted metadata/fingerprints.

---

## ⚠️ Limitations

This project is a **forensic metadata/signature detector**, not a complete AI-image classification model.

For example:

```text
AI Image
   │
   ▼
Metadata preserved
   │
   ▼
AI signature detected
   │
   ▼
AI detected ✅
```

However:

```text
AI Image
   │
   ▼
Screenshot / Re-export
   │
   ▼
Metadata removed
   │
   ▼
No signature found
   │
   ▼
AI may not be detected ⚠️
```

Therefore, the absence of an AI signature **does not prove that an image is human-created**.

Similarly, metadata-based detection can potentially produce false positives if unrelated metadata contains matching strings.

---

## 🔮 Future Improvements

Planned improvements could include:

- [ ] Deep-learning based image classification
- [ ] CNN / Vision Transformer analysis
- [ ] AI probability score
- [ ] EXIF metadata viewer
- [ ] More C2PA support
- [ ] More AI-generator fingerprints
- [ ] Image manipulation detection
- [ ] Screenshot / re-compressed image detection
- [ ] Image hash analysis
- [ ] Detailed forensic report generation
- [ ] Batch image analysis
- [ ] Browser extension version
- [ ] Improved detection confidence system

---

## 🎯 Project Goal

The goal of this project is to explore how **digital image forensics, metadata, content provenance, and AI-generation fingerprints** can be used to identify images that may have been generated or modified using artificial intelligence.

The project also provides a foundation for developing a more advanced **multi-layer AI image detection system** that combines:

```text
Metadata Analysis
       +
C2PA / Provenance
       +
Image Forensics
       +
Deep Learning
       ↓
AI Image Detection
```

---

## 🌐 Live Demo

Try the application online:

**[AI Image Detector](https://pruthvi-cs.github.io/Ai_img_dect/)**

---

## 📌 Disclaimer

This tool provides an indication based on detectable metadata and known signatures.

A result such as **"AI Generated"** should not be considered definitive proof, and a result such as **"Likely Real"** does not guarantee that an image was created by a human.

For reliable forensic or investigative use, results should be combined with additional evidence and specialized analysis.

---

## 👨‍💻 Author

**Pruthviraj A Rai**

GitHub: [@Pruthvi-cs](https://github.com/Pruthvi-cs)

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

Contributions, suggestions, and improvements are welcome.
