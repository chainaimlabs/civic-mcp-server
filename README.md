# civic-mcp-server
civic-mcp-server

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/chainaimlabs/xdc-goat-mcp-server.git
   cd xdc-goat-mcp-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Run the server**
   ```bash
   npm start
   ```

### MCP Client Configuration

#### Claude Desktop

Add the following to your Claude Desktop configuration file (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "xdc-goat-mcp": {
      "command": "node",
      "args": ["/path/to/xdc-goat-mcp-server/dist/index.js"],
      "env": {
        "CHAIN_ID": "51",
        "RPC_URL": "https://rpc.xdcrpc.com"
      }
    }
  }
}
```

