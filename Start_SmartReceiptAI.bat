@echo off
title SmartReceiptAI Server
echo ==========================================
echo Starting SmartReceiptAI Server...
echo ==========================================
cd /d "g:\Smart"
set PYTHONPATH=.
echo Starting FastAPI server...
echo The browser will open automatically. Please DO NOT CLOSE this window.
timeout /t 3 >nul
start http://localhost:8000
.\venv\Scripts\uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
pause
