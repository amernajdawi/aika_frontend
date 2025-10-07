# Railway Deployment Guide

## Prerequisites
1. Railway account (sign up at https://railway.app)
2. Railway CLI installed (`npm install -g @railway/cli`)
3. Git repository (this project should be in a Git repo)

## Environment Variables
Set the following environment variable in Railway dashboard:

```
NEXT_PUBLIC_API_URL=https://your-backend-api-url.railway.app
```

Replace `your-backend-api-url.railway.app` with your actual backend API URL.

## Deployment Steps

### Option 1: Using Railway Dashboard (Recommended)
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose this repository
5. Railway will automatically detect it's a Next.js app
6. Add the environment variable `NEXT_PUBLIC_API_URL`
7. Deploy!

### Option 2: Using Railway CLI
1. Login to Railway: `railway login`
2. Initialize project: `railway init`
3. Set environment variable: `railway variables set NEXT_PUBLIC_API_URL=https://your-backend-api-url.railway.app`
4. Deploy: `railway up`

## Configuration Files
- `railway.json`: Railway-specific deployment configuration
- `next.config.js`: Updated to use environment variables for API URL
- `hooks/useChatApi.ts`: Updated to use environment variable for API endpoint

## Notes
- The app will be available at the Railway-provided URL
- Make sure your backend API is also deployed and accessible
- The frontend will proxy API requests to your backend through Next.js rewrites
