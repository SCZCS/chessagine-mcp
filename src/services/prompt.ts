import {
  agineSystemPrompt,
  agineDesigner,
  chessAgineAnnoPrompt,
  agineSelfEval,
} from "../prompts/prompt.js";

export interface PromptMessage {
  role: "user" | "assistant";
  content: {
    type: "text";
    text: string;
  };
}

export class ChessPromptService {
  
  // Core System Prompts
  getChessAgineMode(): PromptMessage[] {
    return [
      {
        role: "user",
        content: {
          type: "text",
          text: agineSystemPrompt,
        },
      },
    ];
  }

  getSelfEvalFramework(): PromptMessage[] {
    return [
      {
        role: "user",
        content: {
          type: "text",
          text: agineSelfEval,
        },
      },
    ];
  }

  getChessDBCommentatorMode(): PromptMessage[] {
    return [
      {
        role: "user",
        content: {
          type: "text",
          text: agineSelfEval,
        },
      },
    ];
  }

  getQuestionAnswerMode(): PromptMessage[] {
    return [
      {
        role: "assistant",
        content: {
          type: "text",
          text: agineSystemPrompt,
        },
      },
    ];
  }

  getAnnotationExpert(): PromptMessage[] {
    return [
      {
        role: "user",
        content: {
          type: "text",
          text: chessAgineAnnoPrompt,
        },
      },
    ];
  }

  getDashboardDesigner(): PromptMessage[] {
    return [
      {
        role: "user",
        content: {
          type: "text",
          text: agineDesigner,
        },
      },
    ];
  }

  // Position Analysis Prompts
  getAnalyzePosition(fen: string, side: string = "white"): PromptMessage[] {
    return [
      {
        role: "user",
        content: {
          type: "text",
          text: `You are a chess master analyzing this position from ${side}'s perspective.

FEN: ${fen}

Please provide a comprehensive analysis covering:

1. **Material Count**: Compare material for both sides
2. **King Safety**: Evaluate king positions and potential threats
3. **Piece Activity**: Assess how well pieces are placed
4. **Pawn Structure**: Analyze pawn chains, weaknesses, and strengths
5. **Control of Key Squares**: Important central and strategic squares
6. **Tactical Opportunities**: Look for pins, forks, skewers, discovered attacks
7. **Strategic Plans**: Suggest concrete plans for both sides

Use chess notation and be specific about piece placements and tactical motifs. Conclude with an evaluation (advantage to white/black/equal) and recommend the best continuation.`,
        },
      },
    ];
  }

  getFindTactics(fen: string, side: string = "white"): PromptMessage[] {
    return [
      {
        role: "user",
        content: {
          type: "text",
          text: `Find all tactical opportunities for ${side} in this position.

FEN: ${fen}

Look for:
- Pins (absolute and relative)
- Forks (knight forks, queen forks, etc.)
- Skewers
- Discovered attacks
- Deflection and decoy tactics
- Removal of defender
- Zwischenzug (in-between moves)
- Back rank weaknesses
- Mating patterns

For each tactic found, explain:
1. The tactical motif
2. The key moves
3. Why it works
4. The resulting advantage`,
        },
      },
    ];
  }

  getOpeningAnalysis(fen: string): PromptMessage[] {
    return [
      {
        role: "user",
        content: {
          type: "text",
          text: `Analyze this opening position:

FEN: ${fen}

Please provide:
1. **Opening Identification**: Name the opening/variation if recognizable
2. **Key Ideas**: Main plans and themes for both sides
3. **Typical Pawn Structures**: Expected pawn formations
4. **Piece Placement**: Ideal squares for pieces
5. **Critical Moves**: Important moves to know in this line
6. **Common Mistakes**: Pitfalls to avoid
7. **Recommended Continuations**: Suggest next moves with explanations

Use opening theory and explain strategic concepts clearly.`,
        },
      },
    ];
  }

  getEndgameAnalysis(fen: string): PromptMessage[] {
    return [
      {
        role: "user",
        content: {
          type: "text",
          text: `Analyze this endgame position:

FEN: ${fen}

Please cover:
1. **Endgame Type**: Identify the type (K+P vs K, R+P vs R, etc.)
2. **Evaluation**: Is this won, drawn, or unclear?
3. **Key Concepts**: Relevant endgame principles (opposition, triangulation, etc.)
4. **Critical Squares**: Important squares to control
5. **Winning Technique**: If winning, show the plan step-by-step
6. **Drawing Technique**: If defending, explain how to hold
7. **Common Patterns**: Reference similar theoretical positions

Be precise with move sequences and explain the underlying theory.`,
        },
      },
    ];
  }

  // Game Analysis Prompts
  getAnnotateGame(pgn: string): PromptMessage[] {
    return [
      {
        role: "user",
        content: {
          type: "text",
          text: `Please annotate this chess game with detailed commentary:

${pgn}

Provide:
1. **Opening Analysis**: Identify the opening and evaluate the choices
2. **Critical Moments**: Highlight turning points in the game
3. **Tactical Analysis**: Point out tactical opportunities (missed or played)
4. **Strategic Themes**: Explain strategic plans and ideas
5. **Move Alternatives**: Suggest improvements at key moments
6. **Evaluation**: Assess positions throughout the game
7. **Conclusion**: Summarize the game and key lessons

Use standard chess notation and make annotations instructive.`,
        },
      },
    ];
  }

  getCompareGames(pgn1: string, pgn2: string): PromptMessage[] {
    return [
      {
        role: "user",
        content: {
          type: "text",
          text: `Compare these two chess games:

Game 1:
${pgn1}

Game 2:
${pgn2}

Analyze:
1. **Opening Similarities/Differences**: Compare opening choices
2. **Strategic Themes**: Common or contrasting plans
3. **Tactical Patterns**: Similar tactical motifs
4. **Critical Decisions**: Compare key moments
5. **Style Comparison**: Different approaches to similar positions
6. **Lessons**: What can be learned from comparing these games?`,
        },
      },
    ];
  }

  // Training Prompts
  getExplainMistake(fen: string, move: string, bestMove?: string): PromptMessage[] {
    return [
      {
        role: "user",
        content: {
          type: "text",
          text: `Explain why this move was a mistake:

Position (FEN): ${fen}
Move played: ${move}
${bestMove ? `Best move: ${bestMove}` : ''}

Please explain:
1. **What the move tried to accomplish**: The intent behind it
2. **Why it fails**: Concrete refutation or problems created
3. **Better alternatives**: What should have been played and why
4. **Key principle violated**: Which chess principles were ignored
5. **How to avoid similar mistakes**: General advice for improvement

Be educational and help understand the concept, not just memorize.`,
        },
      },
    ];
  }

  getCreateTrainingPlan(
    level: "beginner" | "intermediate" | "advanced",
    weakness?: string,
    timePerDay: string = "30"
  ): PromptMessage[] {
    return [
      {
        role: "user",
        content: {
          type: "text",
          text: `Create a chess training plan for:
- Level: ${level}
${weakness ? `- Weakness to address: ${weakness}` : ''}
- Available time: ${timePerDay} minutes per day

Include:
1. **Daily Routine**: Structured schedule
2. **Study Materials**: What to study and in what order
3. **Tactical Training**: Puzzle recommendations
4. **Game Analysis**: How to review games
5. **Opening Preparation**: Repertoire suggestions
6. **Endgame Practice**: Key positions to master
7. **Progress Tracking**: How to measure improvement
8. **Weekly Goals**: Specific achievable targets

Make it practical and actionable.`,
        },
      },
    ];
  }

  // Repertoire Building
  getBuildRepertoire(
    color: "white" | "black",
    style: "aggressive" | "positional" | "solid" | "tactical" = "positional",
    timeControl: "bullet" | "blitz" | "rapid" | "classical" = "rapid"
  ): PromptMessage[] {
    return [
      {
        role: "user",
        content: {
          type: "text",
          text: `Build an opening repertoire for ${color} with ${style} style for ${timeControl} games.

Please provide:
1. **Main Lines**: Core openings to play
2. **Against Each Response**: How to meet different opponent choices
3. **Key Ideas**: Strategic themes in each line
4. **Move Orders**: Critical move sequences
5. **Study Resources**: Books, videos, or courses
6. **Practice Plan**: How to learn and maintain the repertoire
7. **Backup Options**: Alternative lines for variety

Make recommendations practical and achievable, not too broad.`,
        },
      },
    ];
  }

  // Pattern Recognition
  getIdentifyPatterns(fen: string): PromptMessage[] {
    return [
      {
        role: "user",
        content: {
          type: "text",
          text: `Identify all chess patterns in this position:

FEN: ${fen}

Look for:
1. **Tactical Patterns**: Forks, pins, skewers, etc.
2. **Positional Patterns**: Weak squares, bad pieces, pawn structures
3. **Mating Patterns**: Back rank, smothered mate, etc.
4. **Endgame Patterns**: Lucena, Philidor, key squares
5. **Strategic Patterns**: Minority attack, piece sacrifice themes
6. **Pawn Structure Patterns**: Isolated pawns, hanging pawns, pawn chains

For each pattern found, explain its significance and how to exploit or defend against it.`,
        },
      },
    ];
  }
}