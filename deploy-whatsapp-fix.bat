@echo off
echo ========================================
echo WhatsApp API - Complete Fix Deployment
echo ========================================
echo.

echo Step 1: Deploying Backend Function...
echo.
call firebase deploy --only functions
echo.

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Backend deployment FAILED!
    echo Please check Firebase configuration and try again.
    pause
    exit /b 1
)

echo.
echo ✅ Backend deployment SUCCESSFUL!
echo.
echo ========================================
echo.
echo Next Steps:
echo 1. Clear browser cache: localStorage.removeItem('samartha_cart')
echo 2. Reload page
echo 3. Add product to cart
echo 4. Complete checkout
echo 5. Check console logs
echo 6. Verify WhatsApp message
echo.
echo ========================================
echo.
echo For detailed testing guide, see:
echo WHATSAPP_COMPLETE_FIX.md
echo.
pause
