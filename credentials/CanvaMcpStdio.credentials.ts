import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CanvaMcpStdio implements ICredentialType {
	name = 'canvaMcpStdio';
	displayName = 'Canva MCP API (Stdio)';
	documentationUrl = 'https://github.com/0xAF00/n8n-nodes-canva-improved';
	
	properties: INodeProperties[] = [
		{
			displayName: 'MCP Server URL',
			name: 'mcpServerUrl',
			type: 'string',
			default: 'https://mcp.canva.com',
			description: 'The base URL of the Canva MCP server',
			required: true,
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			description: 'The Client ID from your Canva app',
			required: true,
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'The Client Secret from your Canva app',
			required: true,
		},
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'OAuth access token (will be filled automatically after authentication)',
			required: false,
		},
		{
			displayName: 'Refresh Token',
			name: 'refreshToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'OAuth refresh token (will be filled automatically after authentication)',
			required: false,
		},
		{
			displayName: 'Token Expiry',
			name: 'tokenExpiry',
			type: 'number',
			default: 0,
			description: 'Token expiration timestamp',
			required: false,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'Authorization': '=Bearer {{$credentials.accessToken}}',
				'Content-Type': 'application/json',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.mcpServerUrl}}',
			url: '/sse',
			method: 'GET',
		},
	};
}
