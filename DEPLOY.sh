#!/bin/bash
# DIMA Deals - Quick Deployment Guide
# Run this script to prepare for Vercel deployment

echo "🚀 DIMA Deals - Deployment Preparation"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git from https://git-scm.com"
    exit 1
fi

echo "✅ Git is installed"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update .env with your Vercel KV credentials"
else
    echo "✅ .env file already exists"
fi
echo ""

# Display deployment instructions
echo "📋 DEPLOYMENT STEPS:"
echo "==================="
echo ""
echo "1. Push to GitHub:"
echo "   git add ."
echo "   git commit -m 'Production ready deployment'"
echo "   git push origin main"
echo ""
echo "2. Deploy to Vercel:"
echo "   a) Go to https://vercel.com"
echo "   b) Click 'New Project'"
echo "   c) Import your GitHub repository"
echo "   d) Don't change build settings"
echo "   e) Click 'Deploy'"
echo ""
echo "3. Configure Environment Variables:"
echo "   a) Go to Project Settings → Environment Variables"
echo "   b) Create new Vercel KV database"
echo "   c) Add VERCEL_KV_REST_API_URL"
echo "   d) Add VERCEL_KV_REST_API_TOKEN"
echo "   e) Redeploy after adding variables"
echo ""
echo "4. Test Your Deployment:"
echo "   a) Visit https://your-project.vercel.app"
echo "   b) Test adding products to cart"
echo "   c) Complete checkout"
echo "   d) Verify order was saved"
echo ""

echo "✨ All set! Follow the steps above to deploy."
echo ""
echo "📖 For more details, see README.md"
echo "📋 Use DEPLOYMENT_CHECKLIST.md as your checklist"
