#!/bin/bash

# Setup and Run Script for E-Predict

# Function to kill processes on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    if [ -n "$FLASK_PID" ]; then
        kill $FLASK_PID 2>/dev/null
    fi
    if [ -n "$NEXT_PID" ]; then
        kill $NEXT_PID 2>/dev/null
    fi
    exit
}

trap cleanup SIGINT EXIT

echo "🚀 Initializing E-Predict Setup..."

# 1. Backend Setup
echo ""
echo "-----------------------------------"
echo "🐍 Setting up Backend (Flask)..."
echo "-----------------------------------"

if [ ! -d ".venv" ]; then
    echo "Creating Python virtual environment..."
    python -m venv .venv
else
    echo "Virtual environment found."
fi

# Activate venv - try Windows path first, then Unix
if [ -f ".venv/Scripts/activate" ]; then
    source .venv/Scripts/activate
elif [ -f ".venv/bin/activate" ]; then
    source .venv/bin/activate
else
    echo "❌ Could not find activation script. Please check your python installation."
    exit 1
fi

echo "Installing Python dependencies..."
pip install -r flask-server/requirements.txt --quiet --disable-pip-version-check
echo "Backend dependencies installed."

# 2. Frontend Setup
echo ""
echo "-----------------------------------"
echo "⚛️  Setting up Frontend (Next.js)..."
echo "-----------------------------------"

cd client
if [ ! -d "node_modules" ]; then
    echo "Installing Node modules (this may take a moment)..."
    npm install
else
    echo "Node modules found."
fi
cd ..

# 3. Start Servers
echo ""
echo "-----------------------------------"
echo "⚡ Starting Servers..."
echo "-----------------------------------"

# Start Flask Backend
echo "Starting Flask API on port 5000..."
cd flask-server
# Use exec to ensure signal handling works nicely or just run in background
python app.py &
FLASK_PID=$!
cd ..

# Wait a few seconds for Backend to initialize
sleep 3

# Start Next.js Frontend
echo "Starting Next.js Frontend on port 3000..."
cd client
npm run dev &
NEXT_PID=$!
cd ..

echo ""
echo "✅ Application Component Status:"
echo "   - Backend:  http://localhost:5000"
echo "   - Frontend: http://localhost:3000"
echo ""
echo "👉 Press Ctrl+C to stop both servers."

wait
