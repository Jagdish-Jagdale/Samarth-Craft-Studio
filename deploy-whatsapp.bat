@echo off
echo ========================================
echo WhatsApp Backend Deployment Script
echo ========================================
echo.

echo Step 1: Installing dependencies...
cd functions
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed
echo.

echo Step 2: Deploying Firebase Functions...
cd ..
call firebase deploy --only functions
if %errorlevel% neq 0 (
    echo ERROR: Failed to deploy functions
    pause
    exit /b 1
)
echo ✅ Functions deployed successfully
echo.

echo ========================================
echo ✅ Deployment Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Clear your cart
echo 2. Add products again
echo 3. Place a test order
echo 4. Check console for logs
echo.
echo To view logs: firebase functions:log
echo.
pause
