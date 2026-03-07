import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fenSchema } from "../runner/schema.js";
import { ChessDBService } from "../services/chessdb.js";
import {toolAdapter, toolContentAdapter} from "@jalpp/mcp-adapter";

export function registerChessDBTools(server: McpServer): void {
  const chessDBService = new ChessDBService();

  toolAdapter(server, {
    name: "get-chessdb-analysis",
    config: {
      description: "Fetch position analysis and candidate moves from ChessDB",
      inputSchema: { fen: fenSchema },
      annotations: { openWorldHint: true },
    },
    cb: async ({ fen }) => {
      const { data, error } = await chessDBService.getAnalysis(fen);
      return toolContentAdapter(data ?? {}, error);
    },
  });

  toolAdapter(server, {
    name: "get-chessdb-pv",
    config: {
      description: "Fetch the principal variation (best line) for a position from ChessDB",
      inputSchema: { fen: fenSchema },
      annotations: { openWorldHint: true },
    },
    cb: async ({ fen }) => {
      const { data, error } = await chessDBService.getPv(fen);
      return toolContentAdapter(data ?? {}, error);
    },
  });

  toolAdapter(server, {
    name: "queue-chessdb-analysis",
    config: {
      description: "Queue a chess position for background analysis on ChessDB",
      inputSchema: { fen: fenSchema },
      annotations: { openWorldHint: true },
    },
    cb: async ({ fen }) => {
      const { success, error } = await chessDBService.queueAnalysis(fen);
      return toolContentAdapter(
        { success: success ?? false },
        error ?? (!success ? "Failed to queue position." : undefined),
      );
    },
  });
}