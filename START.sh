#!/bin/bash

# Smart Office Routing Agent - Unix/Linux Startup Script

echo ""
echo "============================================================"
echo "Smart Office Routing Agent - Integrated Setup"
echo "============================================================"
echo ""
echo "Installing dependencies and building application..."
echo ""

python run.py

if [ $? -ne 0 ]; then
    echo ""
    echo "Error running setup. Please check the output above."
    exit 1
fi
