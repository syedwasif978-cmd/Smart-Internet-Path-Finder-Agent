#!/usr/bin/env python
"""
Integrated startup script for Smart Office Routing Agent.
Installs dependencies, builds React frontend, and starts FastAPI backend.
Single access point: http://localhost:8000
"""
import os
import subprocess
import sys

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(PROJECT_ROOT, "backend")
FRONTEND_DIR = os.path.join(PROJECT_ROOT, "frontend")
FRONTEND_BUILD = os.path.join(FRONTEND_DIR, "build")


def run_command(cmd, cwd=None, shell=False):
    """Run a shell command and return success status."""
    print(f"\n{'='*60}")
    print(f"Running: {cmd}")
    print(f"{'='*60}\n")
    try:
        result = subprocess.run(cmd, cwd=cwd, shell=shell, check=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Command failed: {cmd}")
        print(f"Error: {e}")
        return False


def setup_and_run():
    """Setup and run the full integrated application."""
    print("\n🚀 Smart Office Routing Agent - Integrated Setup\n")

    # Step 1: Install Python backend dependencies
    print("📦 Step 1: Installing backend dependencies...")
    if not run_command(
        f"{sys.executable} -m pip install -r requirements.txt",
        cwd=PROJECT_ROOT,
        shell=True,
    ):
        return False

    # Step 2: Install Node.js frontend dependencies
    print("\n📦 Step 2: Installing frontend dependencies...")
    if not run_command("npm install", cwd=FRONTEND_DIR, shell=True):
        return False

    # Step 3: Build React frontend
    print("\n🏗️  Step 3: Building React frontend...")
    if not run_command("npm run build", cwd=FRONTEND_DIR, shell=True):
        return False

    if not os.path.exists(FRONTEND_BUILD):
        print(f"\n❌ Frontend build failed: {FRONTEND_BUILD} not found")
        return False

    print(f"\n✅ Frontend built successfully at: {FRONTEND_BUILD}")

    # Step 4: Start FastAPI backend with integrated frontend
    print("\n" + "="*60)
    print("🌐 APPLICATION READY")
    print("="*60)
    print("\n📍 Access the app at: http://localhost:8000")
    print("\n✓ Backend API routes: /api/*")
    print("✓ Frontend served at: /")
    print("\nPress Ctrl+C to stop the server\n")

    os.chdir(PROJECT_ROOT)
    run_command(f"{sys.executable} backend/main.py", shell=True)


if __name__ == "__main__":
    try:
        setup_and_run()
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped by user")
        sys.exit(0)
