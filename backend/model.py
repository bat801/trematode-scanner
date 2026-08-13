from ultralytics import YOLO
import cv2
import numpy as np
import base64

# Загружаем предобученную модель YOLOv8s
# Она умеет находить общие объекты, но пока не паразитов
# Поэтому мы будем использовать OpenCV для поиска круглых темных пятен
model = YOLO('yolov8s.pt')

def detect_parasites(image_path: str):
    # Читаем изображение
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError("Не удалось загрузить изображение")
    
    # Конвертируем в оттенки серого
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Размытие для уменьшения шума
    blurred = cv2.GaussianBlur(gray, (9, 9), 2)
    
    # Адаптивный порог для выделения темных пятен на светлом фоне
    thresh = cv2.adaptiveThreshold(
        blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
        cv2.THRESH_BINARY_INV, 11, 2
    )
    
    # Находим контуры (границы объектов)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    detections = []
    for cnt in contours:
        area = cv2.contourArea(cnt)
        perimeter = cv2.arcLength(cnt, True)
        if perimeter == 0:
            continue
        
        # Вычисляем циркулярность (насколько объект похож на круг)
        # Если объект идеально круглый, circularity = 1.0
        circularity = 4 * np.pi * (area / (perimeter * perimeter))
        
        # Получаем ограничивающий прямоугольник
        x, y, w, h = cv2.boundingRect(cnt)
        
        # Фильтруем по размеру и форме
        # 50 < area < 2000 — отсеивает слишком маленькие и слишком большие объекты
        # 0.7 < circularity < 1.3 — отсеивает не круглые объекты
        if 0.7 < circularity < 1.3 and 50 < area < 2000:
            detections.append({
                "x": int(x),
                "y": int(y),
                "width": int(w),
                "height": int(h),
                "confidence": round(circularity, 2),
                "label": "Подозрительный объект"
            })
    
    # Отрисовываем зеленые рамки на изображении
    img_with_boxes = img.copy()
    for d in detections:
        cv2.rectangle(
            img_with_boxes, 
            (d["x"], d["y"]), 
            (d["x"] + d["width"], d["y"] + d["height"]), 
            (0, 255, 0),  # Зеленый цвет
            2  # Толщина линии
        )
        # Добавляем подпись над рамкой
        cv2.putText(
            img_with_boxes, 
            f"{d['label']} {d['confidence']}", 
            (d["x"], d["y"] - 5), 
            cv2.FONT_HERSHEY_SIMPLEX, 
            0.5, 
            (0, 255, 0), 
            1
        )
    
    # Конвертируем картинку в base64 для отправки на фронт
    _, buffer = cv2.imencode('.jpg', img_with_boxes)
    img_base64 = base64.b64encode(buffer).decode('utf-8')
    
    return {
        "detections": detections,
        "image": img_base64,
        "count": len(detections)
    }