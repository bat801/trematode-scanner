from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
from pathlib import Path
from model import detect_parasites

app = FastAPI(title="Trematode Scanner API")

# Разрешаем запросы с фронтенда (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Для разработки. Потом заменишь на свой домен
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Создаем папку для загрузок, если её нет
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@app.get("/")
def root():
    return {"message": "Trematode Scanner API is running!"}

@app.post("/detect/")
async def detect(file: UploadFile = File(...)):
    # 1. Сохраняем загруженный файл
    file_path = UPLOAD_DIR / file.filename
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        # 2. Запускаем детекцию (вызываем функцию из model.py)
        result = detect_parasites(str(file_path))
        
        # 3. Удаляем временный файл (чтобы не забивать диск)
        os.remove(file_path)
        
        # 4. Возвращаем JSON с результатами
        return JSONResponse(content=result)
    
    except Exception as e:
        # Если ошибка — удаляем файл и возвращаем ошибку
        if file_path.exists():
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=str(e))