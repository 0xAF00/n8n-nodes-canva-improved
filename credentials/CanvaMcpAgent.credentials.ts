import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CanvaMcpAgent implements ICredentialType {
	name = 'canvaMcpAgent';
	displayName = 'Canva MCP (AI Agent)';
	documentationUrl = 'https://github.com/0xAF00/n8n-nodes-canva-improved';
	
	properties: INodeProperties[] = [
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			placeholder: 'eyJ0eXAiOiJKV1QiLCJh...',
			description: 'Canva OAuth access token. Get it from Canva MCP Auth node output.',
			required: true,
		},
		{
			displayName: 'MCP Server URL',
			name: 'serverUrl',
			type: 'string',
			default: 'https://mcp.canva.com/sse',
			description: 'Canva MCP Server endpoint (SSE)',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'Authorization': '=Bearer {{$credentials.accessToken}}',
				'Content-Type': 'text/event-stream',
				'Accept': 'text/event-stream',
			},
		},
	};
}
