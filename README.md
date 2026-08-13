# 🦐 Trematode Scanner

[![Python](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.141-green.svg)](https://fastapi.tiangolo.com/)
[![YOLO](https://img.shields.io/badge/YOLO-8.4-purple.svg)](https://ultralytics.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**AI-powered parasite detection tool for Petri dish analysis.**

## 🎯 Problem

Biologists spend hours visually scanning Petri dishes with fish/sea urchin samples to detect trematode parasites (metacercariae). This is tedious, time-consuming, and leads to eye fatigue and missed detections.

## 💡 Solution

Trematode Scanner is a web application that uses computer vision (OpenCV + YOLOv8) to automatically detect suspicious circular objects in Petri dish images. It highlights potential parasites with green bounding boxes, significantly reducing manual screening time.

## ✨ Features

- 📸 Upload photos of Petri dishes (drag & drop support)
- 🧠 AI-powered detection of circular parasitic objects
- 🟩 Visual highlighting with bounding boxes
- 📊 Real-time detection count
- 🔄 Clean and intuitive user interface
- 🚀 FastAPI backend with async processing

## 🛠️ Tech Stack

### Backend
- **FastAPI** — Modern Python web framework
- **OpenCV** — Image processing and contour detection
- **Ultralytics YOLOv8** — Object detection (ready for custom training)
- **Python 3.12**

### Frontend
- **HTML5 / CSS3** — Clean, responsive interface
- **Vanilla JavaScript** — No frameworks needed
- **REST API** — Communication with backend

## 🚀 Quick Start

### Prerequisites
- Python 3.12 or higher
- pip (Python package manager)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/trematode-scanner.git
cd trematode-scanner
```

2. Create and activate virtual environment:
```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the backend server:
```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

5. Run the frontend (in a new terminal):
```bash
cd ../frontend
python -m http.server 5500
```

6. Open your browser at `http://localhost:5500`

## 🧪 How It Works

1. **Upload**: Biologist uploads a photo of a Petri dish
2. **Detection**: Backend processes the image using:
   - Adaptive thresholding to find dark regions
   - Contour detection to identify circular objects
   - Circularity filtering (0.7 < circularity < 1.3)
   - Size filtering (50 < area < 2000 pixels)
3. **Visualization**: Results are returned with green bounding boxes
4. **Reporting**: Detection count is displayed instantly

## 📊 Example

| Input | Output |
|-------|--------|
| ![Input](https://via.placeholder.com/300x200?text=Petri+Dish+Image) | ![Output](https://via.placeholder.com/300x200?text=Detected+Objects) |

## 🔮 Future Improvements

- [ ] Train YOLOv8 on real trematode datasets
- [ ] Add SQLite database for analysis history
- [ ] Export results to CSV/Excel
- [ ] Support for microscope image formats (.tiff, .czi)
- [ ] Batch processing for multiple images
- [ ] User authentication and result sharing

## 🤝 Contributing

This is a proof-of-concept project. Contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for researchers working on trematode detection
- Inspired by real-world needs in parasitology labs

Project Link: [https://github.com/bat801/trematode-scanner](https://github.com/bat801/trematode-scanner)
