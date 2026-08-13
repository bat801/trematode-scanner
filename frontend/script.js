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

// 1. Загрузка файла через клик или драг-н-дроп
uploadArea.addEventListener('click', () => fileInput.click());

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
    if (e.dataTransfer.files.length) {
        handleFile(e.dataTransfer.files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
        handleFile(e.target.files[0]);
    }
});

function handleFile(file) {
    selectedFile = file;
    analyzeBtn.disabled = false;
    
    // Показываем превью
    const reader = new FileReader();
    reader.onload = (e) => {
        resultImage.src = e.target.result;
        resultImage.style.display = 'block';
        resultContainer.classList.add('active');
        countDisplay.textContent = '⏳';
    };
    reader.readAsDataURL(file);
}

// 2. Анализ изображения
analyzeBtn.addEventListener('click', async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    loading.style.display = 'block';
    analyzeBtn.disabled = true;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const data = await response.json();
        
        // Отображаем результат
        resultImage.src = `data:image/jpeg;base64,${data.image}`;
        countDisplay.textContent = data.count;

        if (data.count === 0) {
            alert('Объектов не найдено. Попробуйте другое фото.');
        }

    } catch (error) {
        alert('Ошибка при анализе: ' + error.message);
        countDisplay.textContent = '❌';
    } finally {
        loading.style.display = 'none';
        analyzeBtn.disabled = false;
    }
});

// 3. Очистка
clearBtn.addEventListener('click', () => {
    selectedFile = null;
    fileInput.value = '';
    resultImage.src = '';
    resultImage.style.display = 'none';
    resultContainer.classList.remove('active');
    countDisplay.textContent = '0';
    analyzeBtn.disabled = true;
});