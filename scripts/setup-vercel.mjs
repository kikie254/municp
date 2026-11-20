#!/usr/bin/env node

/**
 * Vercel Setup Helper Script
 * 
 * This script helps you set up environment variables for Vercel deployment.
 * It reads from your .env.local and provides commands to set them in Vercel.
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const ENV_FILE = '.env.local';
const REQUIRED_VARS = [
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'FIREBASE_ADMIN_PROJECT_ID',
  'FIREBASE_ADMIN_CLIENT_EMAIL',
  'FIREBASE_ADMIN_PRIVATE_KEY',
  'FIREBASE_WEB_API_KEY',
  'PRIVACY_HASH_SECRET',
  'EMAIL_PROVIDER',
  'EMAIL_API_KEY',
  'EMAIL_FROM',
  'MUNICIPAL_NOTIFICATIONS_EMAIL'
];

const OPTIONAL_VARS = [
  'SESSION_TTL_HOURS',
  'MFA_ENFORCEMENT',
  'MAX_UPLOAD_BYTES',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN'
];

console.log('🚀 Vercel Environment Setup Helper\n');

// Check if .env.local exists
if (!existsSync(ENV_FILE)) {
  console.error(`❌ Error: ${ENV_FILE} not found!`);
  console.log(`\n💡 Create ${ENV_FILE} from .env.example first:`);
  console.log(`   cp .env.example .env.local`);
  console.log(`   # Then edit .env.local with your values\n`);
  process.exit(1);
}

// Parse .env.local
const envContent = readFileSync(ENV_FILE, 'utf-8');
const envVars = {};

envContent.split('\n').forEach(line => {
  line = line.trim();
  if (line && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      let value = valueParts.join('=').trim();
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      envVars[key] = value;
    }
  }
});

console.log('📋 Found environment variables in .env.local\n');

// Check required variables
const missing = [];
const present = [];

REQUIRED_VARS.forEach(varName => {
  if (envVars[varName] && envVars[varName] !== '' && !envVars[varName].includes('your-')) {
    present.push(varName);
  } else {
    missing.push(varName);
  }
});

if (missing.length > 0) {
  console.log('⚠️  Missing or placeholder values for required variables:');
  missing.forEach(v => console.log(`   - ${v}`));
  console.log('\n💡 Update these in .env.local before proceeding\n');
}

if (present.length > 0) {
  console.log('✅ Found required variables:');
  present.forEach(v => console.log(`   - ${v}`));
  console.log('');
}

// Generate Vercel CLI commands
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📝 Commands to set environment variables in Vercel');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('Choose your deployment target:');
console.log('  • development = Local development (optional)');
console.log('  • preview     = Preview/staging deployments');
console.log('  • production  = Production deployments\n');

console.log('Run these commands for PRODUCTION environment:\n');

present.forEach(varName => {
  const value = envVars[varName];
  const safeValue = varName.includes('PRIVATE_KEY') || varName.includes('SECRET') || varName.includes('API_KEY')
    ? '[HIDDEN]'
    : value;
  
  console.log(`# ${varName}`);
  if (varName.includes('PRIVATE_KEY')) {
    console.log(`vercel env add ${varName} production`);
    console.log(`# Paste the full private key when prompted (including BEGIN/END markers)`);
  } else {
    console.log(`echo "${value}" | vercel env add ${varName} production`);
  }
  console.log('');
});

// Optional variables
const presentOptional = OPTIONAL_VARS.filter(v => envVars[v] && envVars[v] !== '');
if (presentOptional.length > 0) {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Optional variables:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  presentOptional.forEach(varName => {
    const value = envVars[varName];
    console.log(`echo "${value}" | vercel env add ${varName} production`);
  });
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📚 Next Steps');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('1. Install Vercel CLI if you haven\'t:');
console.log('   npm i -g vercel\n');

console.log('2. Link your project:');
console.log('   vercel link\n');

console.log('3. Set environment variables using the commands above, OR:');
console.log('   vercel env pull .env.production.local\n');

console.log('4. Deploy to preview:');
console.log('   vercel\n');

console.log('5. Deploy to production:');
console.log('   vercel --prod\n');

console.log('💡 Tip: You can also set variables via the Vercel Dashboard:');
console.log('   https://vercel.com/dashboard → Your Project → Settings → Environment Variables\n');
