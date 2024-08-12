#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

clear
# Create log directory if it doesn't exist
LOG_DIR="logs"
if [ ! -d "$LOG_DIR" ]; then
    mkdir -p "$LOG_DIR"
fi

# Kill everything running on ports 1978, 1979, 1980
for port in 1978 1979 1980; do
    pids=$(lsof -t -i:$port) || true
    for pid in $pids; do
        echo "Killing process on port $port with PID $pid" >> "$LOG_DIR/cleanup.log"
        kill $pid
    done
done
pkill -f pm2

# Start the spa first
if [ ! -d "spa" ] || [ ! -d "spa/src" ]; then
    rm -rf spa
    echo "[0/3] Creating React app in 'spa' directory ..."
    echo "[0/3] Creating React app in 'spa' directory" >> "$LOG_DIR/setup.log"
    npx create-react-app spa >> "$LOG_DIR/setup.log" 2>&1
    cd spa
    npm install @emotion/react @emotion/styled @mui/icons-material @mui/material >> "../$LOG_DIR/setup.log" 2>&1
    cd ..
fi

echo "[1/3] Starting SPA on port 1978 ..."
echo "[1/3] Starting SPA on port 1978" >> "$LOG_DIR/start.log"
cd spa
npm install >> "../$LOG_DIR/spa.log" 2>&1
# Start SPA in the background and show spinner
BROWSER=none PORT=1978 npm start >> "../$LOG_DIR/spa.log" 2>&1 &
cd ..

# Start the server
echo "[2/3] Starting server on port 1979 ..."
echo "[2/3] Starting server on port 1979" >> "$LOG_DIR/start.log"
cd server
npm install >> "../$LOG_DIR/server.log" 2>&1
# Start server in the background and show spinner
pm2 -f start app.js --watch >> "../$LOG_DIR/server.log" 2>&1 &
cd ..

# Start the client
echo "[3/3] Starting client on port 1980 ..."
echo "[3/3] Starting client on port 1980" >> "$LOG_DIR/start.log"
cd client
npm install >> "../$LOG_DIR/client.log" 2>&1
# Start client in the background and show spinner
PORT=1980 npm start >> "../$LOG_DIR/client.log" 2>&1 &

cd ..

echo "All services started successfully"
