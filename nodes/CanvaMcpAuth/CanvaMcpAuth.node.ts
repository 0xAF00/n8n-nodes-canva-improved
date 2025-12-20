import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

// Node.js APIs accessed via globalThis for TypeScript compatibility

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
				displayName: 'Callback Port',
				name: 'callbackPort',
				type: 'number',
				default: 29865,
				description: 'Port for OAuth callback server (default: 29865)',
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
		const clientId = credentials.clientId;
		const clientSecret = credentials.clientSecret;

		if (!clientId || !clientSecret) {
			throw new NodeOperationError(
				this.getNode(),
				'Client ID and Client Secret are required in the credential'
			);
		}

		for (let i = 0; i < items.length; i++) {
			try {
				if (operation === 'authenticate') {
					// Generate PKCE challenge
					const crypto = (globalThis as any).require('crypto');
					const codeVerifier = crypto.randomBytes(32).toString('base64url');
					const codeChallenge = crypto
						.createHash('sha256')
						.update(codeVerifier)
						.digest('base64url');

					const state = crypto.randomUUID();
					const callbackPort = this.getNodeParameter('callbackPort', i) as number || 29865;
					const autoOpenBrowser = this.getNodeParameter('autoOpenBrowser', i) as boolean;

					// Create local OAuth callback server
					const tokenResult = await new Promise<any>((resolve, reject) => {
						const http = (globalThis as any).require('http');
						const server = http.createServer(async (req: any, res: any) => {
							const URL = (globalThis as any).URL;
							const url = new URL(req.url!, `http://localhost:${actualPort}`);
							
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
									const fetch = (globalThis as any).fetch;
									const URLSearchParams = (globalThis as any).URLSearchParams;
									const tokenResponse = await fetch(`${mcpServerUrl}/oauth/token`, {
										method: 'POST',
										headers: {
											'Content-Type': 'application/x-www-form-urlencoded',
										},
										body: new URLSearchParams({
											grant_type: 'authorization_code',
											client_id: clientId,
											client_secret: clientSecret,
											code: code,
											code_verifier: codeVerifier,
											redirect_uri: `http://localhost:${actualPort}/oauth/callback`,
										}),
									});

									if (!tokenResponse.ok) {
										const errorText = await tokenResponse.text();
										throw new Error(`Token exchange failed: ${errorText}`);
									}

									const tokenData = await tokenResponse.json();

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
									expiry_timestamp: (globalThis as any).Date.now() + (tokenData.expires_in * 1000),
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

						let actualPort: number;

						server.listen(callbackPort, () => {
							const address = server.address();
							actualPort = typeof address === 'object' && address ? address.port : callbackPort;

							const URL = (globalThis as any).URL;
							const scopes = [
								'openid',
								'email',
								'profile',
								'design:content:read',
								'design:content:write',
								'design:meta:read',
								'asset:read',
								'asset:write',
								'folder:read',
								'folder:write',
								'comment:read',
								'comment:write',
								'brandtemplate:meta:read',
								'brandtemplate:content:read',
								'profile:read',
							];

							const authUrl = new URL(`${mcpServerUrl}/authorize`);
							authUrl.searchParams.set('response_type', 'code');
							authUrl.searchParams.set('client_id', clientId);
							authUrl.searchParams.set('code_challenge', codeChallenge);
							authUrl.searchParams.set('code_challenge_method', 'S256');
							authUrl.searchParams.set('redirect_uri', `http://localhost:${actualPort}/oauth/callback`);
							authUrl.searchParams.set('state', state);
							authUrl.searchParams.set('scope', scopes.join(' '));

							this.logger.info(`🔐 OAuth callback server running at http://localhost:${actualPort}`);
							this.logger.info(`🌐 Please authorize this client by visiting:`);
							this.logger.info(authUrl.toString());

							if (autoOpenBrowser) {
								// Try to open browser
								const { exec } = (globalThis as any).require('child_process');
								const process = (globalThis as any).process;
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
							const setTimeout = (globalThis as any).setTimeout;
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
							message: '✅ Authentication successful! Copy the access_token and refresh_token to your Canva MCP Stdio credential.',
						},
						pairedItem: { item: i },
					});

				} else if (operation === 'refresh') {
					const refreshToken = credentials.refreshToken;
					
					if (!refreshToken) {
						throw new NodeOperationError(
							this.getNode(),
							'Refresh token not found in credential. Please authenticate first.'
						);
					}

					const fetch = (globalThis as any).fetch;
					const URLSearchParams = (globalThis as any).URLSearchParams;
					const tokenResponse = await fetch(`${mcpServerUrl}/oauth/token`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
						},
						body: new URLSearchParams({
							grant_type: 'refresh_token',
							client_id: clientId,
							client_secret: clientSecret,
							refresh_token: refreshToken,
						}),
					});

					if (!tokenResponse.ok) {
						const errorText = await tokenResponse.text();
						throw new NodeOperationError(
							this.getNode(),
							`Token refresh failed: ${errorText}`
						);
					}

					const tokenData = await tokenResponse.json();

					returnData.push({
						json: {
							success: true,
								access_token: tokenData.access_token,
								refresh_token: tokenData.refresh_token || refreshToken,
								expires_in: tokenData.expires_in,
								expiry_timestamp: (globalThis as any).Date.now() + (tokenData.expires_in * 1000),
							token_type: tokenData.token_type,
							message: '✅ Token refreshed! Update your credential with the new access_token.',
						},
						pairedItem: { item: i },
					});

				} else if (operation === 'info') {
					const accessToken = credentials.accessToken;
					const tokenExpiry = credentials.tokenExpiry || 0;
					const now = (globalThis as any).Date.now();
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
