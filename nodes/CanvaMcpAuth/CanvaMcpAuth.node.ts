import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import crypto from 'node:crypto';
import http from 'node:http';
import { exec } from 'node:child_process';

// Software ID for Dynamic Client Registration (persistent across installations)
const N8N_MCP_SOFTWARE_ID = '2e6dc280-f3c3-4e01-99a7-8181dbd1d23d';
const N8N_MCP_VERSION = '2.6.0';

interface RegisteredClient {
	client_id: string;
	client_secret?: string;
	redirect_uris: string[];
	token_endpoint_auth_method?: string;
	grant_types?: string[];
}

// Store registered clients per server URL in memory
const registeredClients = new Map<string, RegisteredClient>();

/**
 * Register client dynamically with OAuth server
 */
async function registerClient(
	mcpServerUrl: string,
	callbackUrl: string,
	logger: any
): Promise<RegisteredClient> {
	// Check if already registered for this callback URL
	const cacheKey = `${mcpServerUrl}|${callbackUrl}`;
	const cached = registeredClients.get(cacheKey);
	if (cached) {
		logger.info('♻️ Using cached client registration');
		return cached;
	}

	logger.info('📝 Registering new OAuth client with Canva MCP...');
	logger.info(`📍 Callback URL: ${callbackUrl}`);

	const registrationData = {
		redirect_uris: [callbackUrl],
		token_endpoint_auth_method: 'none', // Public client (no secret)
		grant_types: ['authorization_code', 'refresh_token'],
		response_types: ['code'],
		client_name: 'n8n MCP Client',
		client_uri: 'https://n8n.io',
		software_id: N8N_MCP_SOFTWARE_ID,
		software_version: N8N_MCP_VERSION,
		scope: 'openid email profile',
	};

	const response = await fetch(`${mcpServerUrl}/register`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(registrationData),
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Client registration failed: ${response.status} ${errorText}`);
	}

	const registered = await response.json() as RegisteredClient;
	logger.info(`✅ Client registered: ${registered.client_id}`);

	// Cache it with callback URL
	registeredClients.set(cacheKey, registered);

	return registered;
}

export class CanvaMcpAuth implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Canva MCP Auth',
		name: 'canvaMcpAuth',
		icon: 'file:canva.svg',
		group: ['transform'],
		version: 1,
		description: 'Authenticate with Canva MCP using local OAuth flow',
		defaults: {
			name: 'Canva MCP Auth',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'canvaMcpStdio',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Authenticate',
						value: 'authenticate',
						description: 'Get OAuth token using local callback server',
						action: 'Authenticate with Canva MCP',
					},
					{
						name: 'Refresh Token',
						value: 'refresh',
						description: 'Refresh an expired access token',
						action: 'Refresh access token',
					},
					{
						name: 'Get Token Info',
						value: 'info',
						description: 'Get current token information',
						action: 'Get token information',
					},
				],
				default: 'authenticate',
			},
			{
				displayName: 'Public Callback URL',
				name: 'publicCallbackUrl',
				type: 'string',
				default: '',
				placeholder: 'https://n8n.babykoala.pe',
				description: 'Public URL for OAuth callback (leave empty for localhost). For servers, use your public domain without /oauth/callback path.',
				displayOptions: {
					show: {
						operation: ['authenticate'],
					},
				},
			},
			{
				displayName: 'Callback Port',
				name: 'callbackPort',
				type: 'number',
				default: 29865,
				description: 'Port for OAuth callback server (default: 29865). Only used when Public Callback URL is empty.',
				displayOptions: {
					show: {
						operation: ['authenticate'],
					},
				},
			},
			{
				displayName: 'MCP Endpoint',
				name: 'mcpEndpoint',
				type: 'options',
				options: [
					{
						name: 'SSE (Server-Sent Events) - /sse',
						value: 'sse',
						description: 'Standard SSE transport for MCP',
					},
					{
						name: 'MCP Protocol - /mcp',
						value: 'mcp',
						description: 'Alternative MCP endpoint (used by Claude Desktop)',
					},
				],
				default: 'sse',
				description: 'Which MCP endpoint to use for connection',
				displayOptions: {
					show: {
						operation: ['authenticate'],
					},
				},
			},
			{
				displayName: 'Auto Open Browser',
				name: 'autoOpenBrowser',
				type: 'boolean',
				default: true,
				description: 'Whether to automatically open the browser for authorization',
				displayOptions: {
					show: {
						operation: ['authenticate'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const operation = this.getNodeParameter('operation', 0) as string;
		
		const credentials = await this.getCredentials('canvaMcpStdio') as any;
		const mcpServerUrl = credentials.mcpServerUrl || 'https://mcp.canva.com';
		
		// Check if manual credentials are provided
		const manualClientId = credentials.clientId;
		const manualClientSecret = credentials.clientSecret;

		for (let i = 0; i < items.length; i++) {
				try {
				if (operation === 'authenticate') {
					const mcpEndpoint = this.getNodeParameter('mcpEndpoint', i) as string || 'sse';
					const publicCallbackUrl = this.getNodeParameter('publicCallbackUrl', i) as string || '';
					const callbackPort = this.getNodeParameter('callbackPort', i) as number || 29865;
					const autoOpenBrowser = this.getNodeParameter('autoOpenBrowser', i) as boolean;

					// Build callback URL
					let callbackUrl: string;
					let serverHost: string;
					let actualPort: number;

					if (publicCallbackUrl) {
						// Public server mode
						callbackUrl = `${publicCallbackUrl.replace(/\/$/, '')}/oauth/callback`;
						serverHost = '0.0.0.0'; // Listen on all interfaces
						actualPort = callbackPort;
						this.logger.info(`🌐 Public server mode: ${callbackUrl}`);
					} else {
						// Localhost mode
						callbackUrl = `http://localhost:${callbackPort}/oauth/callback`;
						serverHost = '127.0.0.1'; // Only localhost
						actualPort = callbackPort;
						this.logger.info(`🏠 Localhost mode: ${callbackUrl}`);
					}

					// Step 1: Get client credentials (manual or dynamic registration)
					let clientId: string;
					let clientSecret: string;

					if (manualClientId) {
						// Use manual credentials if provided
						this.logger.info('🔑 Using manual Client ID from credentials');
						clientId = manualClientId;
						clientSecret = manualClientSecret || '';
					} else {
						// Use Dynamic Client Registration
						const registeredClient = await registerClient(
							mcpServerUrl,
							callbackUrl,
							this.logger
						);
						clientId = registeredClient.client_id;
						clientSecret = registeredClient.client_secret || '';
					}						// Step 2: Generate PKCE challenge
						const codeVerifier = crypto.randomBytes(32).toString('base64url');
						const codeChallenge = crypto
							.createHash('sha256')
							.update(codeVerifier)
							.digest('base64url');

						const state = crypto.randomUUID();					// Create OAuth callback server
					const tokenResult = await new Promise<any>((resolve, reject) => {
						const server = http.createServer(async (req: any, res: any) => {
							const protocol = publicCallbackUrl ? 'https' : 'http';
							const host = publicCallbackUrl ? publicCallbackUrl.replace(/^https?:\/\//, '') : `localhost:${actualPort}`;
							const url = new URL(req.url!, `${protocol}://${host}`);
							
							if (url.pathname === '/oauth/callback') {
								const code = url.searchParams.get('code');
								const returnedState = url.searchParams.get('state');
								const error = url.searchParams.get('error');

								if (error) {
									res.writeHead(400, { 'Content-Type': 'text/html' });
									res.end(`<html><body><h1>❌ Authentication Failed</h1><p>${error}</p></body></html>`);
									server.close();
									reject(new Error(`OAuth error: ${error}`));
									return;
								}

								if (returnedState !== state) {
									res.writeHead(400, { 'Content-Type': 'text/html' });
									res.end('<html><body><h1>❌ State Mismatch</h1><p>Invalid OAuth state</p></body></html>');
									server.close();
									reject(new Error('OAuth state mismatch'));
									return;
								}

								if (!code) {
									res.writeHead(400, { 'Content-Type': 'text/html' });
									res.end('<html><body><h1>❌ No Authorization Code</h1></body></html>');
									server.close();
									reject(new Error('No authorization code received'));
									return;
						}

					// Exchange code for token
					try {
						this.logger.info(`🔄 Token exchange - Client ID: ${clientId}`);
						this.logger.info(`📍 Token endpoint: ${mcpServerUrl}/token`);
						
						// Build token request params (only include client_secret if present)
						const tokenParams: Record<string, string> = {
							grant_type: 'authorization_code',
							client_id: clientId,
							code: code,
							code_verifier: codeVerifier,
							redirect_uri: callbackUrl,
						};

						// Only add client_secret if it exists (public clients don't have secrets)
						if (clientSecret) {
							tokenParams.client_secret = clientSecret;
						}
						
						const tokenResponse = await fetch(`${mcpServerUrl}/token`, {
								method: 'POST',
									headers: {
										'Content-Type': 'application/x-www-form-urlencoded',
									},
									body: new URLSearchParams(tokenParams),
								});									if (!tokenResponse.ok) {
								const errorText = await tokenResponse.text();
								throw new Error(`Token exchange failed: ${errorText}`);
							}

							const tokenData = await tokenResponse.json() as any;

							res.writeHead(200, { 'Content-Type': 'text/html' });
									res.end(`
										<html>
											<body style="font-family: Arial; text-align: center; padding: 50px;">
												<h1>✅ Authentication Successful!</h1>
												<p>You can close this window and return to n8n.</p>
												<p style="color: #666; font-size: 14px;">Token expires in ${tokenData.expires_in} seconds</p>
											</body>
										</html>
									`);

								server.close();
								resolve({
									access_token: tokenData.access_token,
									refresh_token: tokenData.refresh_token,
									expires_in: tokenData.expires_in,
									token_type: tokenData.token_type,
									scope: tokenData.scope,
									expiry_timestamp: Date.now() + (tokenData.expires_in * 1000),
								});
							} catch (error) {
									res.writeHead(500, { 'Content-Type': 'text/html' });
									res.end(`<html><body><h1>❌ Token Exchange Failed</h1><p>${error}</p></body></html>`);
									server.close();
									reject(error);
								}
							} else {
								res.writeHead(404);
								res.end('Not found');
							}
						});

				server.listen(actualPort, serverHost, () => {
					const address = server.address();
					const listenPort = typeof address === 'object' && address ? address.port : actualPort;

				// MCP only requires OpenID Connect scopes
				const scopes = [
					'openid',
					'email',
					'profile',
				];
				
				const authUrl = new URL(`${mcpServerUrl}/authorize`);
				authUrl.searchParams.set('response_type', 'code');
				authUrl.searchParams.set('client_id', clientId);
				authUrl.searchParams.set('code_challenge', codeChallenge);
				authUrl.searchParams.set('code_challenge_method', 'S256');
				authUrl.searchParams.set('redirect_uri', callbackUrl);
				authUrl.searchParams.set('state', state);
				authUrl.searchParams.set('scope', scopes.join(' '));

				this.logger.info(`🔐 OAuth callback server running on ${serverHost}:${listenPort}`);
				this.logger.info(`📍 Callback URL: ${callbackUrl}`);
				this.logger.info(`🔌 MCP Server: ${mcpServerUrl} (endpoint: /${mcpEndpoint})`);
				this.logger.info(`🌐 Please authorize this client by visiting:`);
				this.logger.info(authUrl.toString());
				
				if (autoOpenBrowser) {
					// Try to open browser
					const command = process.platform === 'win32' ? 'start' : 
									process.platform === 'darwin' ? 'open' : 'xdg-open';
					exec(`${command} "${authUrl.toString()}"`);
					this.logger.info('🌐 Browser opened automatically');
				}
			});
			
			server.on('error', (error: any) => {
				reject(new Error(`Failed to start OAuth server: ${error.message}`));
			});

			// Timeout after 5 minutes
			setTimeout(() => {
				server.close();
				reject(new Error('OAuth authentication timeout (5 minutes)'));
			}, 5 * 60 * 1000);
		});

				// Update credential with new token (this won't persist automatically in n8n)
				// User needs to manually update the credential with these values
				returnData.push({
					json: {
						success: true,
						access_token: tokenResult.access_token,
						refresh_token: tokenResult.refresh_token,
						expires_in: tokenResult.expires_in,
						expiry_timestamp: tokenResult.expiry_timestamp,
						token_type: tokenResult.token_type,
						scope: tokenResult.scope,
						mcp_server_url: mcpServerUrl,
						mcp_endpoint: mcpEndpoint,
						message: '✅ Authentication successful! Copy the access_token and refresh_token to your Canva MCP Stdio credential.',
					},
					pairedItem: { item: i },
				});				} else if (operation === 'refresh') {
					const refreshToken = credentials.refreshToken;
					
					if (!refreshToken) {
					throw new NodeOperationError(
						this.getNode(),
						'Refresh token not found in credential. Please authenticate first.'
					);
				}

					// Get client credentials (manual or dynamic)
					// Note: For refresh, we use the same registration as authenticate
					let clientId: string;
					let clientSecret: string;

					if (manualClientId) {
						this.logger.info('🔑 Using manual Client ID for refresh');
						clientId = manualClientId;
						clientSecret = manualClientSecret || '';
					} else {
						// Use the first cached registration (we can't know which callback URL was used)
						const firstRegistration = Array.from(registeredClients.values())[0];
						if (firstRegistration) {
							this.logger.info('♻️ Using cached client for refresh');
							clientId = firstRegistration.client_id;
							clientSecret = firstRegistration.client_secret || '';
						} else {
							throw new NodeOperationError(
								this.getNode(),
								'No registered client found. Please authenticate first.'
							);
						}
					}

					const refreshParams: Record<string, string> = {
						grant_type: 'refresh_token',
						client_id: clientId,
						refresh_token: refreshToken,
					};

					if (clientSecret) {
						refreshParams.client_secret = clientSecret;
					}

				const tokenResponse = await fetch(`${mcpServerUrl}/token`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					body: new URLSearchParams(refreshParams),
					});

				if (!tokenResponse.ok) {
					const errorText = await tokenResponse.text();
					throw new NodeOperationError(
						this.getNode(),
						`Token refresh failed: ${errorText}`
					);
				}

				const tokenData = await tokenResponse.json() as any;

				returnData.push({
						json: {
							success: true,
							access_token: tokenData.access_token,
							refresh_token: tokenData.refresh_token || refreshToken,
							expires_in: tokenData.expires_in,
							expiry_timestamp: Date.now() + (tokenData.expires_in * 1000),
							token_type: tokenData.token_type,
							message: '✅ Token refreshed! Update your credential with the new access_token.',
						},
						pairedItem: { item: i },
					});

				} else if (operation === 'info') {
					const accessToken = credentials.accessToken;
					const tokenExpiry = credentials.tokenExpiry || 0;
					const now = Date.now();
					const isExpired = tokenExpiry > 0 && now > tokenExpiry;

					returnData.push({
						json: {
							has_access_token: !!accessToken,
							access_token_length: accessToken ? accessToken.length : 0,
							token_expiry: tokenExpiry,
							is_expired: isExpired,
							time_until_expiry_seconds: isExpired ? 0 : Math.floor((tokenExpiry - now) / 1000),
							message: isExpired ? '⚠️ Token expired. Please refresh or re-authenticate.' : '✅ Token is valid.',
						},
						pairedItem: { item: i },
					});
				}

			} catch (error) {
					if (this.continueOnFail()) {
						const errorMessage = error instanceof Error ? error.message : String(error);
						returnData.push({
							json: {
								error: errorMessage,
								success: false,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
