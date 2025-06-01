// Civic Pass API Types
export interface CivicConfig {
  readonly API_BASE_URL: string;
  readonly AUTH_URL: string;
  readonly SANDBOX: SandboxConfig;
  readonly NETWORKS: Record<string, NetworkConfig>;
}

export interface SandboxConfig {
  readonly clientId: string;
  readonly clientSecret: string;
  readonly gatekeeperNetwork: string;
}

export interface NetworkConfig {
  readonly name: string;
  readonly chainId: number | string;
  readonly rpc: string;
  readonly explorer: string;
  readonly civicChain: 'ethereum' | 'solana';
  readonly civicChainNetwork: string;
}

export interface PassStatus {
  readonly status: 'ACTIVE' | 'EXPIRED' | 'REVOKED' | 'FROZEN' | 'NOT_FOUND';
  readonly address: string;
  readonly chainId: number | string;
  readonly gatekeeperNetwork: string;
  readonly expirationDate?: string;
  readonly issuedAt?: string;
  readonly tokenId?: string;
  readonly passType: string;
}

export interface AuthResponse {
  readonly access_token: string;
  readonly token_type: string;
  readonly expires_in: number;
  readonly scope: string;
}

export interface PassDetails {
  readonly passId: string;
  readonly status: string;
  readonly passType: string;
  readonly issuedAt: string;
  readonly verificationLevel: string;
  readonly metadata?: Record<string, unknown>;
}

export type VerificationScope = 'captcha' | 'uniqueness' | 'liveness' | 'id_verification' | 'all';
export type NetworkKey = 'xdc-apothem' | 'xdc-mainnet' | 'ethereum-sepolia' | 'polygon-amoy' | 'solana-devnet';
export type Environment = 'sandbox' | 'production';
