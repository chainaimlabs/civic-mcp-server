#!/usr/bin/env node

/**
 * TypeScript API connectivity tests
 */

import { CivicApiService } from './services/civic-api.js';
import { CIVIC_CONFIG } from './config/civic-config.js';

const TEST_WALLET = '0x9281B31230C735867a2Fd62aF8ec816Cc1714521';

async function runTests(): Promise<void> {
  console.log('🚀 Starting TypeScript Civic Pass API tests...\n');
  
  const civicApi = new CivicApiService(CIVIC_CONFIG);
  
  try {
    // Test 1: Authentication
    console.log('🔐 Testing authentication...');
    const authResponse = await civicApi.authenticate('sandbox');
    console.log('✅ Authentication successful!');
    console.log(`   Token type: ${authResponse.token_type}`);
    console.log(`   Expires in: ${authResponse.expires_in} seconds`);
    
    // Test 2: Pass status check
    console.log('\n🔍 Testing pass status check...');
    const passStatus = await civicApi.checkPassStatus(TEST_WALLET, 'xdc-apothem');
    console.log('✅ Pass status check successful!');
    console.log('📄 Response:', JSON.stringify(passStatus, null, 2));
    
    console.log('\n🎉 All tests passed! TypeScript Civic API integration is working.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

runTests().catch(console.error);
