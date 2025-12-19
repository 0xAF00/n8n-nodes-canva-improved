import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CanvaMcpApi implements ICredentialType {
	name = 'canvaMcpApi';
	displayName = 'Canva MCP API';
	documentationUrl = 'https://www.canva.dev/docs/connect/';
	extends = ['oAuth2Api'];
	
	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'pkce',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: 'https://mcp.canva.com/authorize',
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: 'https://mcp.canva.com/oauth/token',
		},
		{
			displayName: 'MCP Server URL',
			name: 'mcpServerUrl',
			type: 'string',
			default: 'https://mcp.canva.com',
			required: true,
			description: 'Canva MCP server base URL',
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			required: true,
			description: 'Client ID from your Canva app configuration',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Client Secret from your Canva app configuration',
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: 'openid email profile design:content:read design:content:write design:meta:read asset:read asset:write folder:read folder:write comment:read comment:write brandtemplate:meta:read brandtemplate:content:read profile:read',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: 'response_type=code&code_challenge_method=S256',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'body',
		},
	];
}
