import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { fenSchema, gamePgnSchema, sideSchema } from "../runner/schema.js";
import { ThemeAnalysisService } from "../services/themeanalysis.js";
import { toolAdapter, toolContentAdapter } from "@jalpp/mcp-adapter";


export function registerThemeAnalysisTools(server: McpServer): void {
  const themeService = new ThemeAnalysisService();

  toolAdapter(server, {
    name: "get-theme-scores",
    config: {
      description: "Get chess theme eval scores (material, mobility, space, positional, king safety, tactics, dark/light sqaure control) for a given position fen and the side to eval from. Positive eval means white is better, negative means black is better, Zero is equal",
      inputSchema: { fen: fenSchema, color: sideSchema },
      annotations: { openWorldHint: false },
    },
    cb: async ({ fen, color }) => {
      const { data, error } = themeService.getThemeScores(fen, color);
      return toolContentAdapter(data ?? {}, error);
    },
  });

  toolAdapter(server, {
    name: "get-tactical-position-summary",
    config: {
      description: "Get tactical position summary like hanging pieces, semi protected pieces, forks, pins for the given fen",
      inputSchema: { fen: fenSchema },
      annotations: { openWorldHint: false },
    },
    cb: async ({ fen }) => {
      const { data, error } = themeService.getTacticalPositionSummary(fen);
      return toolContentAdapter(data ?? {}, error);
    },
  });

  toolAdapter(server, {
    name: "analyze-variation-themes",
    config: {
      description: "Analyze how chess themes change across a sequence of moves",
      inputSchema: {
        rootFen: fenSchema,
        moves: z.array(z.string()).describe("Array of moves in algebraic notation"),
        color: sideSchema,
      },
      annotations: { openWorldHint: false },
    },
    cb: async ({ rootFen, moves, color }) => {
      const { data, error } = themeService.analyzeVariationThemes(rootFen, moves, color);
      return toolContentAdapter(data ?? {}, error);
    },
  });

  toolAdapter(server, {
    name: "get-theme-progression",
    config: {
      description: "Get the progression of a specific chess theme over a variation",
      inputSchema: {
        rootFen: fenSchema,
        moves: z.array(z.string()).describe("Array of moves in algebraic notation"),
        color: sideSchema,
        theme: z.enum([
          "material",
          "mobility",
          "space",
          "positional",
          "kingSafety",
          "tactical",
          "lightsqaureControl",
          "darksqaureControl",
        ]).describe("Theme to track"),
      },
      annotations: { openWorldHint: false },
    },
    cb: async ({ rootFen, moves, color, theme }) => {
      const { data, error } = themeService.getThemeProgression(rootFen, moves, color, theme);
      return toolContentAdapter(data ?? {}, error);
    },
  });

  toolAdapter(server, {
    name: "compare-variations",
    config: {
      description: "Compare multiple chess variations and return their theme analyses",
      inputSchema: {
        rootFen: fenSchema,
        variations: z.array(
          z.object({
            name: z.string(),
            moves: z.array(z.string()),
          })
        ).describe("Array of variations to compare"),
        color: sideSchema,
      },
      annotations: { openWorldHint: false },
    },
    cb: async ({ rootFen, variations, color }) => {
      const { data, error } = themeService.compareVariations(rootFen, variations, color);
      return toolContentAdapter(data ?? {}, error);
    },
  });

  toolAdapter(server, {
    name: "find-critical-moments",
    config: {
      description: "Find moves in a chess variation where there are significant theme changes",
      inputSchema: {
        rootFen: fenSchema,
        moves: z.array(z.string()).describe("Array of moves in algebraic notation"),
        color: sideSchema,
        threshold: z.number().optional().default(0.5).describe("Threshold for significant changes"),
      },
      annotations: { openWorldHint: false },
    },
    cb: async ({ rootFen, moves, color, threshold = 0.5 }) => {
      const { data, error } = themeService.findCriticalMoments(rootFen, moves, color, threshold);
      return toolContentAdapter(data ?? {}, error);
    },
  });

  toolAdapter(server, {
    name: "generate-game-review",
    config: {
      description: "Generate a comprehensive game review with theme progression analysis from a PGN. Analyzes material, mobility, space, positional play, and king safety for both players throughout the game.",
      inputSchema: {
        pgn: gamePgnSchema,
        criticalMomentThreshold: z.number().min(0.1).max(2.0).default(0.5).optional().describe("Threshold for identifying critical moments (default: 0.5). Lower values find more moments."),
        format: z.enum(["json", "text"]).default("text").optional().describe("Output format: 'json' for structured data or 'text' for human-readable report"),
      },
      annotations: { openWorldHint: false },
    },
    cb: async ({ pgn, criticalMomentThreshold = 0.5, format = "text" }) => {
      const { data, error } = themeService.generateGameReview(pgn, criticalMomentThreshold, format);
      return toolContentAdapter(
        typeof data === "string" ? { review: data } : (data ?? {}),
        error,
      );
    },
  });
}