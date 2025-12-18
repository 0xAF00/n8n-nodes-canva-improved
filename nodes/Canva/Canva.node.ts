import { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class Canva implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Canva',
		name: 'canva',
		icon: 'file:canva.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interactúa con la API de Canva Connect (API actualizada)',
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
						description: 'Gestionar assets (imágenes, videos, audios)',
					},
					{
						name: 'Autofill',
						value: 'autofill',
						description: 'Rellenar templates automáticamente con datos',
					},
					{
						name: 'Brand Template',
						value: 'brandTemplates',
						description: 'Gestionar templates de marca',
					},
					{
						name: 'Comment',
						value: 'comments',
						description: 'Gestionar comentarios en designs',
					},
					{
						name: 'Design',
						value: 'designs',
						description: 'Gestionar designs y templates',
					},
					{
						name: 'Export',
						value: 'exports',
						description: 'Exportar designs en diferentes formatos',
					},
					{
						name: 'Folder',
						value: 'folders',
						description: 'Gestionar carpetas de organización',
					},
					{
						name: 'User',
						value: 'users',
						description: 'Información del usuario',
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
						description: 'Crea un nuevo design en Canva',
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
						description: 'Obtiene información de un design específico',
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
						description: 'Lista los designs del usuario',
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
						description: 'Actualiza el título de un design',
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
						description: 'Elimina un design',
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
						name: 'Doc',
						value: 'doc',
						description: 'Documento de Canva',
					},
					{
						name: 'Whiteboard',
						value: 'whiteboard',
						description: 'Pizarra colaborativa',
					},
					{
						name: 'Presentation',
						value: 'presentation',
						description: 'Presentación',
					},
				],
				default: 'doc',
				description: 'Tipo de design a crear',
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
						description: 'Crea un trabajo de exportación asíncrono',
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
						description: 'Obtiene el estado de un trabajo de exportación',
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
				description: 'Formato de exportación',
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
				description: 'Calidad de exportación',
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
				description: 'Tamaño de papel para PDF (solo para Canva Docs)',
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
				description: 'Páginas a exportar (separadas por comas). Deja vacío para exportar todas',
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
				description: 'ID del trabajo de exportación',
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
						description: 'Crea una nueva carpeta',
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
						description: 'Lista las carpetas',
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
						description: 'Obtiene información de una carpeta',
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
						description: 'Obtiene el perfil del usuario actual',
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
