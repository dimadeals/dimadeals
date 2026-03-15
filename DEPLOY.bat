@echo off
REM DIMA Deals - Quick Deployment Guide for Windows
REM Run this batch file to prepare for Vercel deployment

echo.
echo ========================================
echo  DIMA Deals - Deployment Preparation
echo ========================================
echo.

REM Check if Node.js is installed
node -v >nul 2>&1
if errorlevel 1 (
    echo.
    echo [X] Node.js is not installed.
    echo Please download and install from: https://nodejs.org
    echo.
    pause
    exit /b 1
)

REM Display Node.js version
echo [V] Node.js installed:
node -v
echo.

REM Check if Git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo [X] Git is not installed.
    echo Please download and install from: https://git-scm.com
    echo.
    pause
    exit /b 1
)

echo [V] Git installed
echo.

REM Install dependencies
echo Installing dependencies...
call npm install
if errorlevel 1 (
    echo.
    echo [X] Failed to install dependencies
    echo.
    pause
    exit /b 1
)
echo [V] Dependencies installed
echo.

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env
    echo [V] .env file created
    echo [!] Please update .env with your Vercel KV credentials
) else (
    echo [V] .env file already exists
)
echo.

REM Display deployment instructions
echo.
echo ========================================
echo  DEPLOYMENT STEPS
echo ========================================
echo.
echo 1. PUSH TO GITHUB:
echo    $ git add .
echo    $ git commit -m "Production ready deployment"
echo    $ git push origin main
echo.
echo 2. DEPLOY TO VERCEL:
echo    a) Go to https://vercel.com
echo    b) Click "New Project"
echo    c) Import your GitHub repository
echo    d) Keep default build settings
echo    e) Click "Deploy"
echo.
echo 3. CONFIGURE ENVIRONMENT VARIABLES:
echo    a) Go to Project Settings ^> Environment Variables
echo    b) Create new Vercel KV database
echo    c) Add VERCEL_KV_REST_API_URL
echo    d) Add VERCEL_KV_REST_API_TOKEN
echo    e) Redeploy after adding variables
echo.
echo 4. TEST YOUR DEPLOYMENT:
echo    a) Visit https://your-project.vercel.app
echo    b) Test adding products to cart
echo    c) Complete checkout
echo    d) Verify order was saved
echo.
echo ========================================
echo.
echo [+] All set! Your project is ready for deployment.
echo.
echo [i] See README.md for detailed documentation
echo [i] Use DEPLOYMENT_CHECKLIST.md to track your progress
echo.
pause
