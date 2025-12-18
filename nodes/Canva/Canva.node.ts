import { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class Canva implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Canva',
		name: 'canva',
		icon: 'file:canva.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Canva Connect API to create designs, manage assets, export content, and automate workflows',
		defaults: {
			name: 'Canva',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'canvaApi',
				required: true,
			},
		],
		usableAsTool: true,
		requestDefaults: {
			baseURL: 'https://api.canva.com/rest/v1',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			// ===================================
			// RESOURCE SELECTOR
			// ===================================
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Asset',
						value: 'assets',
						description: 'Upload and manage assets like images, videos, and audio files in Canva',
					},
					{
						name: 'Autofill',
						value: 'autofill',
						description: 'Automatically populate Canva templates with data to create multiple designs',
					},
					{
						name: 'Brand Template',
						value: 'brandTemplates',
						description: 'Access and manage brand templates for consistent design creation',
					},
					{
						name: 'Comment',
						value: 'comments',
						description: 'Add, read, and manage comments on Canva designs for collaboration',
					},
					{
						name: 'Design',
						value: 'designs',
						description: 'Create, update, delete, and retrieve Canva designs (documents, presentations, whiteboards)',
					},
					{
						name: 'Export',
						value: 'exports',
						description: 'Export Canva designs to various formats (PDF, PNG, JPG, MP4, GIF, PPTX)',
					},
					{
						name: 'Folder',
						value: 'folders',
						description: 'Organize designs by creating, listing, and managing folders',
					},
					{
						name: 'User',
						value: 'users',
						description: 'Get information about the authenticated Canva user profile',
					},
				],
				default: 'designs',
			},

			// ===================================
			// DESIGNS OPERATIONS
			// ===================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['designs'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						action: 'Create a design',
						description: 'Create a new Canva design (document, presentation, or whiteboard)',
						routing: {
							request: {
								method: 'POST',
								url: '/designs',
							},
						},
					},
					{
						name: 'Get',
						value: 'get',
						action: 'Get a design',
						description: 'Retrieve information about a specific Canva design by ID',
						routing: {
							request: {
								method: 'GET',
								url: '=/designs/{{$parameter["designId"]}}',
							},
						},
					},
					{
						name: 'List',
						value: 'list',
						action: 'List designs',
						description: 'List all designs owned by the user',
						routing: {
							request: {
								method: 'GET',
								url: '/designs',
							},
						},
					},
					{
						name: 'Update',
						value: 'update',
						action: 'Update a design',
						description: 'Update the title of a Canva design',
						routing: {
							request: {
								method: 'PATCH',
								url: '=/designs/{{$parameter["designId"]}}',
							},
						},
					},
					{
						name: 'Delete',
						value: 'delete',
						action: 'Delete a design',
						description: 'Permanently delete a Canva design',
						routing: {
							request: {
								method: 'DELETE',
								url: '=/designs/{{$parameter["designId"]}}',
							},
						},
					},
				],
				default: 'create',
			},

			// ===================================
			// DESIGN PARAMETERS
			// ===================================
			{
				displayName: 'Design Type',
				name: 'designType',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['designs'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'Document',
						value: 'doc',
						description: 'Canva Document for text-rich content',
					},
					{
						name: 'Whiteboard',
						value: 'whiteboard',
						description: 'Collaborative whiteboard for brainstorming',
					},
					{
						name: 'Presentation',
						value: 'presentation',
						description: 'Presentation with slides',
					},
				],
				default: 'doc',
				description: 'Type of design to create in Canva',
			},
			{
				displayName: 'Design ID',
				name: 'designId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['designs'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'ID del design',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['designs'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				description: 'Título del design',
			},
			{
				displayName: 'Asset ID',
				name: 'assetId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['designs'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'ID de un asset para insertar en el design (opcional)',
			},

			// ===================================
			// EXPORTS OPERATIONS
			// ===================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['exports'],
					},
				},
				options: [
					{
						name: 'Create Export Job',
						value: 'createJob',
						action: 'Create an export job',
						description: 'Create an asynchronous export job to export a design in various formats',
						routing: {
							request: {
								method: 'POST',
								url: '/exports',
							},
						},
					},
					{
						name: 'Get Export Job',
						value: 'getJob',
						action: 'Get an export job',
						description: 'Get the status and download URL of an export job',
						routing: {
							request: {
								method: 'GET',
								url: '=/exports/{{$parameter["exportJobId"]}}',
							},
						},
					},
				],
				default: 'createJob',
			},

			// ===================================
			// EXPORT PARAMETERS
			// ===================================
			{
				displayName: 'Design ID',
				name: 'designId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['exports'],
						operation: ['createJob'],
					},
				},
				default: '',
				description: 'ID del design a exportar',
			},
			{
				displayName: 'Export Format',
				name: 'exportFormat',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['exports'],
						operation: ['createJob'],
					},
				},
				options: [
					{
						name: 'PDF',
						value: 'pdf',
					},
					{
						name: 'JPG',
						value: 'jpg',
					},
					{
						name: 'PNG',
						value: 'png',
					},
					{
						name: 'GIF',
						value: 'gif',
					},
					{
						name: 'PPTX',
						value: 'pptx',
					},
					{
						name: 'MP4',
						value: 'mp4',
					},
				],
				default: 'pdf',
				description: 'Export format for the design (PDF, PNG, JPG, GIF, PPTX, or MP4)',
			},
			{
				displayName: 'Export Quality',
				name: 'exportQuality',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['exports'],
						operation: ['createJob'],
					},
				},
				options: [
					{
						name: 'Regular',
						value: 'regular',
					},
					{
						name: 'Pro',
						value: 'pro',
					},
				],
				default: 'regular',
				description: 'Quality level for the exported file',
			},
			{
				displayName: 'Paper Size',
				name: 'paperSize',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['exports'],
						operation: ['createJob'],
						exportFormat: ['pdf'],
					},
				},
				options: [
					{
						name: 'A4',
						value: 'a4',
					},
					{
						name: 'A3',
						value: 'a3',
					},
					{
						name: 'Letter',
						value: 'letter',
					},
					{
						name: 'Legal',
						value: 'legal',
					},
				],
				default: 'a4',
				description: 'Paper size for PDF export (only for Canva Docs)',
			},
			{
				displayName: 'Pages',
				name: 'pages',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['exports'],
						operation: ['createJob'],
					},
				},
				default: '',
				placeholder: '1,2,3',
				description: 'Page numbers to export (comma-separated). Leave empty to export all pages',
			},
			{
				displayName: 'Export Job ID',
				name: 'exportJobId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['exports'],
						operation: ['getJob'],
					},
				},
				default: '',
				description: 'The unique identifier of the export job to retrieve',
			},

			// ===================================
			// FOLDERS OPERATIONS
			// ===================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['folders'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						action: 'Create a folder',
						description: 'Create a new folder to organize designs',
						routing: {
							request: {
								method: 'POST',
								url: '/folders',
							},
						},
					},
					{
						name: 'List',
						value: 'list',
						action: 'List folders',
						description: 'List all folders in the user account',
						routing: {
							request: {
								method: 'GET',
								url: '/folders',
							},
						},
					},
					{
						name: 'Get',
						value: 'get',
						action: 'Get a folder',
						description: 'Get detailed information about a specific folder',
						routing: {
							request: {
								method: 'GET',
								url: '=/folders/{{$parameter["folderId"]}}',
							},
						},
					},
					{
						name: 'List Items',
						value: 'listItems',
						action: 'List folder items',
						description: 'Lista los items de una carpeta',
						routing: {
							request: {
								method: 'GET',
								url: '=/folders/{{$parameter["folderId"]}}/items',
							},
						},
					},
				],
				default: 'list',
			},

			// ===================================
			// FOLDER PARAMETERS
			// ===================================
			{
				displayName: 'Folder Name',
				name: 'folderName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['folders'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Nombre de la carpeta',
			},
			{
				displayName: 'Folder ID',
				name: 'folderId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['folders'],
						operation: ['get', 'listItems'],
					},
				},
				default: '',
				description: 'ID de la carpeta',
			},

			// ===================================
			// USERS OPERATIONS
			// ===================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['users'],
					},
				},
				options: [
					{
						name: 'Get Profile',
						value: 'getProfile',
						action: 'Get user profile',
						description: 'Get the profile information of the authenticated Canva user',
						routing: {
							request: {
								method: 'GET',
								url: '/users/me',
							},
						},
					},
				],
				default: 'getProfile',
			},
		],
	};

	async execute(this: any): Promise<any> {
		const items = this.getInputData();
		const returnData: any[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData;

				if (resource === 'designs') {
					if (operation === 'create') {
						const designType = this.getNodeParameter('designType', i) as string;
						const title = this.getNodeParameter('title', i, '') as string;
						const assetId = this.getNodeParameter('assetId', i, '') as string;

						const body: any = {
							design_type: {
								type: 'preset',
								name: designType,
							},
						};

						if (title) body.title = title;
						if (assetId) body.asset_id = assetId;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaApi',
							{
								method: 'POST',
								url: 'https://api.canva.com/rest/v1/designs',
								body,
								json: true,
							},
						);
					} else if (operation === 'get') {
						const designId = this.getNodeParameter('designId', i) as string;
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaApi',
							{
								method: 'GET',
								url: `https://api.canva.com/rest/v1/designs/${designId}`,
								json: true,
							},
						);
					} else if (operation === 'list') {
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaApi',
							{
								method: 'GET',
								url: 'https://api.canva.com/rest/v1/designs',
								json: true,
							},
						);
					} else if (operation === 'update') {
						const designId = this.getNodeParameter('designId', i) as string;
						const title = this.getNodeParameter('title', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaApi',
							{
								method: 'PATCH',
								url: `https://api.canva.com/rest/v1/designs/${designId}`,
								body: { title },
								json: true,
							},
						);
					} else if (operation === 'delete') {
						const designId = this.getNodeParameter('designId', i) as string;
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaApi',
							{
								method: 'DELETE',
								url: `https://api.canva.com/rest/v1/designs/${designId}`,
								json: true,
							},
						);
					}
				} else if (resource === 'exports') {
					if (operation === 'createJob') {
						const designId = this.getNodeParameter('designId', i) as string;
						const exportFormat = this.getNodeParameter('exportFormat', i) as string;
						const exportQuality = this.getNodeParameter('exportQuality', i, 'regular') as string;
						const paperSize = this.getNodeParameter('paperSize', i, 'a4') as string;
						const pagesStr = this.getNodeParameter('pages', i, '') as string;

						const format: any = {
							type: exportFormat,
							export_quality: exportQuality,
						};

						if (exportFormat === 'pdf') {
							format.size = paperSize;
						}

						const body: any = {
							design_id: designId,
							format,
						};

						if (pagesStr) {
							body.pages = pagesStr.split(',').map((p: string) => parseInt(p.trim(), 10));
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaApi',
							{
								method: 'POST',
								url: 'https://api.canva.com/rest/v1/exports',
								body,
								json: true,
							},
						);
					} else if (operation === 'getJob') {
						const exportJobId = this.getNodeParameter('exportJobId', i) as string;
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaApi',
							{
								method: 'GET',
								url: `https://api.canva.com/rest/v1/exports/${exportJobId}`,
								json: true,
							},
						);
					}
				} else if (resource === 'folders') {
					if (operation === 'create') {
						const folderName = this.getNodeParameter('folderName', i) as string;
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaApi',
							{
								method: 'POST',
								url: 'https://api.canva.com/rest/v1/folders',
								body: { name: folderName },
								json: true,
							},
						);
					} else if (operation === 'list') {
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaApi',
							{
								method: 'GET',
								url: 'https://api.canva.com/rest/v1/folders',
								json: true,
							},
						);
					} else if (operation === 'get') {
						const folderId = this.getNodeParameter('folderId', i) as string;
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaApi',
							{
								method: 'GET',
								url: `https://api.canva.com/rest/v1/folders/${folderId}`,
								json: true,
							},
						);
					} else if (operation === 'listItems') {
						const folderId = this.getNodeParameter('folderId', i) as string;
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaApi',
							{
								method: 'GET',
								url: `https://api.canva.com/rest/v1/folders/${folderId}/items`,
								json: true,
							},
						);
					}
				} else if (resource === 'users') {
					if (operation === 'getProfile') {
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'canvaApi',
							{
								method: 'GET',
								url: 'https://api.canva.com/rest/v1/users/me',
								json: true,
							},
						);
				}
			}

			returnData.push({ json: responseData || {} });
		} catch (error) {
			if (this.continueOnFail()) {
				const errorMessage = error instanceof Error ? error.message : String(error);
				returnData.push({ json: { error: errorMessage } });
				continue;
			}
			throw error;
		}
	}		return [returnData];
	}
}
