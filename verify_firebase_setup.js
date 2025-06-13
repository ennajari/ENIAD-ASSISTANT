#!/usr/bin/env node
/**
 * Firebase Setup Verification Script
 * Run this to verify your Firebase configuration
 */

const fs = require('fs');
const path = require('path');

console.log('🔥 Firebase Setup Verification');
console.log('=' * 50);

// Check if .env file exists
const envPath = path.join(__dirname, 'chatbot-ui', 'chatbot-academique', '.env');
if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found at:', envPath);
    console.log('📝 Please create the .env file with Firebase configuration');
    process.exit(1);
}

// Read .env file
const envContent = fs.readFileSync(envPath, 'utf8');
console.log('✅ .env file found');

// Check required Firebase variables
const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN', 
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
];

const missingVars = [];
const foundVars = {};

requiredVars.forEach(varName => {
    const regex = new RegExp(`${varName}=(.+)`);
    const match = envContent.match(regex);
    
    if (match && match[1] && match[1].trim() !== '') {
        foundVars[varName] = match[1].trim();
        console.log(`✅ ${varName}: ${match[1].substring(0, 20)}...`);
    } else {
        missingVars.push(varName);
        console.log(`❌ ${varName}: Missing or empty`);
    }
});

if (missingVars.length > 0) {
    console.log('\n❌ Missing Firebase configuration variables:');
    missingVars.forEach(varName => {
        console.log(`   - ${varName}`);
    });
    
    console.log('\n📋 Firebase Setup Instructions:');
    console.log('1. Go to https://console.firebase.google.com');
    console.log('2. Create or select your project');
    console.log('3. Go to Project Settings > General > Your apps');
    console.log('4. Add a web app or view existing config');
    console.log('5. Copy the config values to your .env file');
    console.log('\n📝 Example .env format:');
    console.log('VITE_FIREBASE_API_KEY=AIzaSyExample123456789');
    console.log('VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com');
    console.log('VITE_FIREBASE_PROJECT_ID=your-project-id');
    console.log('VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com');
    console.log('VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012');
    console.log('VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456');
    
    process.exit(1);
}

console.log('\n✅ All Firebase configuration variables found!');

// Validate configuration format
const validations = [
    {
        key: 'VITE_FIREBASE_API_KEY',
        test: (value) => value.startsWith('AIzaSy') && value.length > 30,
        message: 'API Key should start with "AIzaSy" and be longer than 30 characters'
    },
    {
        key: 'VITE_FIREBASE_AUTH_DOMAIN',
        test: (value) => value.includes('.firebaseapp.com'),
        message: 'Auth Domain should end with ".firebaseapp.com"'
    },
    {
        key: 'VITE_FIREBASE_PROJECT_ID',
        test: (value) => value.length > 3 && !value.includes('.'),
        message: 'Project ID should be a simple string without dots'
    },
    {
        key: 'VITE_FIREBASE_STORAGE_BUCKET',
        test: (value) => value.includes('.appspot.com') || value.includes('.firebasestorage.app'),
        message: 'Storage Bucket should end with ".appspot.com" or ".firebasestorage.app"'
    },
    {
        key: 'VITE_FIREBASE_MESSAGING_SENDER_ID',
        test: (value) => /^\d+$/.test(value) && value.length > 10,
        message: 'Messaging Sender ID should be a long number'
    },
    {
        key: 'VITE_FIREBASE_APP_ID',
        test: (value) => value.includes(':') && value.includes('web:'),
        message: 'App ID should contain ":" and "web:"'
    }
];

let validationErrors = 0;
validations.forEach(validation => {
    const value = foundVars[validation.key];
    if (!validation.test(value)) {
        console.log(`⚠️ ${validation.key}: ${validation.message}`);
        console.log(`   Current value: ${value}`);
        validationErrors++;
    }
});

if (validationErrors > 0) {
    console.log(`\n⚠️ Found ${validationErrors} validation warnings`);
    console.log('Please double-check your Firebase configuration values');
} else {
    console.log('\n✅ All Firebase configuration values look correct!');
}

console.log('\n🔥 Next Steps:');
console.log('1. Make sure Firebase Authentication is enabled');
console.log('2. Enable Google sign-in provider');
console.log('3. Add localhost to authorized domains');
console.log('4. Create Firestore database');
console.log('5. Restart your development server');

console.log('\n🚀 Test your setup:');
console.log('cd chatbot-ui/chatbot-academique');
console.log('npm run dev');
console.log('Then try to login with Google');

console.log('\n📚 Firebase Console: https://console.firebase.google.com');
