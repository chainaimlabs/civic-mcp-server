import type { NetworkConfig, NetworkKey } from '../types/civic.js';

export class ValidationUtils {
  /**
   * Validates if a wallet address has the correct format for the specified network
   */
  static isValidWalletAddress(address: string, networkConfig: NetworkConfig): boolean {
    if (networkConfig.civicChain === 'solana') {
      // Solana addresses are base58 encoded, typically 32-44 characters
      return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
    } else {
      // EVM addresses (Ethereum, XDC, Polygon, etc.)
      return /^0x[a-fA-F0-9]{40}$/.test(address);
    }
  }

  /**
   * Validates network key
   */
  static isValidNetworkKey(network: string): network is NetworkKey {
    const validNetworks: NetworkKey[] = [
      'xdc-apothem',
      'xdc-mainnet', 
      'ethereum-sepolia',
      'polygon-amoy',
      'solana-devnet'
    ];
    return validNetworks.includes(network as NetworkKey);
  }

  /**
   * Sanitizes wallet address
   */
  static sanitizeWalletAddress(address: string): string {
    return address.trim().toLowerCase();
  }
}
