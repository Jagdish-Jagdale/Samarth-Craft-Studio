# Deployment Guide - Samartha Craft Studio

This guide covers deploying your React application to both Vercel and Hostinger.

---

## 📦 Files Added

1. **`vercel.json`** - Configuration for Vercel deployment
2. **`.htaccess`** - Configuration for Hostinger/Apache deployment

---

## 🚀 Deploy to Vercel

### Method 1: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts
   - Select your project settings
   - Vercel will automatically detect the `vercel.json` configuration

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Method 2: Using Vercel Dashboard (Easy)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect settings from `vercel.json`
   - Click "Deploy"

3. **Environment Variables (if needed)**
   - Go to Project Settings → Environment Variables
   - Add your Firebase config variables:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - etc.

### Vercel Configuration Explained

The `vercel.json` file includes:
- ✅ **Client-side routing** - All routes redirect to `index.html`
- ✅ **Static asset caching** - Assets cached for 1 year
- ✅ **Security headers** - XSS protection, frame options, etc.
- ✅ **Build configuration** - Uses Vite build output from `dist` folder

---

## 🌐 Deploy to Hostinger

### Step 1: Build Your Project

1. **Build the production version**
   ```bash
   npm run build
   ```
   This creates a `dist` folder with optimized files.

### Step 2: Upload to Hostinger

#### Option A: Using File Manager

1. **Login to Hostinger Control Panel**
   - Go to your Hostinger dashboard
   - Open "File Manager"

2. **Navigate to public_html**
   - Go to `public_html` folder (or your domain's root folder)

3. **Upload Files**
   - Upload ALL files from the `dist` folder
   - Upload the `.htaccess` file to the same directory
   - Your structure should look like:
     ```
     public_html/
     ├── .htaccess
     ├── index.html
     ├── assets/
     │   ├── index-[hash].js
     │   ├── index-[hash].css
     │   └── ...
     └── other files...
     ```

#### Option B: Using FTP

1. **Get FTP Credentials**
   - Go to Hostinger → FTP Accounts
   - Note your hostname, username, and password

2. **Connect via FTP Client** (FileZilla, WinSCP, etc.)
   - Host: Your FTP hostname
   - Username: Your FTP username
   - Password: Your FTP password
   - Port: 21

3. **Upload Files**
   - Navigate to `public_html` on the server
   - Upload all files from `dist` folder
   - Upload `.htaccess` file

### Step 3: Configure Domain

1. **Point Domain to public_html**
   - In Hostinger, go to Domains
   - Make sure your domain points to the correct folder

2. **SSL Certificate** (Recommended)
   - Go to SSL section in Hostinger
   - Enable free SSL certificate
   - Uncomment HTTPS redirect lines in `.htaccess`:
     ```apache
     RewriteCond %{HTTPS} off
     RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
     ```

### Hostinger Configuration Explained

The `.htaccess` file includes:
- ✅ **Client-side routing** - All routes redirect to `index.html`
- ✅ **Security headers** - XSS protection, clickjacking prevention
- ✅ **Compression** - Gzip compression for faster loading
- ✅ **Browser caching** - Cache static assets for better performance
- ✅ **HTTPS redirect** - Optional SSL redirect (commented out)

---

## 🔧 Environment Variables

### For Vercel:
Add in Vercel Dashboard → Project Settings → Environment Variables

### For Hostinger:
Since this is a static site, environment variables are baked into the build. Make sure to set them before building:

1. **Create `.env` file** (if not exists)
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

2. **Build with environment variables**
   ```bash
   npm run build
   ```

3. **Upload the built files to Hostinger**

---

## 🧪 Testing After Deployment

### Test These Routes:
- ✅ Homepage: `https://yourdomain.com/`
- ✅ Heritage: `https://yourdomain.com/heritage`
- ✅ Product: `https://yourdomain.com/product?id=1`
- ✅ About: `https://yourdomain.com/about`
- ✅ Contact: `https://yourdomain.com/contact`
- ✅ Admin: `https://yourdomain.com/admin`
- ✅ Checkout: `https://yourdomain.com/checkout`
- ✅ Login: `https://yourdomain.com/login`
- ✅ Reseller Login: `https://yourdomain.com/reseller-login`

### Test Functionality:
- ✅ Direct URL access (refresh on any page)
- ✅ Browser back/forward buttons
- ✅ Add to cart
- ✅ Checkout process
- ✅ Admin panel login
- ✅ Image uploads
- ✅ Firebase operations

---

## 🐛 Troubleshooting

### Issue: 404 Error on Page Refresh

**Vercel:**
- Check if `vercel.json` is in the root directory
- Redeploy the project

**Hostinger:**
- Check if `.htaccess` is uploaded to `public_html`
- Verify Apache `mod_rewrite` is enabled (usually enabled by default)
- Check file permissions (644 for `.htaccess`)

### Issue: Assets Not Loading

**Check:**
- All files from `dist` folder are uploaded
- `assets` folder is uploaded correctly
- File paths are correct (no absolute paths)

### Issue: Blank Page

**Check:**
- Browser console for errors
- Firebase configuration is correct
- Environment variables are set (for Vercel)
- Build completed successfully

### Issue: HTTPS Not Working (Hostinger)

**Solution:**
1. Enable SSL in Hostinger dashboard
2. Uncomment HTTPS redirect in `.htaccess`
3. Clear browser cache

### Issue: Google Login Fails with Auth/Domain Error
- **Cause:** Firebase blocks authentication from domains not registered in the project's whitelist.
- **Solution:** 
  - Whitelist the production domain in Firebase Console under Authentication -> Settings -> Authorized domains.
  - Whitelist the domain in Google Cloud Console under APIs & Services -> Credentials -> OAuth 2.0 Web Client.
  - Refer to the detailed step-by-step solution in [HOSTINGER_TROUBLESHOOTING.md](file:///c:/Users/Palash%20Borgave/Downloads/orchids-animated-website-showcase-main/SAMARTHA%20CRAFT%20STUDIO/HOSTINGER_TROUBLESHOOTING.md).

---

## 📊 Performance Optimization

### Already Included:
- ✅ Gzip compression (`.htaccess`)
- ✅ Browser caching (`.htaccess`)
- ✅ Asset optimization (Vite build)
- ✅ Code splitting (React lazy loading)

### Additional Recommendations:
1. **Enable CDN** (Cloudflare)
2. **Optimize images** before uploading
3. **Use WebP format** for images
4. **Minify assets** (already done by Vite)

---

## 🔄 Continuous Deployment

### Vercel (Automatic):
- Push to GitHub → Auto-deploys
- Pull requests → Preview deployments
- Main branch → Production deployment

### Hostinger (Manual):
1. Run `npm run build`
2. Upload `dist` folder contents via FTP
3. Clear browser cache

### Automate Hostinger Deployment:
You can use GitHub Actions to auto-deploy to Hostinger via FTP.

---

## 📝 Deployment Checklist

### Before Deployment:
- [ ] Test locally (`npm run dev`)
- [ ] Build successfully (`npm run build`)
- [ ] Check all routes work
- [ ] Test Firebase connection
- [ ] Verify environment variables
- [ ] Test admin panel
- [ ] Test checkout flow

### After Deployment:
- [ ] Test all routes on live site
- [ ] Check SSL certificate
- [ ] Test on mobile devices
- [ ] Check page load speed
- [ ] Verify Firebase operations (Firestore read/write)
- [ ] Verify Google Login works (Verify domain whitelisting in Firebase/GCP)
- [ ] Test image uploads
- [ ] Check browser console for errors

---

## 🆘 Support

### Vercel Issues:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Support](https://vercel.com/support)

### Hostinger Issues:
- [Hostinger Knowledge Base](https://support.hostinger.com)
- [Hostinger Live Chat](https://www.hostinger.com)

---

## 🎉 Success!

Your Samartha Craft Studio website is now live! 

**Vercel URL:** `https://your-project.vercel.app`
**Custom Domain:** `https://yourdomain.com`

---

## Quick Commands Reference

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to Vercel
vercel --prod

# Check build size
npm run build && ls -lh dist/
```

---

## File Structure After Build

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [other-assets]
├── public files (images, etc.)
└── .htaccess (for Hostinger)
```

---

## Notes

- **Vercel** is recommended for easier deployment and automatic CI/CD
- **Hostinger** is good for traditional hosting with full control
- Both configurations support client-side routing
- Both include security headers and performance optimizations
- `.htaccess` only works on Apache servers (Hostinger uses Apache)
- `vercel.json` is specific to Vercel platform

---

Good luck with your deployment! 🚀
