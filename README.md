# n8n-nodes-canva-improved

Enhanced Canva integration for n8n with AI-powered design generation and MCP support.

[![NPM Version](https://img.shields.io/npm/v/n8n-nodes-canva-improved)](https://www.npmjs.com/package/n8n-nodes-canva-improved)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🚀 Features

### 3 Powerful Nodes

1. **Canva MCP Auth** - OAuth 2.0 authentication with Dynamic Client Registration
2. **Canva MCP** - AI-powered design generation via Model Context Protocol
3. **Canva (REST)** - Traditional REST API for CRUD operations

### Key Capabilities

- ✅ **AI Design Generation**: Create presentations, posters, and documents with AI
- ✅ **Automatic Export**: Export designs as PDF, PNG, JPG (PRO quality)
- ✅ **n8n AI Agent Ready**: Full integration with n8n AI Agent using MCP Tool
- ✅ **OAuth 2.0 PKCE**: Secure authentication flow
- ✅ **Brand Kit Support**: Use your brand assets and colors

## 📦 Installation

### Option 1: From npm (Recommended)

```bash
npm install n8n-nodes-canva-improved
```

Then restart n8n.

### Option 2: Manual Installation

```bash
# In your n8n installation directory
cd ~/.n8n/custom
npm install n8n-nodes-canva-improved

# Restart n8n
pm2 restart n8n
# or
systemctl restart n8n
```

### Option 3: Community Nodes (n8n Cloud/Self-hosted)

1. Go to **Settings → Community Nodes**
2. Click **Install a community node**
3. Enter: `n8n-nodes-canva-improved`
4. Click **Install**

## 🎯 Quick Start

### 1. Authentication Setup

1. Get your Canva credentials:
   - Go to [Canva Developers](https://www.canva.com/developers/)
   - Create or select an app
   - Copy **Client ID** and **Client Secret**

2. In n8n:
   - Add **Canva MCP Auth** node
   - Click **Create New Credential**
   - Paste your Client ID and Client Secret
   - Click **Connect my account**
   - Authorize in Canva

### 2. AI Design Generation

**Basic Workflow:**
```
Canva MCP Auth → AI Agent (MCP Tool) → PDF Generated
```

**Configure AI Agent:**
1. Add **AI Agent** node
2. In **Tools** section:
   - Select **MCP Tool**
   - **Connection Type**: Bearer Auth
   - **Authorization Value**: `{{$json.access_token}}`
   - **MCP Server URL**: `https://mcp.canva.com/sse`

3. Give it a prompt:
```
Generate a professional presentation about "Artificial Intelligence in Business"
with 10 slides. Use design_type: 'presentation'. Include:
- Title slide
- Problem overview
- Solution architecture
- Benefits analysis
- Implementation roadmap
- Case studies
- ROI metrics
- Risk mitigation
- Timeline
- Call to action

Export as PDF.
```

### 3. Available MCP Operations

- `generate-design` - AI-powered design creation
- `create-design-from-candidate` - Convert AI design to editable
- `export-design` - Export to PDF/PNG/JPG
- `search-designs` - Find your designs
- `get-design` - Get design details
- `list-brand-kits` - Access your brand assets

## 🛠️ Requirements

- **n8n**: v1.54.4 or higher
- **Node.js**: v18.10.0 or higher
- **Canva Account**: Free or Pro

## 🔒 Permissions Required

When authorizing, the node requests these Canva permissions:

- `design:content:read` - Read design content
- `design:content:write` - Create and modify designs
- `design:meta:read` - Read design metadata
- `asset:read` - Access your assets
- `asset:write` - Upload assets
- `folder:read` - Browse folders
- `folder:write` - Organize designs
- `profile:read` - Read your profile

## 💡 Use Cases

- Generate professional presentations automatically
- Create marketing materials with AI
- Export designs as high-quality PDFs
- Automate content creation workflows
- Integrate Canva into your automation pipelines

## 🐛 Troubleshooting

### OAuth Callback Error

**Problem**: "ERR_EMPTY_RESPONSE" during authentication

**Solution**: Ensure your n8n instance is accessible at the redirect URI configured in Canva (typically `http://localhost:5678` for local development).

### AI Agent Connection Issues

**Problem**: "Invalid arguments for tool generate-design"

**Solution**: Make sure you're passing the `query` parameter with detailed design requirements. Be specific about design_type and content.

### MCP Tool Not Listed

**Problem**: Custom credentials don't appear in MCP Tool selection

**Solution**: Use standard **Bearer Auth** with the `access_token` from Canva MCP Auth node output.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Support Development

If this project has helped you save time or improve your workflows, consider supporting its development:

**Solana Wallet**: `91Nk1HwpfQk5qno1LSB5GKw9hJ9yBXkpWqkTtmGMrphe`

Your support helps maintain and improve this project. Thank you! 🙏

## 🔗 Links

- [npm Package](https://www.npmjs.com/package/n8n-nodes-canva-improved)
- [GitHub Repository](https://github.com/0xAF00/n8n-nodes-canva-improved)
- [n8n Documentation](https://docs.n8n.io)
- [Canva Developers](https://www.canva.com/developers/)
- [Model Context Protocol](https://modelcontextprotocol.io)

## ⭐ Support

If you find this node useful, please:
- ⭐ Star the [GitHub repository](https://github.com/0xAF00/n8n-nodes-canva-improved)
- 🐛 [Report issues](https://github.com/0xAF00/n8n-nodes-canva-improved/issues)
- 💡 [Request features](https://github.com/0xAF00/n8n-nodes-canva-improved/issues)

---

**Made with ❤️ for the n8n community**
