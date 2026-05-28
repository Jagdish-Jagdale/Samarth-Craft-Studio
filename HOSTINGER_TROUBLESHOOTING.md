# Hostinger Deployment - Products Not Adding Issue

## 🔍 Problem
Products are not getting added to Firestore after hosting on Hostinger.

---

## 🎯 Common Causes & Solutions

### 1. **Firebase Security Rules** (Most Common)

Your Firestore security rules might be blocking writes from the production domain.

#### Solution:

1. **Go to Firebase Console:**
   - Visit: https://console.firebase.google.com
   - Select your project: `kolhapuri-chappals-56bdc`

2. **Navigate to Firestore Database:**
   - Click "Firestore Database" in left sidebar
   - Click "Rules" tab

3. **Update Security Rules:**

**For Testing (Temporary - NOT for production):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**For Production (Recommended):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products collection
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null; // Only authenticated users
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read: if true;
      allow write: if true; // Allow anyone to create orders
    }
    
    // Resellers collection
    match /resellers/{resellerId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Inquiries collection
    match /inquiries/{inquiryId} {
      allow read: if request.auth != null;
      allow write: if true; // Allow anyone to submit inquiries
    }
    
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

4. **Click "Publish"**

---

### 2. **CORS & Google Login Authorization (Authorized Domains)**

If Google Sign-In is failing after deployment, it is almost certainly because the hosted domain is not whitelisted in the Firebase Console or the Google Cloud Platform Console.

#### Solution:

1. **Whitelist Your Domain in Firebase Console:**
   - Go to [Firebase Console](https://console.firebase.google.com/).
   - Select your project: `kolhapuri-chappals-56bdc`
   - Click **Authentication** in the left sidebar, then click the **Settings** tab.
   - Select **Authorized domains** from the left pane under Settings.
   - Click **Add domain** and enter your production domain (e.g., `yourdomain.com`). Also add `www.yourdomain.com` and/or your temporary Vercel/Hostinger subdomain (e.g., `your-app.vercel.app` or `your-app.web.app`).
   - *Note: Do not include `https://` or trailing slashes when entering the domain.*

2. **Whitelist OAuth Redirect URIs in Google Cloud Console:**
   Firebase Auth uses an OAuth handler page under your Firebase project domain (`https://kolhapuri-chappals-56bdc.firebaseapp.com/__/auth/handler`) to complete the login flow. You need to ensure this is authorized.
   - Go to the [Google Cloud Console](https://console.cloud.google.com/).
   - Select your project: `kolhapuri-chappals-56bdc` (it has the same ID/name as your Firebase project).
   - Navigate to **APIs & Services** > **Credentials**.
   - Under **OAuth 2.0 Client IDs**, find your Web application client (typically named `Web client (auto-created by Google Service)`). Click the edit (pencil) icon next to it.
   - Scroll down to **Authorized JavaScript origins** and add your production domain:
     - `https://yourdomain.com`
     - `https://www.yourdomain.com`
   - Scroll down to **Authorized redirect URIs** and verify/add:
     - `https://kolhapuri-chappals-56bdc.firebaseapp.com/__/auth/handler`
     - `https://kolhapuri-chappals-56bdc.web.app/__/auth/handler`
     - If you configured a custom auth domain, add `https://yourdomain.com/__/auth/handler`.
   - Click **Save**. Note: Google Cloud Console settings can take up to 5-10 minutes to propagate.

3. **Check Browser Console:**
   - Open your hosted website and open Developer Tools (F12).
   - Go to the **Console** tab and try Google Login.
   - If it fails, look for an error code like `auth/unauthorized-domain`. The error message will explicitly state which domain is missing from the authorized list.

---

### 3. **Environment Variables Missing**

If you're using environment variables, they need to be in the build.

#### Solution:

1. **Check if `.env` file exists in root:**
   ```env
   VITE_FIREBASE_API_KEY=AIzaSyCpx0Tj38AgzN2cnYeh6rn6p3JpWkg4aG8
   VITE_FIREBASE_AUTH_DOMAIN=kolhapuri-chappals-56bdc.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=kolhapuri-chappals-56bdc
   VITE_FIREBASE_STORAGE_BUCKET=kolhapuri-chappals-56bdc.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=888767512643
   VITE_FIREBASE_APP_ID=1:888767512643:web:2b23cf46cf908e268714f6
   VITE_FIREBASE_MEASUREMENT_ID=G-49S6NPNGNP
   ```

2. **Rebuild the project:**
   ```bash
   npm run build
   ```

3. **Re-upload to Hostinger**

**Note:** Your current `firebase.js` has hardcoded values, so this shouldn't be the issue.

---

### 4. **Admin Authentication Issue**

The admin panel might not be authenticating properly.

#### Solution:

1. **Check if you're logged in:**
   - Go to: `https://yourdomain.com/admin`
   - Login with: `samartha123@gmail.com` / `Samartha123`

2. **Check browser console for errors:**
   - Press F12
   - Look for authentication errors

3. **Clear browser cache and cookies:**
   - Press Ctrl+Shift+Delete
   - Clear all data
   - Try logging in again

---

### 5. **JavaScript Not Loading**

The JavaScript bundle might not be loading correctly.

#### Solution:

1. **Check if files are uploaded correctly:**
   - Verify `assets/` folder exists in `public_html/`
   - Verify `index.html` exists in `public_html/`

2. **Check file permissions:**
   - Files should be `644`
   - Folders should be `755`

3. **Check .htaccess:**
   - Verify `.htaccess` is uploaded
   - Check if it's in the root (`public_html/`)

---

### 6. **Browser Console Errors**

Check for specific errors in the browser console.

#### How to Check:

1. **Open your website on Hostinger**
2. **Press F12** (or right-click → Inspect)
3. **Go to "Console" tab**
4. **Look for red error messages**

#### Common Errors:

**Error: "Failed to fetch"**
- **Cause:** Network issue or CORS
- **Solution:** Check Firebase authorized domains

**Error: "Permission denied"**
- **Cause:** Firestore security rules
- **Solution:** Update security rules (see #1)

**Error: "Firebase: Error (auth/...)"**
- **Cause:** Authentication issue
- **Solution:** Check admin login credentials

**Error: "Cannot read property of undefined"**
- **Cause:** JavaScript error
- **Solution:** Check browser console for stack trace

---

## 🧪 Testing Steps

### Step 1: Check Firebase Connection

1. Open browser console (F12)
2. Go to your website
3. Type in console:
   ```javascript
   console.log('Firebase initialized:', firebase !== undefined)
   ```

### Step 2: Test Firestore Write

1. Open browser console
2. Try to write to Firestore:
   ```javascript
   // This should work if Firestore is configured correctly
   fetch('https://firestore.googleapis.com/v1/projects/kolhapuri-chappals-56bdc/databases/(default)/documents/test', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ fields: { test: { stringValue: 'hello' } } })
   }).then(r => console.log('Success:', r)).catch(e => console.error('Error:', e))
   ```

### Step 3: Test Admin Panel

1. Go to: `https://yourdomain.com/admin`
2. Login with admin credentials
3. Try to add a product
4. Check browser console for errors

---

## 🔧 Quick Fix Checklist

- [ ] Update Firestore security rules to allow writes
- [ ] Add Hostinger domain to Firebase authorized domains
- [ ] Verify all files uploaded correctly to `public_html/`
- [ ] Check `.htaccess` is in `public_html/`
- [ ] Clear browser cache and cookies
- [ ] Check browser console for errors
- [ ] Verify admin login works
- [ ] Test on different browser
- [ ] Check file permissions (644 for files, 755 for folders)

---

## 🚨 Emergency Fix (For Testing Only)

If nothing works, temporarily open Firestore completely:

1. **Go to Firebase Console → Firestore → Rules**
2. **Use this rule (TEMPORARY):**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```
3. **Click "Publish"**
4. **Try adding products again**
5. **If it works, the issue is security rules**
6. **Change back to secure rules after testing**

---

## 📞 Need More Help?

### Check These:

1. **Browser Console Errors:**
   - Press F12 → Console tab
   - Screenshot any red errors
   - Share the error messages

2. **Network Tab:**
   - Press F12 → Network tab
   - Try adding a product
   - Look for failed requests (red)
   - Check the response

3. **Firebase Console:**
   - Check if data is being written
   - Check Firestore usage/quota

### Share This Info:

- [ ] Browser console errors (screenshot)
- [ ] Network tab errors (screenshot)
- [ ] Firebase security rules (current)
- [ ] Hostinger domain name
- [ ] What happens when you try to add a product

---

## 💡 Most Likely Solution

**99% of the time, it's Firestore security rules.**

**Quick Fix:**
1. Go to Firebase Console
2. Firestore Database → Rules
3. Change to allow writes
4. Publish
5. Try again

---

## 📝 After Fixing

Once products are adding successfully:

1. **Tighten security rules** (use production rules above)
2. **Test all functionality:**
   - Add product
   - Edit product
   - Delete product
   - Create order
   - Admin login
3. **Monitor Firebase usage** in console

---

## 🎯 Contact Support

If issue persists after trying all solutions:

**Firebase Support:**
- https://firebase.google.com/support

**Hostinger Support:**
- Live chat in Hostinger dashboard
- https://www.hostinger.com/contact

---

## ✅ Success Indicators

You'll know it's fixed when:
- ✅ Products appear in admin panel after adding
- ✅ Products appear in Firestore console
- ✅ No errors in browser console
- ✅ Products show on website homepage

---

Good luck! The issue is most likely Firebase security rules. Start there! 🚀
