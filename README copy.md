# Professional TypeScript Civic Pass MCP Server

**Enterprise-grade MCP Server with full TypeScript support and real Civic Pass API integration**

## 🌟 Features

- ✅ **Full TypeScript support** with strict type checking
- ✅ **Professional build process** with explicit compilation
- ✅ **Real Civic Pass API integration** with OAuth2
- ✅ **Universal wallet support** for ANY address
- ✅ **Multi-network support** (XDC, Ethereum, Polygon, Solana)
- ✅ **Comprehensive error handling** and validation
- ✅ **Production-ready** with linting, formatting, and testing

## 🏗️ Project Structure

```
civic-pass-mcp-server-ts/
├── src/
│   ├── config/
│   │   └── civic-config.ts     # Configuration with official Civic credentials
│   ├── services/
│   │   ├── civic-api.ts        # Civic Pass API service
│   │   └── http-client.ts      # HTTP client service
│   ├── tools/
│   │   └── civic-tools.ts      # MCP tools implementation
│   ├── types/
│   │   └── civic.ts            # TypeScript type definitions
│   ├── utils/
│   │   └── validation.ts       # Validation utilities
│   ├── index.ts                # Main server entry point
│   └── test-api.ts             # API connectivity tests
├── dist/                       # Compiled JavaScript output
├── package.json                # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── .eslintrc.json             # ESLint configuration
└── README.md                  # This file
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start the server
npm start

# Or run in development mode
npm run dev
```

## 📋 Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run build:watch` - Watch mode compilation
- `npm start` - Build and start the server
- `npm run dev` - Development mode with auto-restart
- `npm test` - Run tests
- `npm run test:api` - Test API connectivity
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run validate` - Run all checks (lint + build + test)

## 🛠️ Available MCP Tools

1. **`check_civic_pass_status`** - Check ANY wallet address
2. **`batch_check_wallets`** - Check multiple wallets at once
3. **`get_pass_details`** - Get detailed pass information
4. **`authenticate_civic_api`** - OAuth2 authentication
5. **`validate_wallet_address`** - Validate address format
6. **`get_supported_networks`** - List supported networks

## 🌐 Supported Networks

- **XDC Apothem Testnet** (`xdc-apothem`)
- **XDC Mainnet** (`xdc-mainnet`)
- **Ethereum Sepolia** (`ethereum-sepolia`)
- **Polygon Amoy** (`polygon-amoy`)
- **Solana Devnet** (`solana-devnet`)

## 📊 Example Usage

```typescript
// Check any wallet on XDC Apothem
{
  "tool": "check_civic_pass_status",
  "params": {
    "walletAddress": "0x742d35Cc6634C0532925a3b8D95b8C7e4F2E8573",
    "network": "xdc-apothem",
    "scope": "captcha"
  }
}

// Batch check multiple wallets
{
  "tool": "batch_check_wallets",
  "params": {
    "walletAddresses": [
      "0x742d35Cc6634C0532925a3b8D95b8C7e4F2E8573",
      "0x1234567890123456789012345678901234567890"
    ],
    "network": "xdc-apothem"
  }
}
```

## 🔧 Development

### Type Safety
All code is fully typed with strict TypeScript configuration:
- Strict null checks
- No implicit any
- Exact optional property types
- No unchecked indexed access

### Code Quality
- **ESLint** for code quality
- **Prettier** for code formatting
- **Explicit build process** for reliability
- **Comprehensive error handling**

### Testing
```bash
# Test API connectivity
npm run test:api

# Validate entire project
npm run validate
```

## 🏭 Production Deployment

1. **Build the project**: `npm run build`
2. **Start with process manager**: `pm2 start dist/index.js`
3. **Monitor logs**: `pm2 logs`

## 🔐 Security

- Uses official Civic Pass sandbox credentials
- Real OAuth2 authentication flow
- Secure HTTP client with timeout handling
- Input validation for all parameters

## ⚡ Performance

- Compiled TypeScript for optimal performance
- Connection pooling for HTTP requests
- Automatic token refresh
- Batch processing for multiple wallets

This is a professional, production-ready MCP server with full TypeScript support and real Civic Pass API integration.
