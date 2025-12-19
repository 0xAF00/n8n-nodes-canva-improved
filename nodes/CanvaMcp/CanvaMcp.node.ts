import { INodeType, INodeTypeDescription, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

export class CanvaMcp implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Canva MCP',
		name: 'canvaMcp',
		icon: 'file:canva.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["tool"]}}',
		description: 'Interact with Canva using Model Context Protocol (MCP) for AI-powered design generation',
		defaults: {
			name: 'Canva MCP',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'canvaMcpApi',
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
						name: 'Generate Design',
						value: 'generateDesign',
						description: 'Generate a design with AI using detailed content description',
						action: 'Generate a design with AI',
					},
					{
						name: 'Create Design from Candidate',
						value: 'createFromCandidate',
						description: 'Convert a generated design candidate into an editable Canva design',
						action: 'Create design from candidate',
					},
					{
						name: 'Export Design',
						value: 'exportDesign',
						description: 'Export a Canva design to PDF, PNG, JPG, or other formats',
						action: 'Export design',
					},
					{
						name: 'Search Designs',
						value: 'searchDesigns',
						description: 'Search for existing designs by keywords',
						action: 'Search designs',
					},
					{
						name: 'Get Design',
						value: 'getDesign',
						description: 'Get details about a specific design',
						action: 'Get design details',
					},
					{
						name: 'List Brand Kits',
						value: 'listBrandKits',
						description: 'List available brand kits for on-brand design generation',
						action: 'List brand kits',
					},
				],
				default: 'generateDesign',
			},

			// Generate Design Parameters
			{
				displayName: 'Design Type',
				name: 'designType',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						operation: ['generateDesign'],
					},
				},
				options: [
					{ name: 'Presentation', value: 'presentation' },
					{ name: 'Document', value: 'doc' },
					{ name: 'Whiteboard', value: 'whiteboard' },
					{ name: 'Poster', value: 'poster' },
					{ name: 'Flyer', value: 'flyer' },
					{ name: 'Instagram Post', value: 'instagram_post' },
					{ name: 'Business Card', value: 'business_card' },
				],
				default: 'presentation',
				description: 'Type of design to generate',
			},
			{
				displayName: 'Content Query',
				name: 'contentQuery',
				type: 'string',
				typeOptions: {
					rows: 10,
				},
				required: true,
				displayOptions: {
					show: {
						operation: ['generateDesign'],
					},
				},
				default: '',
				placeholder: 'Detailed description of the design content (titles, bullets, visuals, etc.)',
				description: 'CRITICAL: Provide extremely detailed content including exact titles, bullet points, visual specifications, and data for each page/section',
			},
			{
				displayName: 'Brand Kit ID',
				name: 'brandKitId',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['generateDesign'],
					},
				},
				default: '',
				description: 'Optional: Use a specific brand kit for on-brand design',
			},
			{
				displayName: 'Asset IDs',
				name: 'assetIds',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['generateDesign'],
					},
				},
				default: '',
				placeholder: 'asset_id_1,asset_id_2,asset_id_3',
				description: 'Optional: Comma-separated list of asset IDs to insert in the design',
			},

			// Create from Candidate Parameters
			{
				displayName: 'Job ID',
				name: 'jobId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['createFromCandidate'],
					},
				},
				default: '',
				description: 'Job ID returned from generate-design operation',
			},
			{
				displayName: 'Candidate ID',
				name: 'candidateId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['createFromCandidate'],
					},
				},
				default: '',
				description: 'Candidate ID of the design variant to create',
			},

			// Export Design Parameters
			{
				displayName: 'Design ID',
				name: 'designId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['exportDesign', 'getDesign'],
					},
				},
				default: '',
				description: 'ID of the design to export or retrieve',
			},
			{
				displayName: 'Export Format',
				name: 'exportFormat',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						operation: ['exportDesign'],
					},
				},
				options: [
					{ name: 'PDF', value: 'pdf' },
					{ name: 'PNG', value: 'png' },
					{ name: 'JPG', value: 'jpg' },
					{ name: 'GIF', value: 'gif' },
					{ name: 'MP4', value: 'mp4' },
					{ name: 'PPTX', value: 'pptx' },
				],
				default: 'pdf',
				description: 'Export format',
			},
			{
				displayName: 'Export Quality',
				name: 'exportQuality',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['exportDesign'],
					},
				},
				options: [
					{ name: 'Regular', value: 'regular' },
					{ name: 'Pro', value: 'pro' },
				],
				default: 'pro',
				description: 'Export quality level',
			},
			{
				displayName: 'Paper Size',
				name: 'paperSize',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['exportDesign'],
						exportFormat: ['pdf'],
					},
				},
				options: [
					{ name: 'A4', value: 'a4' },
					{ name: 'A3', value: 'a3' },
					{ name: 'Letter', value: 'letter' },
					{ name: 'Legal', value: 'legal' },
				],
				default: 'a4',
				description: 'Paper size for PDF export',
			},

			// Search Designs Parameters
			{
				displayName: 'Search Query',
				name: 'searchQuery',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['searchDesigns'],
					},
				},
				default: '',
				description: 'Keywords to search for in design titles and content',
			},
			{
				displayName: 'Ownership',
				name: 'ownership',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['searchDesigns'],
					},
				},
				options: [
					{ name: 'Any', value: 'any' },
					{ name: 'Owned', value: 'owned' },
					{ name: 'Shared', value: 'shared' },
				],
				default: 'any',
				description: 'Filter by ownership',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const operation = this.getNodeParameter('operation', 0) as string;

		// Get credentials
		const credentials = await this.getCredentials('canvaMcpApi') as any;
		const mcpServerUrl = (credentials.mcpServerUrl as string) || 'https://mcp.canva.com';
		
		// Extract OAuth token
		let accessToken: string;
		if (credentials.oauthTokenData) {
			// OAuth flow completed
			const oauthData = credentials.oauthTokenData as any;
			accessToken = oauthData.access_token;
		} else {
			throw new Error(
				'OAuth authentication required. Please connect your Canva account in the credential configuration.'
			);
		}

		if (!accessToken) {
			throw new Error('Access token is empty. Please re-authenticate with Canva MCP.');
		}

		// Log for debugging (remove in production)
		this.logger.info(`Connecting to Canva MCP at ${mcpServerUrl}`);
		this.logger.info(`Access token length: ${accessToken.length}`);

		// Initialize MCP client with SSE transport
		// Authentication via Authorization header (standard for MCP SSE)
		const originalFetch = (globalThis as any).fetch;
		if (!originalFetch) {
			throw new Error('Fetch API not available in this environment');
		}
		
		const authenticatedFetch = async (url: any, options: any = {}) => {
			const headers = {
				...options.headers,
				'Authorization': `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
				'Accept': 'text/event-stream',
			};
			
			this.logger.debug(`MCP Fetch: ${url}`);
			this.logger.debug(`Headers: ${JSON.stringify(Object.keys(headers))}`);
			
			return originalFetch(url, { ...options, headers });
		};

		// Temporarily override fetch for MCP SDK
		(globalThis as any).fetch = authenticatedFetch;

		let client: Client | null = null;
		let transport: SSEClientTransport | null = null;

		try {
			const sseEndpoint = `${mcpServerUrl}/sse`;
			
			transport = new SSEClientTransport(
				new (globalThis as any).URL(sseEndpoint),
				{} as any
			);

			client = new Client(
				{
					name: 'n8n-canva-mcp-client',
					version: '2.3.0',
				},
				{
					capabilities: {
						// Declare what this client supports
						sampling: {},
					},
				}
			);

			this.logger.info('Attempting to connect to Canva MCP...');
			await client.connect(transport);
			this.logger.info('✅ Successfully connected to Canva MCP');

			// List available tools for debugging
			const toolsList = await client.listTools();
			this.logger.info(`Available MCP tools: ${toolsList.tools.map((t: any) => t.name).join(', ')}`);

			for (let i = 0; i < items.length; i++) {
				try {
					let result: any;
					this.logger.info(`Processing item ${i + 1}/${items.length}: ${operation}`);

					switch (operation) {
						case 'generateDesign': {
							const designType = this.getNodeParameter('designType', i) as string;
							const contentQuery = this.getNodeParameter('contentQuery', i) as string;
							const brandKitId = this.getNodeParameter('brandKitId', i, '') as string;
							const assetIdsStr = this.getNodeParameter('assetIds', i, '') as string;

							const args: any = {
								design_type: designType,
								query: contentQuery,
							};

							if (brandKitId) {
								args.brand_kit_id = brandKitId;
							}

							if (assetIdsStr) {
								args.asset_ids = assetIdsStr.split(',').map((id: string) => id.trim());
							}

							result = await client.callTool({
								name: 'generate-design',
								arguments: args,
							});
							break;
						}

						case 'createFromCandidate': {
							const jobId = this.getNodeParameter('jobId', i) as string;
							const candidateId = this.getNodeParameter('candidateId', i) as string;

							result = await client.callTool({
								name: 'create-design-from-candidate',
								arguments: {
									job_id: jobId,
									candidate_id: candidateId,
								},
							});
							break;
						}

						case 'exportDesign': {
							const designId = this.getNodeParameter('designId', i) as string;
							const exportFormat = this.getNodeParameter('exportFormat', i) as string;
							const exportQuality = this.getNodeParameter('exportQuality', i) as string;
							const paperSize = this.getNodeParameter('paperSize', i, 'a4') as string;

							const formatConfig: any = {
								type: exportFormat,
								export_quality: exportQuality,
							};

							if (exportFormat === 'pdf') {
								formatConfig.size = paperSize;
							}

							result = await client.callTool({
								name: 'export-design',
								arguments: {
									design_id: designId,
									format: formatConfig,
								},
							});
							break;
						}

						case 'searchDesigns': {
							const searchQuery = this.getNodeParameter('searchQuery', i, '') as string;
							const ownership = this.getNodeParameter('ownership', i, 'any') as string;

							const args: any = { ownership };
							if (searchQuery) {
								args.query = searchQuery;
								args.sort_by = 'relevance';
							}

							result = await client.callTool({
								name: 'search-designs',
								arguments: args,
							});
							break;
						}

						case 'getDesign': {
							const designId = this.getNodeParameter('designId', i) as string;

							result = await client.callTool({
								name: 'get-design',
								arguments: {
									design_id: designId,
								},
							});
							break;
						}

						case 'listBrandKits': {
							result = await client.callTool({
								name: 'list-brand-kits',
								arguments: {},
							});
							break;
						}

						default:
							throw new Error(`Unknown operation: ${operation}`);
					}

					returnData.push({
						json: result,
						pairedItem: { item: i },
					});
				} catch (error) {
					if (this.continueOnFail()) {
						const errorMessage = error instanceof Error ? error.message : String(error);
						returnData.push({
							json: { error: errorMessage },
							pairedItem: { item: i },
						});
						continue;
					}
					throw error;
				}
			}
		} catch (connectionError) {
			// Restore fetch before throwing
			(globalThis as any).fetch = originalFetch;
			
			const errorMessage = connectionError instanceof Error 
				? connectionError.message 
				: String(connectionError);
			
			throw new Error(
				`Failed to connect to Canva MCP: ${errorMessage}\n\n` +
				`Troubleshooting:\n` +
				`1. Verify your Canva MCP credentials are authenticated\n` +
				`2. Check that ${mcpServerUrl} is accessible\n` +
				`3. Ensure your OAuth token is valid (not expired)\n` +
				`4. Try re-authenticating the credential in n8n`
			);
		} finally {
			// Cleanup
			(globalThis as any).fetch = originalFetch;
			if (client) {
				try {
					await client.close();
				} catch (closeError) {
					this.logger.warn(`Error closing MCP client: ${closeError}`);
				}
			}
		}

		return [returnData];
	}
}
