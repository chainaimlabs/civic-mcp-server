import { HttpClient } from './http-client.js';
import type { 
  AuthResponse, 
  PassStatus, 
  PassDetails, 
  CivicConfig, 
  Environment,
  VerificationScope,
  NetworkKey 
} from '../types/civic.js';

export class CivicApiService {
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(private readonly config: CivicConfig) {}

  /**
   * Authenticate with Civic Pass API using OAuth2 client credentials flow
   */
  async authenticate(environment: Environment = 'sandbox'): Promise<AuthResponse> {
    const creds = environment === 'sandbox' ? this.config.SANDBOX : {
      clientId: process.env.CIVIC_CLIENT_ID || '',
      clientSecret: process.env.CIVIC_CLIENT_SECRET || '',
    };

    if (!creds.clientId || !creds.clientSecret) {
      throw new Error('Client ID and secret are required for authentication');
    }

    const authData = {
      grant_type: 'client_credentials',
      client_id: creds.clientId,
      client_secret: creds.clientSecret,
      scope: 'read:pass write:pass',
    };

    console.error(`🔐 Authenticating with Civic API (${environment})...`);

    const response = await HttpClient.request<AuthResponse>({
      method: 'POST',
      url: this.config.AUTH_URL,
      data: authData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    this.accessToken = response.data.access_token;
    this.tokenExpiry = new Date(Date.now() + response.data.expires_in * 1000);

    console.error(`✅ Authentication successful! Token expires: ${this.tokenExpiry.toISOString()}`);

    return response.data;
  }

  /**
   * Check pass status for any wallet address
   */
  async checkPassStatus(
    walletAddress: string,
    network: NetworkKey,
    scope?: VerificationScope,
    gatekeeperNetwork?: string
  ): Promise<PassStatus> {
    await this.ensureAuthenticated();

    const networkConfig = this.config.NETWORKS[network];
    if (!networkConfig) {
      throw new Error(`Unsupported network: ${network}`);
    }

    const gkNetwork = gatekeeperNetwork || this.config.SANDBOX.gatekeeperNetwork;

    const params = new URLSearchParams({
      wallet: walletAddress,
      chain: networkConfig.civicChain,
      chainNetwork: networkConfig.civicChainNetwork,
      gatekeeperNetwork: gkNetwork,
    });

    if (scope && scope !== 'all') {
      params.append('scope', scope);
    }

    const url = `${this.config.API_BASE_URL}/pass/status?${params.toString()}`;

    console.error(`🔍 Checking pass status for ${walletAddress} on ${networkConfig.name}...`);

    const response = await HttpClient.request<PassStatus>({
      method: 'GET',
      url,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        Accept: 'application/json',
      },
    });

    console.error(`📊 Pass status retrieved for ${walletAddress}`);

    return response.data;
  }

  /**
   * Get detailed pass information
   */
  async getPassDetails(
    walletAddress: string,
    network: NetworkKey,
    includePII: boolean = false
  ): Promise<PassDetails> {
    await this.ensureAuthenticated();

    const networkConfig = this.config.NETWORKS[network];
    if (!networkConfig) {
      throw new Error(`Unsupported network: ${network}`);
    }

    const params = new URLSearchParams({
      wallet: walletAddress,
      chain: networkConfig.civicChain,
      chainNetwork: networkConfig.civicChainNetwork,
      includePII: includePII.toString(),
    });

    const url = `${this.config.API_BASE_URL}/pass/details?${params.toString()}`;

    console.error(`📋 Getting pass details for ${walletAddress}...`);

    const response = await HttpClient.request<PassDetails>({
      method: 'GET',
      url,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        Accept: 'application/json',
      },
    });

    return response.data;
  }

  /**
   * Ensure we have a valid access token
   */
  private async ensureAuthenticated(): Promise<void> {
    if (!this.accessToken || (this.tokenExpiry && this.tokenExpiry <= new Date())) {
      console.error('🔄 Token expired or missing, re-authenticating...');
      await this.authenticate('sandbox');
    }
  }
}
