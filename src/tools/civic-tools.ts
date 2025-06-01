import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CivicApiService } from '../services/civic-api.js';
import { ValidationUtils } from '../utils/validation.js';
import { CIVIC_CONFIG } from '../config/civic-config.js';
import type { NetworkKey, VerificationScope, Environment } from '../types/civic.js';

export class CivicTools {
  private readonly civicApi: CivicApiService;

  constructor(private readonly server: McpServer) {
    this.civicApi = new CivicApiService(CIVIC_CONFIG);
    this.setupTools();
  }

  private setupTools(): void {
    // Tool 1: Universal Pass Status Check
    this.server.tool(
      'check_civic_pass_status',
      'Check Civic Pass status for ANY wallet address on any supported network',
      {
        walletAddress: z.string().describe('Any wallet address (0x... for EVM, base58 for Solana)'),
        network: z.enum(['xdc-apothem', 'xdc-mainnet', 'ethereum-sepolia', 'polygon-amoy', 'solana-devnet']).describe('Blockchain network'),
        scope: z.enum(['captcha', 'uniqueness', 'liveness', 'id_verification', 'all']).default('all').describe('Verification scope'),
        gatekeeperNetwork: z.string().optional().describe('Custom gatekeeper network (uses default if not provided)'),
      },
      async ({ walletAddress, network, scope, gatekeeperNetwork }) => {
        return await this.checkPassStatus(walletAddress, network, scope, gatekeeperNetwork);
      }
    );

    // Tool 2: Batch Check Multiple Wallets
    this.server.tool(
      'batch_check_wallets',
      'Check Civic Pass status for multiple wallet addresses at once',
      {
        walletAddresses: z.array(z.string()).describe('Array of wallet addresses to check'),
        network: z.enum(['xdc-apothem', 'xdc-mainnet', 'ethereum-sepolia', 'polygon-amoy', 'solana-devnet']).describe('Blockchain network'),
        scope: z.enum(['captcha', 'uniqueness', 'liveness', 'id_verification', 'all']).default('all').describe('Verification scope'),
      },
      async ({ walletAddresses, network, scope }) => {
        return await this.batchCheckWallets(walletAddresses, network, scope);
      }
    );

    // Tool 3: Get Pass Details
    this.server.tool(
      'get_pass_details',
      'Get detailed Civic Pass information for any wallet address',
      {
        walletAddress: z.string().describe('Wallet address to get details for'),
        network: z.enum(['xdc-apothem', 'xdc-mainnet', 'ethereum-sepolia', 'polygon-amoy', 'solana-devnet']).describe('Blockchain network'),
        includePII: z.boolean().default(false).describe('Include personally identifiable information (requires user consent)'),
      },
      async ({ walletAddress, network, includePII }) => {
        return await this.getPassDetails(walletAddress, network, includePII);
      }
    );

    // Tool 4: Authenticate with Civic API
    this.server.tool(
      'authenticate_civic_api',
      'Get OAuth2 access token for Civic Pass API',
      {
        environment: z.enum(['sandbox', 'production']).default('sandbox').describe('API environment'),
      },
      async ({ environment }) => {
        return await this.authenticate(environment);
      }
    );

    // Tool 5: Validate Wallet Address
    this.server.tool(
      'validate_wallet_address',
      'Validate if a wallet address has the correct format for the specified network',
      {
        walletAddress: z.string().describe('Wallet address to validate'),
        network: z.enum(['xdc-apothem', 'xdc-mainnet', 'ethereum-sepolia', 'polygon-amoy', 'solana-devnet']).describe('Target blockchain network'),
      },
      async ({ walletAddress, network }) => {
        return await this.validateWalletAddress(walletAddress, network);
      }
    );

    // Tool 6: Get Supported Networks
    this.server.tool(
      'get_supported_networks',
      'Get list of all supported blockchain networks and their configurations',
      {},
      async () => {
        return await this.getSupportedNetworks();
      }
    );
  }

  private async checkPassStatus(
    walletAddress: string,
    network: NetworkKey,
    scope: VerificationScope,
    gatekeeperNetwork?: string
  ) {
    try {
      const networkConfig = CIVIC_CONFIG.NETWORKS[network];
      
      // Fix: Add null check for networkConfig
      if (!networkConfig) {
        throw new Error(`Network ${network} is not supported`);
      }

      if (!ValidationUtils.isValidWalletAddress(walletAddress, networkConfig)) {
        throw new Error(`Invalid wallet address format for ${network}`);
      }

      const passStatus = await this.civicApi.checkPassStatus(
        walletAddress,
        network,
        scope,
        gatekeeperNetwork
      );

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              wallet: walletAddress,
              network: networkConfig.name,
              chainId: networkConfig.chainId,
              scope,
              gatekeeperNetwork: gatekeeperNetwork || CIVIC_CONFIG.SANDBOX.gatekeeperNetwork,
              passStatus,
              explorerUrl: `${networkConfig.explorer}/address/${walletAddress}`,
              checkedAt: new Date().toISOString(),
              source: 'civic_api_typescript',
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to check pass status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async batchCheckWallets(
    walletAddresses: string[],
    network: NetworkKey,
    scope: VerificationScope
  ) {
    try {
      console.error(`🔄 Batch checking ${walletAddresses.length} wallets on ${network}...`);
      
      const results = await Promise.allSettled(
        walletAddresses.map(async (walletAddress) => {
          const passStatus = await this.civicApi.checkPassStatus(walletAddress, network, scope);
          return {
            wallet: walletAddress,
            success: true,
            passStatus,
          };
        })
      );

      const processedResults = results.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          return {
            wallet: walletAddresses[index],
            success: false,
            error: result.reason.message,
          };
        }
      });

      // Fix: Add null check for networkConfig
      const networkConfig = CIVIC_CONFIG.NETWORKS[network];
      if (!networkConfig) {
        throw new Error(`Network ${network} is not supported`);
      }

      const summary = {
        totalWallets: walletAddresses.length,
        successfulChecks: processedResults.filter(r => r.success).length,
        failedChecks: processedResults.filter(r => !r.success).length,
        network: networkConfig.name,
      };

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              batchResults: processedResults,
              summary,
              batchedAt: new Date().toISOString(),
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Batch check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async getPassDetails(
    walletAddress: string,
    network: NetworkKey,
    includePII: boolean
  ) {
    try {
      const networkConfig = CIVIC_CONFIG.NETWORKS[network];
      
      // Fix: Add null check for networkConfig
      if (!networkConfig) {
        throw new Error(`Network ${network} is not supported`);
      }

      if (!ValidationUtils.isValidWalletAddress(walletAddress, networkConfig)) {
        throw new Error(`Invalid wallet address format for ${network}`);
      }

      const passDetails = await this.civicApi.getPassDetails(walletAddress, network, includePII);

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              wallet: walletAddress,
              network: networkConfig.name,
              includePII,
              passDetails,
              retrievedAt: new Date().toISOString(),
              warning: includePII ? 'PII data included - handle securely and ensure user consent' : null,
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get pass details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async authenticate(environment: Environment) {
    try {
      const authResponse = await this.civicApi.authenticate(environment);

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              success: true,
              environment,
              tokenType: authResponse.token_type,
              expiresIn: authResponse.expires_in,
              scope: authResponse.scope,
              authenticatedAt: new Date().toISOString(),
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async validateWalletAddress(walletAddress: string, network: NetworkKey) {
    const networkConfig = CIVIC_CONFIG.NETWORKS[network];
    
    // Fix: Add null check for networkConfig
    if (!networkConfig) {
      throw new Error(`Network ${network} is not supported`);
    }
    
    const isValid = ValidationUtils.isValidWalletAddress(walletAddress, networkConfig);
    
    let expectedFormat: string;
    if (networkConfig.civicChain === 'solana') {
      expectedFormat = 'Base58 encoded address (32-44 characters)';
    } else {
      expectedFormat = '0x followed by 40 hexadecimal characters';
    }

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            walletAddress,
            network: networkConfig.name,
            isValid,
            expectedFormat,
            actualLength: walletAddress.length,
            validation: {
              format: isValid ? 'VALID' : 'INVALID',
              reason: isValid ? 'Address format is correct' : `Address doesn't match expected format for ${networkConfig.name}`,
            },
            validatedAt: new Date().toISOString(),
          }, null, 2),
        },
      ],
    };
  }

  private async getSupportedNetworks() {
    const networks = Object.entries(CIVIC_CONFIG.NETWORKS).map(([key, config]) => ({
      networkKey: key,
      name: config.name,
      chainId: config.chainId,
      rpc: config.rpc,
      explorer: config.explorer,
      civicSupport: {
        chain: config.civicChain,
        chainNetwork: config.civicChainNetwork,
      },
    }));

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            supportedNetworks: networks,
            totalNetworks: networks.length,
            supportedChains: [...new Set(networks.map(n => n.civicSupport.chain))],
            lastUpdated: new Date().toISOString(),
          }, null, 2),
        },
      ],
    };
  }
}
