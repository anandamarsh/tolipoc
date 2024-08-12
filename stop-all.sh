#!/bin/bash
# Kill everything running on ports 1978, 1979, 1980
for port in 1978 1979 1980; do
    echo "Attempting to kill processes on port $port" 
    pids=$(lsof -t -i:$port) || true
    for pid in $pids; do
        echo "Killing process with PID $pid on port $port"
        kill -9 $pid || echo "Failed to kill process with PID $pid"
    done
done
pkill -f pm2

# Ensure processes are killed
for port in 1978 1979 1980; do
    if lsof -i:$port > /dev/null; then
        echo "Port $port is still in use" 
    else
        echo "Port $port is free" 
    fi
done

echo "All services stopped successfully"