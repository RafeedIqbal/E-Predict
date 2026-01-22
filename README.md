# ⚡ E-Predict

**E-Predict** is a powerful AI-driven tool designed to predict energy usage based on historical energy consumption and climate data. See detailed visualizations and highlight anomalies in energy patterns, helping identify irregularities and optimize energy efficiency.

---

## 🚀 Quick Start

To run the application, you'll need two terminal windows: one for the backend and one for the frontend.

### 1. Backend (Flask API)

**Prerequisites:** Python 3.12+

From the project root directory:

1. **Create and activate a virtual environment** (if you haven't already):
   ```bash
   # Windows
   python -m venv .venv
   .\.venv\Scripts\activate

   # macOS/Linux
   python3 -m venv .venv
   source .venv/bin/activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r flask-server/requirements.txt
   ```

3. **Set environment variables (Optional but recommended for production):**
   ```bash
   # Windows (PowerShell)
   $env:JWT_SECRET_KEY = "your-secure-secret-key"
   
   # macOS/Linux
   export JWT_SECRET_KEY="your-secure-secret-key"
   ```

4. **Run the server:**
   ```bash
   cd flask-server
   python app.py
   ```
   The backend will start at `http://localhost:5000`.

### 2. Frontend (Next.js)

**Prerequisites:** Node.js 18+

From the project root directory (open a new terminal):

1. **Install dependencies:**
   ```bash
   cd client
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```
   The frontend will start at `http://localhost:3000`.

---

## 🔑 Default Credentials

The application comes with a default admin user:
- **Username:** `admin`
- **Password:** `admin123`

---

## 🛠️ Project Structure

- **`/flask-server`**: Python Flask backend handling ML models (XGBoost/LSTM) and API endpoints.
- **`/client`**: Next.js frontend with Material UI (MUI) for the user interface.
