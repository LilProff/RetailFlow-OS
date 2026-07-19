# Vercel Deployment & Google Integration Guide

This guide explains how to export your **RetailFlow OS** codebase, deploy it to **Vercel**, and keep your Google Calendar, Meet, and Google Sheets integrations working seamlessly without asking your customers for authorization.

---

## 🛠️ How Your Shared Integration Works (Under the Hood)

To protect your users from Google OAuth popups, the app is built with a **Single-Admin Shared Integration Architecture**:
1. **One-Time Admin Auth**: You (the owner) log into your Google Account *once* via the **Integrations** tab in the admin view.
2. **Secure Token Storage**: Your Google Access Token and Google Spreadsheet ID are stored securely in your private Firebase Firestore database (`config/google`).
3. **Silent Customer Booking**: When a customer submits the consultation form and books a meeting, the app fetches your active token from Firestore behind the scenes. It creates the Google Calendar event, generates a real Google Meet link, and appends the lead data to your spreadsheet **silently** on your behalf.
4. **Zero-Friction Client Experience**: Your customers only see the clean growth consultation form and booking slots—they are **never** prompted to connect Google or grant permissions.

---

## 📦 Step 1: Exporting Your Code

You can export the fully functional code from Google AI Studio in two ways:

### Option A: Push to GitHub (Recommended for Vercel)
1. Open the **Settings** menu (gear icon) in the top-right or bottom-left corner of the AI Studio workspace.
2. Select **Export to GitHub**.
3. Connect your GitHub account, choose a repository name, and push. This makes Vercel deployments automatic (any change you push to GitHub will redeploy instantly).

### Option B: Download as ZIP
1. Open the **Settings** menu (gear icon).
2. Click **Download ZIP**.
3. Extract the ZIP file to a folder on your computer.

---

## 🚀 Step 2: Deploying to Vercel

### Method A: Direct Import via Vercel Dashboard (Easiest)
1. Go to [Vercel](https://vercel.com) and log in.
2. Click the **Add New...** button and choose **Project**.
3. Under **Import Git Repository**, select the GitHub repository you created in Step 1.
4. Vercel will automatically detect that this is a **Vite / React** single-page application.
5. Leave the build settings as default:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build` (or `vite build`)
   - **Output Directory**: `dist`
6. Click **Deploy**. Within a minute, your application will be live at `https://your-project-name.vercel.app`!

### Method B: Vercel CLI (Manual)
If you downloaded a ZIP, you can deploy using the terminal:
1. Open your terminal in the extracted project folder.
2. Install the Vercel CLI globally if you haven't:
   ```bash
   npm install -g vercel
   ```
3. Run the deployment command:
   ```bash
   vercel
   ```
4. Follow the prompt to log in and select settings (use defaults).
5. For production release, run:
   ```bash
   vercel --prod
   ```

---

## 🔒 Step 3: Preventing Google OAuth & Firebase Authentication Breaks (CRITICAL)

When you deploy your app to a new domain (e.g., `https://your-app.vercel.app`), **Google Sign-In will block login attempts for security reasons** until you whitelist your new Vercel domain. 

To ensure you can log into the Admin panel and refresh your Google integrations, complete these two quick steps:

### 1. Whitelist in the Firebase Console
Firebase handles the Google Authentication gateway. It must know that your Vercel URL is a safe origin.
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Click on your project: **`trucksoft`** (project ID: `trucksoft`).
3. In the left sidebar, navigate to **Build** > **Authentication**.
4. Go to the **Settings** tab.
5. In the **Authorized Domains** section, click **Add Domain**.
6. Enter your Vercel deployment URL (e.g., `your-app.vercel.app` or your custom domain).
7. Click **Add**.

### 2. Whitelist in the Google Cloud Console
Google APIs must accept auth requests coming from your new Vercel site's script.
1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. In the top dropdown, select your project: **`trucksoft`** (it is connected to project number `54017761941`).
3. Go to **APIs & Services** > **Credentials**.
4. Under **OAuth 2.0 Client IDs**, look for your Web Client ID (ends with `...kd7s13d3igaqfo2cao7gtikl2e4ch2j9.apps.googleusercontent.com`) and click the **Pencil icon** (Edit).
5. Scroll down to **Authorized JavaScript origins**.
6. Click **Add URI** and enter your full Vercel URL:
   ```text
   https://your-app.vercel.app
   ```
7. Scroll down to **Authorized redirect URIs**. Ensure that your Firebase handler URL is present (this is usually auto-added by Firebase, but double-check):
   ```text
   https://trucksoft.firebaseapp.com/__/auth/handler
   ```
8. Scroll to the bottom and click **Save**.

*Note: Google OAuth changes can take 2–5 minutes to propagate across Google's edge servers.*

---

## 💡 Troubleshooting & Tips

### No Environment Variables Needed for build!
Since your Firebase configuration is safely declared in `firebase-applet-config.json` and bundled during build-time, **you do not need to set any secret variables on Vercel**! Vercel will build the app perfectly out-of-the-box using the bundled configuration file.

### How to configure sheets and calendar on the live Vercel site:
1. Once deployed, open your live Vercel URL.
2. Go to the **Integrations** page.
3. Click **Connect** on **Google Sheets** and **Google Calendar**.
4. Log into your Google workspace account.
5. Once authenticated, your new active token will automatically write to your Firestore database.
6. From that exact second forward, any customer completing the consultation form anywhere in the world will automatically schedule calendar invites with Google Meet links on your schedule and log details directly to your spreadsheet!
