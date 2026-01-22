# ⚡ E-Predict

**E-Predict** is a comprehensive AI-driven tool for analyzing, predicting, and detecting anomalies in energy consumption data. By leveraging advanced machine learning models (XGBoost and LSTM) and correlating energy usage with climate data, it helps utilities, researchers, and energy managers identify irregularities and optimize efficiency.

---

## � What it Does

- **Data Aggregation**: Automatically fetches and merges hourly energy consumption data from the **IESO** (Independent Electricity System Operator) with historical climate data.
- **Predictive Modeling**: Trains two powerful models on the fly:
  - **XGBoost**: Gradient boosting framework for robust regression.
  - **LSTM (Long Short-Term Memory)**: Recurrent neural network specialized for time-series forecasting.
- **Anomaly Detection**: Compares predicted consumption against actual usage, applying statistical thresholds and **Gaussian Mixture Models (GMM)** to identify outliers (spikes, drops, or irregular patterns).
- **Visualization**: Generates interactive charts, loss curves, and anomaly heatmaps or scatter plots.

---

## 🚀 Quick Start (Recommended)

The easiest way to set up and run the application is using the provided automation scripts.

### Usage

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Anomaly-Detection-App
   ```

2. **Run the setup script:**

   - **Windows (Command Prompt / PowerShell)**:
     Double-click `run.bat` or run:
     ```cmd
     .\run.bat
     ```

   - **Linux / macOS / Git Bash**:
     Run the shell script:
     ```bash
     ./run.sh
     ```

   **What the script does:**
   - Checks for and creates a Python virtual environment (`.venv`).
   - Installs all backend dependencies (`Flask`, `pandas`, `tensorflow`, etc.).
   - Installs all frontend dependencies (`Next.js`, `MUI`, etc.).
   - Launches both the Backend (Port 5000) and Frontend (Port 3000) concurrently.

3. **Access the App:**
   Open your browser to [http://localhost:3000](http://localhost:3000).

---

## 🛠️ Manual Installation

If you prefer to run components manually:

### 1. Backend (Flask)
```bash
# Setup Environment
python -m venv .venv
# Windows: .\.venv\Scripts\activate
# Mac/Linux: source .venv/bin/activate

# Install Deps
pip install -r flask-server/requirements.txt

# Run
cd flask-server
python app.py
```

### 2. Frontend (Next.js)
```bash
cd client
npm install
npm run dev
```

---

## 📖 How to Use

1. **Create Dataset**:
   - Navigate to **"Create New Dataset"**.
   - Select your data type: **Zonal** (e.g., Toronto, Ottawa) or **FSA** (Forward Sortation Area).
   - Choose a date range. The app will fetch IESO energy data and merge it with climate predictors.
   
2. **Train & Analyze**:
   - Go to **"Analysis"**.
   - Select **XGBoost** or **LSTM** to train the model on your generated dataset.
   - View performance metrics (RMSE, R²) and loss curves to verify model accuracy.

3. **Detect Anomalies**:
   - Proceed to **"Anomaly Detection"**.
   - The system uses the trained model to calculate error margins for every data point.
   - View top anomalies, streak analysis, and visualizations of where energy usage deviated significantly from the model's prediction.

---

## 🏗️ Architecture

- **Frontend**: Built with **Next.js 15** and **React**, utilizing **Material UI (MUI)** for a responsive, dark-themed interface.
- **Backend**: **Flask** API serving as the orchestration layer.
- **ML Engine**:
  - **Pandas/NumPy**: Data processing and merging.
  - **Meteostat**: Climate data retrieval.
  - **TensorFlow/Keras**: LSTM model implementation.
  - **XGBoost**: Gradient boosting implementation.
  - **Scikit-Learn**: Anomaly scoring (GMM).

---

## 🔑 Default Credentials

- **Username**: `admin`
- **Password**: `admin123`
