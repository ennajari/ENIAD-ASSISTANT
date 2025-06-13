# 🔥 Firebase Setup Guide for ENIAD AI Assistant

## 📋 **Complete Setup Checklist**

### **Step 1: Firebase Console Setup**

1. **Go to Firebase Console:**
   ```
   https://console.firebase.google.com
   ```

2. **Create/Select Project:**
   - Click "Add project" or select existing
   - Project name: `calcoussama-21fb8b71` (or your preferred name)
   - Enable Google Analytics (optional)

### **Step 2: Enable Authentication**

1. **Go to Authentication:**
   - Left sidebar → **Authentication**
   - Click **Get started**

2. **Enable Google Provider:**
   - Go to **Sign-in method** tab
   - Click **Google**
   - Toggle **Enable**
   - Set **Project support email**
   - Click **Save**

3. **Add Authorized Domains:**
   - In **Sign-in method** → **Authorized domains**
   - Add these domains:
     - `localhost`
     - `127.0.0.1`
     - Your production domain (if any)

### **Step 3: Enable Firestore Database**

1. **Go to Firestore Database:**
   - Left sidebar → **Firestore Database**
   - Click **Create database**

2. **Choose Security Rules:**
   - Select **Start in test mode** (for development)
   - Choose your preferred location (closest to users)

3. **Set Security Rules:**
   - Go to **Rules** tab
   - Copy the rules from `firestore.rules` file
   - Click **Publish**

### **Step 4: Get Configuration**

1. **Go to Project Settings:**
   - Click gear icon → **Project settings**
   - Scroll to **Your apps** section

2. **Add Web App:**
   - Click web icon `</>`
   - App nickname: `ENIAD-Assistant`
   - Click **Register app**

3. **Copy Configuration:**
   - Copy the `firebaseConfig` object
   - You'll need these values for your `.env` file

### **Step 5: Update .env File**

Create/update `chatbot-ui/chatbot-academique/.env`:

```env
# Firebase Configuration - Replace with YOUR actual values
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Enhanced API Server Configuration
VITE_RAG_API_BASE_URL=http://localhost:3001
VITE_RAG_SYSTEM_BASE_URL=http://localhost:8000
VITE_RAG_PROJECT_ID=eniad-assistant
VITE_SMA_API_BASE_URL=http://localhost:8001
```

### **Step 6: Verify Setup**

Run the verification script:
```bash
node verify_firebase_setup.js
```

### **Step 7: Test the System**

1. **Start services:**
   ```bash
   python start_services.py
   ```

2. **Start frontend:**
   ```bash
   cd chatbot-ui/chatbot-academique
   npm run dev
   ```

3. **Test login:**
   - Go to http://localhost:5174
   - Click "Sign in with Google Academic"
   - Login with your Google account

## 🔧 **Troubleshooting**

### **Error: "Firebase configuration error"**
- Check that all environment variables are set
- Verify API key starts with "AIzaSy"
- Ensure no extra spaces in .env file

### **Error: "Google sign-in not enabled"**
- Go to Firebase Console → Authentication → Sign-in method
- Enable Google provider
- Add localhost to authorized domains

### **Error: "Unauthorized domain"**
- Go to Firebase Console → Authentication → Settings → Authorized domains
- Add your domain (localhost for development)

### **Error: "Permission denied"**
- Check Firestore security rules
- Ensure user is authenticated
- Verify rules allow user access to their own data

## 📱 **Firebase Console Quick Links**

- **Main Console:** https://console.firebase.google.com
- **Authentication:** Console → Authentication → Sign-in method
- **Firestore:** Console → Firestore Database
- **Project Settings:** Console → Project Settings (gear icon)

## 🎯 **Expected Results**

After successful setup:
- ✅ Google login button works
- ✅ User can sign in with Google account
- ✅ Conversations are saved to Firebase
- ✅ Data syncs across devices
- ✅ No Firebase configuration errors

## 🆘 **Need Help?**

If you're still having issues:

1. **Run verification script:**
   ```bash
   node verify_firebase_setup.js
   ```

2. **Check browser console:**
   - Open Developer Tools (F12)
   - Look for Firebase-related errors
   - Check Network tab for failed requests

3. **Verify Firebase Console:**
   - Ensure all services are enabled
   - Check quotas and usage
   - Verify project is active

4. **Common fixes:**
   - Restart development server after .env changes
   - Clear browser cache and cookies
   - Check for typos in configuration values
