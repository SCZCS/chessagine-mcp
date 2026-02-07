export interface UtilsResult {
  data?: any;
  error?: string;
}

export interface PromptCategory {
  id: string;
  name: string;
  promptCount: number;
}

export interface PuzzleTheme {
  tag: string;
  description: string;
}

export interface ThemeResult {
  data?: any;
  error?: string;
}

export type ThemeType = 
  | "material"
  | "mobility" 
  | "space"
  | "positional"
  | "kingSafety"
  | "tactical"
  | "lightsqaureControl"
  | "darksqaureControl";

export interface Variation {
  name: string;
  moves: string[];
}


export interface EvaluationRequest {
    fen: string;
    depth: number;
    multiPv?: number;
}

export interface BatchEvalRequest {
    fen: string;
}

export interface EvaluationResult {
    bestmove: string;
    lines: string[];
}

export interface EcoEntry {
  name: string;
  moves: string;
}

export interface RenderResult {
  data?: {
    html: string;
    message: string;
  };
  error?: string;
}

export interface NeuralNetResult {
  data?: any;
  error?: string;
}

export type EngineType = "maia2" | "leela" | "elite-leela";

export interface LegalMoveResult {
  data?: {
    isLegal: boolean;
    message: string;
  };
  error?: string;
}

export interface BoardStateResult {
  data?: {
    state: any;
    description: string;
  };
  error?: string;
}