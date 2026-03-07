import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { cbmGameIdSchema, cbmRepIdSchema, fenSchema } from "../runner/schema.js";
import { toolAdapter, toolContentAdapter, httpToolAdapter } from "@jalpp/mcp-adapter";

const BASE_URL = "https://api.chessboardmagic.com";

const auth = {
  type: "bearer" as const,
  token: process.env.CHESSBOARD_MAGIC_PAT ?? "",
};

export function registerCBM(mcpserver: McpServer) {

  // No-input tools — use httpToolAdapter directly
  httpToolAdapter(mcpserver, {
    name: "get-chessboardmagic-repertoires",
    description: "Fetch user's chess repertoires from the Chessboard Magic Repertoire Builder",
    endpoint: `${BASE_URL}/mcp/repertoires`,
    method: "GET",
    auth,
  });

  httpToolAdapter(mcpserver, {
    name: "get-chessboardmagic-games",
    description: "Fetch user's chess games from the Chessboard Magic Repertoire Builder",
    endpoint: `${BASE_URL}/mcp/games`,
    method: "GET",
    auth,
  });

  
  httpToolAdapter(mcpserver, {
    name: "get-chessboardmagic-tcec-stats",
    description: "Fetch TCEC (Top Chess Engine Championship) statistics for a specific chess position",
    endpoint: `${BASE_URL}/mcp/tcec/stats`,
    method: "GET",
    inputSchema: { fen: fenSchema },
    auth,
  });

  httpToolAdapter(mcpserver, {
    name: "get-chessboardmagic-tcec-games",
    description: "Fetch TCEC games that reached a specific chess position",
    endpoint: `${BASE_URL}/mcp/tcec/games`,
    method: "GET",
    inputSchema: { fen: fenSchema },
    auth,
  });

  httpToolAdapter(mcpserver, {
    name: "get-chessboardmagic-corr-stats",
    description: "Fetch correspondence chess statistics for a specific chess position",
    endpoint: `${BASE_URL}/mcp/corr/stats`,
    method: "GET",
    inputSchema: { fen: fenSchema },
    auth,
  });

  httpToolAdapter(mcpserver, {
    name: "get-chessboardmagic-corr-games",
    description: "Fetch correspondence chess games that reached a specific chess position",
    endpoint: `${BASE_URL}/mcp/corr/games`,
    method: "GET",
    inputSchema: { fen: fenSchema },
    auth,
  });

  // Path param tools — dynamic URL, use toolAdapter
  toolAdapter(mcpserver, {
    name: "get-chessboardmagic-game-details",
    config: {
      description: "Fetch user's single game's metadata, moves, tags, variations and comment links",
      inputSchema: { gameId: cbmGameIdSchema },
      annotations: { openWorldHint: true },
    },
    cb: async ({ gameId }) => {
      try {
        const response = await fetch(`${BASE_URL}/mcp/games/${gameId}`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        const data = await response.json().catch(() => ({}));
        if (response.status !== 200) return toolContentAdapter({}, `API error: ${JSON.stringify(data)}`);
        return toolContentAdapter(data, undefined);
      } catch (error) {
        return toolContentAdapter({}, `Request failed: ${error}`);
      }
    },
  });

  toolAdapter(mcpserver, {
    name: "get-chessboardmagic-repertoire-details",
    config: {
      description: "Fetch user's single repertoire metadata, moves, variations and comment links",
      inputSchema: { repertoireId: cbmRepIdSchema },
      annotations: { openWorldHint: true },
    },
    cb: async ({ repertoireId }) => {
      try {
        const response = await fetch(`${BASE_URL}/mcp/repertoires/${repertoireId}`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        const data = await response.json().catch(() => ({}));
        if (response.status !== 200) return toolContentAdapter({}, `API error: ${JSON.stringify(data)}`);
        return toolContentAdapter(data, undefined);
      } catch (error) {
        return toolContentAdapter({}, `Request failed: ${error}`);
      }
    },
  });
}