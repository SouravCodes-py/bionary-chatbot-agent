Write-Host "Setting up Bionary Chatbot Agent..." -ForegroundColor Cyan

# 1. Backend Setup
Write-Host "Setting up Backend..." -ForegroundColor Yellow
Set-Location "backend"

# Check for .env
if (-not (Test-Path ".env")) {
    Write-Host ".env file not found. Creating from .env.example..." -ForegroundColor Magenta
    Copy-Item ".env.example" ".env"
    Write-Host "IMPORTANT: Please edit backend/.env and add your GEMINI_API_KEY!" -ForegroundColor Red
}

# Install Python dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Cyan
pip install -r requirements.txt

# 2. Frontend Setup
Set-Location "../frontend"
Write-Host "Setting up Frontend..." -ForegroundColor Yellow

# Install Node dependencies
Write-Host "Installing Node dependencies..." -ForegroundColor Cyan
cmd /c npm install

Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "To run the app:"
Write-Host "1. Open two terminals."
Write-Host "2. Terminal 1 (Backend): cd backend; uvicorn main:app --reload"
Write-Host "3. Terminal 2 (Frontend): cd frontend; npm run dev"
