# ChessAgine MCP

<p align="center">
  <img src="/icon.png" alt="ChessAgine" width="200"/>
</p>

**ChessAgine MCP** is a Model Context Protocol server that gives LLMs deep chess awareness by exposing real-time board state, Stockfish analysis, opening databases, Lichess games, and neural engines including Maia2, Leela, and Elite Leela.

It also renders individual positions and full PGN games for in-depth visual analysis—enabling AI agents to reason about positions, evaluate variations, detect themes, explore game databases, and interact directly with chess engines.

## Preview

<p align="center">
  <img src="/preview.png" alt="ChessAgine Preview" />
</p>

## Installation for Codex

#### Prerequisites
- Node.js 22+ 
- npm or yarn package manager

#### Clone and Setup
```bash
git clone https://github.com/SCZCS/chessagine-mcp.git
cd chessagine-mcp
npm install
npm run build
```

#### Configure Codex

Add this MCP server to `~/.codex/config.toml`, replacing the path with your checkout path:

**macOS/Linux:**
```toml
[mcp_servers.chessagine-mcp]
command = "node"
args = ["/absolute/path/to/chessagine-mcp/build/runner/stdio.js"]
startup_timeout_sec = 120

[mcp_servers.chessagine-mcp.env]
LICHESS_API_TOKEN = ""
LICHESS_USERNAME = ""
CHESSBOARD_MAGIC_PAT = ""
POSIRA_API_KEY = ""
```

**Windows:**
```toml
[mcp_servers.chessagine-mcp]
command = "node"
args = ["C:\\absolute\\path\\to\\chessagine-mcp\\build\\runner\\stdio.js"]
startup_timeout_sec = 120

[mcp_servers.chessagine-mcp.env]
LICHESS_API_TOKEN = ""
LICHESS_USERNAME = ""
CHESSBOARD_MAGIC_PAT = ""
POSIRA_API_KEY = ""
```

The environment variables are optional. Set them only when you want the related private integrations:

- `LICHESS_API_TOKEN`: Lichess API token for private account/study access
- `LICHESS_USERNAME`: default Lichess username for account-aware tools
- `CHESSBOARD_MAGIC_PAT`: Chessboard Magic personal access token
- `POSIRA_API_KEY`: Posira opening explorer API key

Restart Codex after editing `~/.codex/config.toml`. To smoke test the connection, ask Codex to render a chessboard or analyze a simple FEN.

### Usage:

- show me my last Lichess game I played, I'm insert_your_username there, also analyze the game using Stockfish
- given fen compare and constrast what stockfish thinks vs Leela and Maia
- analyze my opening rep from Chessboard magic.

### ChessAgine.Skill

to properly use ChessAgine MCP, give LLM access to how to properly use the it via .skill file [here](https://github.com/jalpp/chessagine.skill)

### Deploy your own instance

You can deploy your own copy to Vercel in a few clicks:

1. Fork this repo
2. Go to [vercel.com/new](https://vercel.com/new) and import your fork
3. No environment variables needed — just deploy
4. Your server will be at `https://your-project.vercel.app/mcp`

### Dev commands

```bash
npm run build:mcp  # Builds the stdio MCP server used by Codex
npm run build:ui   # Builds the ChessAgine MCP UI html files
npm run build      # Builds entire project, use for local development
npm run build:mcpb # Optionally builds a Claude Desktop MCPB package
npm run start      # starts the MCP server
npm run debug      # opens MCP inspector to inspect new changes made
```

## License

This project is licensed under the MIT License, the /themes and /protocol are under GPL. See the [LICENSE](LICENSE) file for details.

## Authors
@jalpp
