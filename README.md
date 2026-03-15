# 🩺 SkinScope AI

### *AI-Powered Skin Analysis & Personalized Dermatology Support*

SkinScope AI is a production-grade web application designed to empower users with instant, AI-driven skin health insights. By leveraging advanced deep learning models, the platform provides accurate detection of common skin conditions and generates personalized skincare routines tailored to individual skin types.

---

## 🚀 Features

- **🧠 AI Disease Detection**: Analyze skin conditions with high accuracy using a specialized Vision Transformer (ViT) model.
- **📋 Personalized Routines**: Guided assessments to build customized daily skincare regimens.
- **📷 Multi-Mode Input**: Support for image uploads, live camera capture, and remote IP camera integration.
- **📄 Smart Reporting**: Generate and export diagnostic reports as PDFs for dermatology consultations.
- **❓ Interactive FAQ**: Comprehensive knowledge base with an accordion-style interface for quick answers.
- **📱 Responsive Design**: Fully optimized for mobile, tablet, and desktop experiences.
- **✨ Modern UI/UX**: Clean, professional interface with smooth transitions and micro-animations.

---

## 🧠 How It Works

1. **Capture/Upload**: Capture a clear, well-lit photo of the affected area or upload an existing image.
2. **AI Analysis**: The integrated AI model scans the image for over 20+ skin conditions (acne, eczema, melanoma, etc.).
3. **Assessment**: Complete a brief skin behavior questionnaire to provide context for the AI.
4. **Insights & Care**: Receive a detailed report identifying potential conditions and a suggested skincare routine.
5. **Professional Guidance**: Export results to share with a dermatologist for clinic-grade diagnosis.

---

## 🛠️ Tech Stack

- **Frontend**: 
  - Standard-compliant HTML5 & Semantic UI
  - Vanilla CSS3 (Custom Design System)
  - JavaScript (ES6+) for dynamic interactions
- **Backend**:
  - Python 3.x
  - FastAPI (High-performance web framework)
  - Uvicorn (ASGI server)
- **AI/ML**:
  - Hugging Face Transformers (`LaurianeMD/vit-skin-disease`)
  - PyTorch / TensorFlow
- **Utilities**:
  - `html2canvas` & `jspdf` for document generation
  - `Lottie` for interactive animations

---

## ⚙️ How to Run

### 🔹 1. Clone the Repository

```bash
git clone https://github.com/yourusername/dermai
cd dermai
```

---

### 🔹 2. Install Dependencies

```bash
pip install -r requirements.txt
```

---

### 🔹 3. Start Backend (FastAPI)

```bash
uvicorn src.python.app:app --host 127.0.0.1 --port 8000 --reload
```

---

### 🔹 4. Open Frontend

Open the following file in your live server browser:

```text
src/html/disease.html
```

---

### 🔹 5. Use the Application

* Click **Upload Image** → Select an image → Click Upload
* OR use **Camera / IP Cam / Enter Details**
* View results displayed on the page

---

### 🔹 6. (Optional) Fix CORS Issues

If needed, ensure backend allows requests:

```python
allow_origins=["*"]
```

---

### ✅ Expected Output

* Backend runs on: `http://127.0.0.1:8000`
* Frontend loads successfully
* Uploading an image returns prediction with confidence

---:::


## 📁 Project Structure

```text
SkinScope-AI/
├── index.html            # Main Landing Page
├── src/
│   ├── html/             # Feature-specific pages (disease.html, routine.html)
│   ├── css/              # Modular stylesheets
│   ├── js/               # Frontend logic and UI controllers
│   ├── img/              # Optimized assets and UI graphics
│   └── python/           # Backend API and ML inference logic
├── backend/              # Additional backend resources
├── model/                # ML Model assets/cache
├── Procfile              # Deployment configuration
└── requirements.txt      # Python dependencies
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Python 3.9+
- A modern web browser
- VS Code (recommended with "Live Server" extension)

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/SkinScope-AI.git
cd SkinScope-AI
```

### 2. Backend Setup
```bash
pip install -r requirements.txt
python -m src.python.app
```
*The API will be available at `http://127.0.0.1:8000`.*

### 3. Frontend Execution
- Open `index.html` using **Live Server** in VS Code.
- Ensure the backend is running to enable AI prediction features.

---

## ▶️ Usage

1. Select **"Detect Disease"** from the navigation bar.
2. Follow the on-screen instructions for optimal photo capture.
3. Review the AI-generated analysis.
4. Switch to **"Skin Care Routine"** for personalized product and care suggestions.

---

## 📌 Future Improvements

- [ ] Integration with tele-dermatology services for direct consultations.
- [ ] Multi-language support (Regional languages).
- [ ] Expanded AI training for rarer dermatological conditions.
- [ ] User profile system for tracking skin health over time.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Team

Developed by the **SkinScope AI Team** — a collective dedicated to bridging the gap between artificial intelligence and accessible healthcare.

---
*Disclaimer: SkinScope AI provides AI-generated insights and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified health provider.*
