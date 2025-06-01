#!/usr/bin/env node

/**
 * Professional TypeScript Civic Pass MCP Server
 * Real API integration with comprehensive error handling and type safety
 */

console.error('🔍 File loaded, checking execution conditions...');
console.error('import.meta.url:', import.meta.url);
console.error('process.argv[1]:', process.argv[1]);
console.error('file:// + argv[1]:', `file://${process.argv[1]}`);

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CivicTools } from './tools/civic-tools.js';

class CivicPassMcpServer {
  private readonly server: McpServer;
  private civicTools?: CivicTools;

  constructor() {
    this.server = new McpServer({
      name: 'civic-pass-mcp-server-ts',
      version: '3.0.0',
    });

    this.setupErrorHandlers();
  }

  private setupErrorHandlers(): void {
    process.on('uncaughtException', (error: Error) => {
      console.error('💥 Uncaught exception:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason: unknown) => {
      console.error('💥 Unhandled rejection:', reason);
      process.exit(1);
    });

    process.on('SIGINT', () => {
      console.error('🛑 Received SIGINT, shutting down gracefully...');
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.error('🛑 Received SIGTERM, shutting down gracefully...');
      process.exit(0);
    });
  }

  async initialize(): Promise<void> {
    try {
      console.error('🔄 Initializing Civic Pass MCP Server...');
      
      // Initialize Civic tools
      this.civicTools = new CivicTools(this.server);
      
      console.error('✅ Server initialized successfully');
    } catch (error) {
      console.error('❌ Server initialization failed:', error);
      throw error;
    }
  }

  async run(): Promise<void> {
    try {
      await this.initialize();
      
      const transport = new StdioServerTransport();
      await this.server.connect(transport);
      
      console.error('🚀 Civic Pass MCP Server (TypeScript) running!');
      console.error('📡 Connected to: Civic Pass API');
      console.error('🌐 Universal wallet support: ANY address on supported networks');
      console.error('⚡ Available tools: 6 (all type-safe)');
      console.error('🔗 Supported networks: XDC, Ethereum, Polygon, Solana');
      console.error('📋 Built with TypeScript for enhanced reliability');
      console.error('🎯 Ready for programmatic wallet verification');
      
    } catch (error) {
      console.error('❌ Server failed to start:', error);
      process.exit(1);
    }
  }
}

// Main execution
async function main(): Promise<void> {
  try {
    const server = new CivicPassMcpServer();
    await server.run();
  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }
}

// Run the server only if this file is executed directly
//if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('🚨 Startup failed:', error);
    process.exit(1);
  });
//}

export default CivicPassMcpServer;
