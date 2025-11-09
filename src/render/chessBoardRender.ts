export const viewBoardArtifact = (fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', side = 'w') => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chess Board FEN Renderer</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        }
        .controls {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
            flex-wrap: wrap;
        }
        .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 5px;
            background: #667eea;
            color: white;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s;
        }
        .btn:hover {
            background: #5568d3;
        }
        .color-scheme {
            padding: 8px 12px;
            border: 2px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
            cursor: pointer;
        }
        .board {
            display: grid;
            grid-template-columns: repeat(8, 60px);
            grid-template-rows: repeat(8, 60px);
            border: 3px solid #333;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        .square {
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            cursor: default;
        }
        /* Color schemes */
        .classic-light { background-color: #f0d9b5; }
        .classic-dark { background-color: #b58863; }
        
        .blue-light { background-color: #e8edf9; }
        .blue-dark { background-color: #7389ae; }
        
        .green-light { background-color: #ffffdd; }
        .green-dark { background-color: #86a666; }
        
        .brown-light { background-color: #f0d9b5; }
        .brown-dark { background-color: #946f51; }
        
        .gray-light { background-color: #e0e0e0; }
        .gray-dark { background-color: #808080; }
        
        .info {
            margin-top: 20px;
            text-align: center;
            color: #333;
        }
        .fen-input {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            border: 2px solid #ddd;
            border-radius: 5px;
            font-family: monospace;
            font-size: 14px;
        }
        h2 {
            text-align: center;
            color: #333;
            margin-top: 0;
        }
        .coords {
            display: flex;
            justify-content: space-around;
            margin-top: 5px;
            font-weight: bold;
            color: #333;
        }
        .rank-coords {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            margin-right: 5px;
            font-weight: bold;
            color: #333;
        }
        .board-wrapper {
            display: flex;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>♔ Chess Position Viewer ♚</h2>
        <input type="text" class="fen-input" id="fenInput" placeholder="Enter FEN notation (e.g., rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1)">
        
        <div class="controls">
            <button class="btn" id="flipBtn">🔄 Flip Board</button>
            <select class="color-scheme" id="colorScheme">
                <option value="classic">Classic</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="brown">Brown</option>
                <option value="gray">Gray</option>
            </select>
        </div>
        
        <div class="board-wrapper">
            <div class="rank-coords" id="rankCoords"></div>
            <div>
                <div class="board" id="chessboard"></div>
                <div class="coords" id="fileCoords"></div>
            </div>
        </div>
        <div class="info" id="info"></div>
    </div>

    <script>
        const pieceSymbols = {
            'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
            'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
        };

        let currentFen = '${fen}';
        let flipped = ${side === 'b' ? 'true' : 'false'};
        let colorScheme = 'classic';

        function updateCoordinates() {
            const rankCoords = document.getElementById('rankCoords');
            const fileCoords = document.getElementById('fileCoords');
            
            const ranks = flipped ? ['1','2','3','4','5','6','7','8'] : ['8','7','6','5','4','3','2','1'];
            const files = flipped ? ['h','g','f','e','d','c','b','a'] : ['a','b','c','d','e','f','g','h'];
            
            rankCoords.innerHTML = ranks.map(r => \`<div>\${r}</div>\`).join('');
            fileCoords.innerHTML = files.map(f => \`<div>\${f}</div>\`).join('');
        }

        function renderBoard(fen) {
            const board = document.getElementById('chessboard');
            const info = document.getElementById('info');
            board.innerHTML = '';
            
            if (!fen || fen.trim() === '') {
                fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
            }

            const parts = fen.split(' ');
            const position = parts[0];
            const turn = parts[1] || 'w';
            const castling = parts[2] || '-';
            const enPassant = parts[3] || '-';
            const halfmove = parts[4] || '0';
            const fullmove = parts[5] || '1';

            const ranks = position.split('/');
            
            const displayRanks = flipped ? [...ranks].reverse() : ranks;
            
            for (let rank = 0; rank < 8; rank++) {
                let file = 0;
                const rankStr = displayRanks[rank];
                const rankChars = flipped ? rankStr.split('').reverse().join('') : rankStr;
                
                for (let char of rankChars) {
                    if (char >= '1' && char <= '8') {
                        const emptySquares = parseInt(char);
                        for (let i = 0; i < emptySquares; i++) {
                            createSquare(rank, file, '');
                            file++;
                        }
                    } else {
                        createSquare(rank, file, pieceSymbols[char] || '');
                        file++;
                    }
                }
            }

            const turnText = turn === 'w' ? 'White' : 'Black';
            info.innerHTML = \`<strong>Turn:</strong> \${turnText} | <strong>Castling:</strong> \${castling} | <strong>En Passant:</strong> \${enPassant}<br><strong>Halfmove:</strong> \${halfmove} | <strong>Fullmove:</strong> \${fullmove}\`;
        }

        function createSquare(rank, file, piece) {
            const square = document.createElement('div');
            const isLight = (rank + file) % 2 === 0;
            const lightClass = \`\${colorScheme}-light\`;
            const darkClass = \`\${colorScheme}-dark\`;
            square.className = 'square ' + (isLight ? lightClass : darkClass);
            square.textContent = piece;
            document.getElementById('chessboard').appendChild(square);
        }

        // Event listeners
        const fenInput = document.getElementById('fenInput');
        fenInput.addEventListener('input', (e) => {
            currentFen = e.target.value;
            renderBoard(currentFen);
        });

        document.getElementById('flipBtn').addEventListener('click', () => {
            flipped = !flipped;
            updateCoordinates();
            renderBoard(currentFen);
        });

        document.getElementById('colorScheme').addEventListener('change', (e) => {
            colorScheme = e.target.value;
            renderBoard(currentFen);
        });

        // Initial render
        fenInput.value = currentFen;
        updateCoordinates();
        renderBoard(currentFen);
    </script>
</body>
</html>
`;
