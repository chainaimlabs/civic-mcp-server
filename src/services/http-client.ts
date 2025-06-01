import https from 'https';
import { URL } from 'url';

export interface HttpResponse<T = unknown> {
  readonly statusCode: number;
  readonly data: T;
}

export interface HttpRequestOptions {
  readonly method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  readonly url: string;
  readonly data?: Record<string, unknown>;
  readonly headers?: Record<string, string>;
  readonly timeout?: number;
}

export class HttpClient {
  private static readonly DEFAULT_TIMEOUT = 30000;
  private static readonly USER_AGENT = 'Civic-Pass-MCP-Server-TS/3.0.0';

  static async request<T = unknown>(options: HttpRequestOptions): Promise<HttpResponse<T>> {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(options.url);
      
      // Prepare request data
      let postData = '';
      const headers: Record<string, string> = { 
        'User-Agent': this.USER_AGENT,
        ...options.headers 
      };
      
      if (options.data) {
        if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
          postData = new URLSearchParams(options.data as Record<string, string>).toString();
        } else {
          postData = JSON.stringify(options.data);
          headers['Content-Type'] = headers['Content-Type'] || 'application/json';
        }
      }

      // Fix: Set Content-Length in the headers object before creating request options
      if (postData) {
        headers['Content-Length'] = Buffer.byteLength(postData).toString();
      }

      const requestOptions: https.RequestOptions = {
        hostname: urlObj.hostname,
        port: urlObj.port || 443,
        path: urlObj.pathname + urlObj.search,
        method: options.method,
        headers: headers, // Now headers is properly typed as Record<string, string>
      };

      const req = https.request(requestOptions, (res) => {
        let responseData = '';

        res.on('data', (chunk: Buffer) => {
          responseData += chunk.toString();
        });

        res.on('end', () => {
          try {
            const parsedData = JSON.parse(responseData) as T;
            
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              resolve({ statusCode: res.statusCode, data: parsedData });
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
            }
          } catch (parseError) {
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              resolve({ statusCode: res.statusCode, data: responseData as T });
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
            }
          }
        });
      });

      req.on('error', (error: Error) => {
        reject(new Error(`Request failed: ${error.message}`));
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.setTimeout(options.timeout || this.DEFAULT_TIMEOUT);

      if (postData) {
        req.write(postData);
      }

      req.end();
    });
  }
}
