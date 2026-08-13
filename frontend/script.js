const API_URL = 'http://localhost:8000/detect/';

// DOM Elements
const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const analyzeBtn = document.getElementById('analyzeBtn');
const clearBtn = document.getElementById('clearBtn');
const resultImage = document.getElementById('resultImage');
const countDisplay = document.getElementById('countDisplay');
const statusDisplay = document.getElementById('statusDisplay');
const loading = document.getElementById('loading');
const resultContainer = document.getElementById('resultContainer');

// Future feature buttons
const saveResultsBtn = document.getElementById('saveResultsBtn');
const exportCSVBtn = document.getElementById('exportCSVBtn');
const exportReportBtn = document.getElementById('exportReportBtn');

let selectedFile = null;
let isProcessing = false;
let currentImageUrl = null;
let lastResult = null; // Store last result for future export

// ============================================================
// 1. FILE UPLOAD HANDLERS
// ============================================================
uploadArea.addEventListener('click', function(e) {
    if (e.target === fileInput) return;
    fileInput.click();
});

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
    fileInput.value = '';
});

// ============================================================
// 2. FILE HANDLER
// ============================================================
function handleFile(file) {
    if (isProcessing) return;
    
    selectedFile = file;
    analyzeBtn.disabled = false;
    statusDisplay.textContent = '📤';
    
    if (currentImageUrl) {
        URL.revokeObjectURL(currentImageUrl);
    }
    currentImageUrl = URL.createObjectURL(file);
    resultImage.src = currentImageUrl;
    resultImage.style.display = 'block';
    resultContainer.classList.add('active');
    countDisplay.textContent = '⏳';
}

// ============================================================
// 3. ANALYSIS
// ============================================================
analyzeBtn.addEventListener('click', async function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (!selectedFile || isProcessing) return;

    isProcessing = true;
    analyzeBtn.disabled = true;
    loading.classList.add('active');
    statusDisplay.textContent = '🧬';
    
    resultImage.style.display = 'none';
    countDisplay.textContent = '⏳';
    
    // Disable future feature buttons
    saveResultsBtn.disabled = true;
    exportCSVBtn.disabled = true;
    exportReportBtn.disabled = true;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server error (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        
        console.log('✅ Analysis complete, found:', data.count);
        lastResult = data;
        
        // Convert base64 to Blob
        const base64Data = data.image;
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        
        if (currentImageUrl) {
            URL.revokeObjectURL(currentImageUrl);
        }
        currentImageUrl = URL.createObjectURL(blob);
        
        resultImage.src = currentImageUrl;
        resultImage.style.display = 'block';
        countDisplay.textContent = data.count;
        statusDisplay.textContent = data.count > 0 ? '✅' : '🔍';
        
        loading.classList.remove('active');
        isProcessing = false;
        analyzeBtn.disabled = false;
        
        // Enable future feature buttons (with dummy functionality)
        saveResultsBtn.disabled = false;
        exportCSVBtn.disabled = false;
        exportReportBtn.disabled = false;
        
        if (data.count === 0) {
            alert('No suspicious objects found. Try another image.');
        }

    } catch (error) {
        console.error('❌ Error:', error);
        alert('Analysis error: ' + error.message);
        countDisplay.textContent = '❌';
        statusDisplay.textContent = '❌';
        loading.classList.remove('active');
        isProcessing = false;
        analyzeBtn.disabled = false;
        resultImage.style.display = 'none';
    }
});

// ============================================================
// 4. CLEAR
// ============================================================
clearBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    selectedFile = null;
    lastResult = null;
    fileInput.value = '';
    
    if (currentImageUrl) {
        URL.revokeObjectURL(currentImageUrl);
        currentImageUrl = null;
    }
    
    resultImage.src = '';
    resultImage.style.display = 'none';
    resultContainer.classList.remove('active');
    countDisplay.textContent = '0';
    statusDisplay.textContent = '⏳';
    analyzeBtn.disabled = true;
    isProcessing = false;
    loading.classList.remove('active');
    
    saveResultsBtn.disabled = true;
    exportCSVBtn.disabled = true;
    exportReportBtn.disabled = true;
});

// ============================================================
// 5. FUTURE FEATURE BUTTONS (Placeholders)
// ============================================================
saveResultsBtn.addEventListener('click', function(e) {
    e.preventDefault();
    showComingSoon('Save Results');
});

exportCSVBtn.addEventListener('click', function(e) {
    e.preventDefault();
    showComingSoon('Export CSV');
});

exportReportBtn.addEventListener('click', function(e) {
    e.preventDefault();
    showComingSoon('Download Report');
});

function showComingSoon(featureName) {
    // Show a nice toast notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--bg-card, #162b20);
        color: var(--text-primary, #e8f5e9);
        padding: 14px 28px;
        border-radius: 12px;
        border: 1px solid var(--accent-green, #43a047);
        box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        font-size: 15px;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
        font-family: 'Segoe UI', sans-serif;
        text-align: center;
        max-width: 90%;
    `;
    notification.innerHTML = `
        <span style="font-size:20px;">🚀</span>
        <strong>${featureName}</strong> — coming soon in the next update!
        <br>
        <span style="font-size:13px; color: var(--text-muted, #6d8f7a);">
            This feature is currently in development
        </span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.4s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3500);
}

// ============================================================
// 6. FORM PROTECTION
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('uploadForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
    }
});

console.log('🚀 Trematode Scanner loaded successfully!');
console.log('🔬 Prototype v0.1 - Built with ❤️ for biology researchers');