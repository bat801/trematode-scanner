const API_URL = 'http://localhost:8000/detect/';
const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const analyzeBtn = document.getElementById('analyzeBtn');
const clearBtn = document.getElementById('clearBtn');
const resultImage = document.getElementById('resultImage');
const countDisplay = document.getElementById('countDisplay');
const loading = document.getElementById('loading');
const resultContainer = document.getElementById('resultContainer');

let selectedFile = null;
let isProcessing = false;
let currentImageUrl = null; // Для хранения URL объекта

// --------------------------------------------------------------
// 1. ЗАГРУЗКА ФАЙЛА
// --------------------------------------------------------------
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

// --------------------------------------------------------------
// 2. ОБРАБОТКА ВЫБРАННОГО ФАЙЛА
// --------------------------------------------------------------
function handleFile(file) {
    if (isProcessing) return;
    
    selectedFile = file;
    analyzeBtn.disabled = false;
    
    // Создаем URL для предпросмотра
    if (currentImageUrl) {
        URL.revokeObjectURL(currentImageUrl);
    }
    currentImageUrl = URL.createObjectURL(file);
    resultImage.src = currentImageUrl;
    resultImage.style.display = 'block';
    resultContainer.classList.add('active');
    countDisplay.textContent = '⏳';
}

// --------------------------------------------------------------
// 3. АНАЛИЗ ИЗОБРАЖЕНИЯ
// --------------------------------------------------------------
analyzeBtn.addEventListener('click', async function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (!selectedFile || isProcessing) return;

    isProcessing = true;
    analyzeBtn.disabled = true;
    loading.style.display = 'block';
    
    // Скрываем старое изображение на время загрузки
    resultImage.style.display = 'none';
    countDisplay.textContent = '⏳';

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ошибка сервера (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        
        console.log('✅ Анализ завершен, найдено:', data.count);
        
        // Конвертируем base64 в Blob
        const base64Data = data.image;
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        
        // Создаем URL для результата
        if (currentImageUrl) {
            URL.revokeObjectURL(currentImageUrl);
        }
        currentImageUrl = URL.createObjectURL(blob);
        
        // Устанавливаем изображение
        resultImage.src = currentImageUrl;
        resultImage.style.display = 'block';
        countDisplay.textContent = data.count;
        loading.style.display = 'none';
        isProcessing = false;
        analyzeBtn.disabled = false;
        
        if (data.count === 0) {
            alert('Объектов не найдено. Попробуйте другое фото.');
        }

    } catch (error) {
        console.error('❌ Ошибка:', error);
        alert('Ошибка при анализе: ' + error.message);
        countDisplay.textContent = '❌';
        loading.style.display = 'none';
        isProcessing = false;
        analyzeBtn.disabled = false;
        resultImage.style.display = 'none';
    }
});

// --------------------------------------------------------------
// 4. ОЧИСТКА
// --------------------------------------------------------------
clearBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    selectedFile = null;
    fileInput.value = '';
    if (currentImageUrl) {
        URL.revokeObjectURL(currentImageUrl);
        currentImageUrl = null;
    }
    resultImage.src = '';
    resultImage.style.display = 'none';
    resultContainer.classList.remove('active');
    countDisplay.textContent = '0';
    analyzeBtn.disabled = true;
    isProcessing = false;
    loading.style.display = 'none';
});

// --------------------------------------------------------------
// 5. ДОПОЛНИТЕЛЬНАЯ ЗАЩИТА ОТ ОБНОВЛЕНИЯ СТРАНИЦЫ
// --------------------------------------------------------------
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

console.log('🚀 Trematode Scanner загружен!');