# 💰 ENIAD Budget-Friendly Startup Guide ($5 Modal Budget)

## 🎯 Cost-Optimized Setup

Since you have only **$5 in Modal budget**, here's how to run your ENIAD Assistant efficiently:

---

## 🚀 Quick Manual Startup (Recommended)

### **Step 1: Open Command Prompt/PowerShell**
```bash
# Navigate to your project
cd C:\Users\ROG FLOW\Desktop\PFA\ENIAD-ASSISTANT
```

### **Step 2: Start Frontend Only (Budget Mode)**
```bash
# Go to frontend directory
cd chatbot-ui\chatbot-academique

# Install dependencies (one time only)
npm install

# Start the frontend
npm run dev
```

### **Step 3: Open Browser**
Go to: **http://localhost:5173**

---

## 💰 Budget Optimization Settings

I've configured your system to be cost-efficient:

### **✅ What's Optimized:**
- **Direct API calls** → No RAG/SMA overhead
- **Reduced token limits** → Max 500 tokens per response
- **Optimized temperature** → 0.7 for efficiency
- **Frontend only** → No additional server costs
- **Smart caching** → Reduces repeated API calls

### **✅ Cost-Saving Features:**
- **Conversation persistence** → Firebase (free tier)
- **Local processing** → No external API costs
- **Efficient prompts** → Shorter, focused responses
- **Token monitoring** → Built-in usage tracking

---

## 🔧 If npm Issues Persist

### **Option 1: Fix npm Path**
```bash
# Add npm to your PATH
set PATH=%PATH%;C:\Program Files\nodejs\

# Or use full path
"C:\Program Files\nodejs\npm.cmd" install
"C:\Program Files\nodejs\npm.cmd" run dev
```

### **Option 2: Reinstall Node.js**
1. Download from: https://nodejs.org/
2. Install with "Add to PATH" option checked
3. Restart Command Prompt
4. Try again: `npm --version`

### **Option 3: Use Yarn (Alternative)**
```bash
# Install Yarn globally
npm install -g yarn

# Use Yarn instead
yarn install
yarn dev
```

---

## 🎯 Budget-Conscious Usage Tips

### **💡 To Maximize Your $5:**

1. **Keep conversations short** → Fewer tokens used
2. **Avoid long responses** → Set max tokens to 300-500
3. **Use specific questions** → More efficient responses
4. **Monitor usage** → Check Modal dashboard regularly
5. **Test in batches** → Don't run continuously

### **📊 Estimated Costs:**
- **Short conversation (10 messages)** → ~$0.10-0.20
- **Medium conversation (50 messages)** → ~$0.50-1.00
- **Long session (100+ messages)** → ~$1.00-2.00

### **⚠️ Budget Alerts:**
- **$4 remaining** → Reduce token limits
- **$2 remaining** → Use only for important tests
- **$1 remaining** → Emergency use only

---

## 🌐 What You'll Have Running

### **✅ Frontend Interface (Port 5173):**
- Chat interface with your custom UI
- Firebase authentication and conversation storage
- Direct integration with your Llama3 Modal API
- Multilingual support (French, English, Arabic)
- Voice features (speech-to-text, text-to-speech)

### **✅ Direct API Integration:**
- Your Llama3 model: `ahmed-ouka/llama3-8b-eniad-merged-32bit`
- Endpoint: `https://abdellah-ennajari-23--llama3-openai-compatible-serve.modal.run`
- OpenAI-compatible format for easy integration
- Cost-optimized parameters

---

## 🔍 Troubleshooting

### **If Frontend Won't Start:**
```bash
# Check Node.js version
node --version

# Check npm version  
npm --version

# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rmdir /s node_modules
npm install
```

### **If API Calls Fail:**
1. **Check Modal status** → Ensure your service is running
2. **Verify budget** → Check Modal dashboard for remaining credits
3. **Test endpoint** → Use the test file: `test_new_api_endpoint.html`
4. **Check logs** → Browser console for error messages

### **If Conversations Don't Save:**
1. **Check Firebase** → Ensure you're logged in with Google
2. **Check console** → Look for Firebase errors
3. **Clear browser cache** → Refresh and try again

---

## 🎉 Expected Results

### **✅ When Working Correctly:**
- Frontend loads at http://localhost:5173
- Google login works for conversation persistence
- Chat responses come from your Llama3 model
- Conversations save automatically
- Voice features work (optional)
- Multilingual interface responds correctly

### **💬 Test Your Setup:**
1. **Login** → Click "Se connecter avec Google Académique"
2. **Send test message** → "Bonjour, comment allez-vous?"
3. **Check response** → Should come from your Llama3 model
4. **Refresh page** → Conversation should persist
5. **Monitor costs** → Check Modal dashboard

---

## 💰 Budget Monitoring

### **📊 Track Your Usage:**
1. **Modal Dashboard** → https://modal.com/dashboard
2. **Usage tab** → Monitor API calls and costs
3. **Set alerts** → Get notified at $1, $3, $4 remaining
4. **Daily limits** → Set maximum daily spend

### **🚨 Emergency Stop:**
If costs are too high:
1. **Pause Modal service** → Stop the endpoint temporarily
2. **Use local mode** → Frontend only with cached responses
3. **Reduce token limits** → Edit configuration files
4. **Contact Modal support** → Request budget increase

---

## 🎯 Next Steps

1. **Start the frontend** → `npm run dev` in chatbot-academique folder
2. **Open browser** → http://localhost:5173
3. **Test carefully** → Monitor your Modal budget
4. **Optimize usage** → Keep conversations short and focused
5. **Scale gradually** → Add more budget when needed

**💡 Remember: Your $5 budget should last for several testing sessions if used wisely!**
