#!/bin/bash

# SmartLLMs Deploy Script
# This script starts both backend and frontend servers

echo "🚀 Starting SmartLLMs deployment..."

# Function to cleanup processes on exit
cleanup() {
    echo "🛑 Stopping servers..."
    pkill -f "python.*app.py" 2>/dev/null
    pkill -f "pnpm.*dev" 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Kill any existing processes on ports 3000 and 3001
echo "🧹 Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null

# Start backend server
echo "🔧 Starting backend server (Flask) on port 3001..."
cd backend
python app.py &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Check if backend is running
if curl -s http://127.0.0.1:3001/api/hello > /dev/null; then
    echo "✅ Backend server is running!"
else
    echo "❌ Backend server failed to start"
    cleanup
fi

# Start frontend server
echo "🎨 Starting frontend server (Next.js) on port 3000..."
cd frontend
pnpm build
pnpm start &
FRONTEND_PID=$!
cd ..

# Wait a moment for frontend to start
sleep 5

# Check if frontend is running
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend server is running!"
else
    echo "❌ Frontend server failed to start"
    cleanup
fi

# Display the URLs
echo ""
echo "🎉 SmartLLMs is now running!"
echo ""
echo "📱 Frontend (Main Application):"
echo "   http://localhost:3000"
echo ""
echo "🔧 Backend API Endpoints:"
echo "   Health Check: http://127.0.0.1:3001/api/hello"
echo "   Video Analysis: http://127.0.0.1:3001/api/get/{video_id}?prompt={query}"
echo "   Video Info: http://127.0.0.1:3001/api/info/{video_id}"
echo ""
echo "💡 Example API call:"
echo "   curl \"http://127.0.0.1:3001/api/get/rfG8ce4nNh0?prompt=matrix multiplication\""
echo ""
echo "🛑 Press Ctrl+C to stop all servers"
echo ""

# Keep the script running
wait 