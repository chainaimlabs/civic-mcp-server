#!/usr/bin/env node

import { ValidationUtils } from './utils/validation.js';
import { CIVIC_CONFIG } from './config/civic-config.js';

console.log('🧪 Running basic TypeScript tests...\n');

// Test 1: Address validation
console.log('🔍 Testing address validation...');
const xdcAddress = '0x9281B31230C735867a2Fd62aF8ec816Cc1714521';
const xdcNetwork = CIVIC_CONFIG.NETWORKS['xdc-apothem'];

// Fix: Add null check for network config
if (!xdcNetwork) {
  console.log('❌ XDC Apothem network configuration not found');
  process.exit(1);
}

const isValid = ValidationUtils.isValidWalletAddress(xdcAddress, xdcNetwork);
console.log(`   XDC address ${xdcAddress}: ${isValid ? '✅ Valid' : '❌ Invalid'}`);

// Test 2: Network validation
console.log('\n🌐 Testing network validation...');
const validNetwork = ValidationUtils.isValidNetworkKey('xdc-apothem');
const invalidNetwork = ValidationUtils.isValidNetworkKey('invalid-network');
console.log(`   'xdc-apothem': ${validNetwork ? '✅ Valid' : '❌ Invalid'}`);
console.log(`   'invalid-network': ${invalidNetwork ? '❌ Invalid' : '✅ Correctly rejected'}`);

// Test 3: Configuration
console.log('\n⚙️  Testing configuration...');
console.log(`   Sandbox client ID: ${CIVIC_CONFIG.SANDBOX.clientId ? '✅ Present' : '❌ Missing'}`);
console.log(`   Supported networks: ${Object.keys(CIVIC_CONFIG.NETWORKS).length}`);

// Test 4: All networks have required properties
console.log('\n🔧 Testing network configurations...');
let allNetworksValid = true;
for (const [networkKey, networkConfig] of Object.entries(CIVIC_CONFIG.NETWORKS)) {
  const hasRequiredProps = networkConfig.name && 
                          networkConfig.chainId && 
                          networkConfig.rpc && 
                          networkConfig.explorer &&
                          networkConfig.civicChain &&
                          networkConfig.civicChainNetwork;
  
  if (!hasRequiredProps) {
    console.log(`   ❌ ${networkKey}: Missing required properties`);
    allNetworksValid = false;
  } else {
    console.log(`   ✅ ${networkKey}: Configuration complete`);
  }
}

if (allNetworksValid) {
  console.log('\n🎉 All basic tests completed successfully!');
  process.exit(0);
} else {
  console.log('\n❌ Some tests failed!');
  process.exit(1);
}
