(function(){

    const boardEl = document.getElementById('board');
    const leadPara = document.querySelector('.lead');
    const statusEl = document.getElementById('status');
    const statusPara = document.getElementById('stat-p');
    const resetBtn = document.getElementById('reset');
    const newMatchBtn = document.getElementById('newMatch');
    const scoreElX = document.getElementById('score x');
    const scoreElO = document.getElementById('score o');
    const scoreElDraw = document.getElementById('score draw');

    let board = Array(9).fill(null); // 'X' | 'O' | null
    let current = 'X';
    let running = true;
    let scores = { X:0, O:0, D:0 };

    const winLines = [
        [0,1,2], [3,4,5], [6,7,8], // rows
        [0,3,6], [1,4,7], [2,5,8], // cols
        [0,4,8], [2,4,6] // diags
    ];

    function createBoard(){
        boardEl.innerHTML = '';
        for(let i = 0; i < 9; i++){
            const cell = document.createElement('button');
            cell.className = 'cell';
            cell.setAttribute('data-index', i);
            cell.setAttribute('aria-label', 'cell ' + (i + 1));
            cell.setAttribute('role','gridcell');
            cell.addEventListener('click', onCellClick);
            cell.addEventListener('keydown', e=>{
                if(e.key === 'Enter' || e.key === ' '){ 
                    e.preventDefault(); 
                    cell.click(); 
                }
            });
            boardEl.appendChild(cell);
        }
    }

    function onCellClick(e){
        const idx = Number(e.currentTarget.dataset.index);
        if(!running || board[idx]) return;
        board[idx] = current;
        renderCell(idx);
        leadPara.style.opacity = '0';

        const win = checkWin();
        if(win){
            running = false;
            scores[win.winner]++;
            statusPara.textContent = (win.winner === 'draw') ? 'Draw!' : `Player ${win.winner} wins!`;
            highlightWin();
            updateScoreDisplay();
            return;
        }

        if(isDraw()){
            running = false;
            scores.D++;
            statusPara.textContent = 'Draw!';
            highlightWin();
            updateScoreDisplay();
            return;
        }

        current = current === 'X' ? 'O' : 'X';
        updateStatus();
    }

    function renderCell(i){
        const cell = boardEl.querySelector(`[data-index='${i}']`);
        cell.textContent = board[i];
        cell.classList.add(board[i] === 'X' ? 'x' : 'o');
        cell.classList.add('disabled');
        cell.disabled = true;
    }

    function updateStatus(){
        statusPara.textContent = `Player ${current}'s turn`;
    }

    function checkWin(){
        for(const line of winLines){
            const [a,b,c] = line;
            if(board[a] && board[a] === board[b] && board[a] === board[c]){
                return { winner: board[a], line };
            }
        }
        return null;
    }

    function isDraw(){
        return board.every(Boolean) && !winLines.some(l=>{
            const [a,b,c]=l; 
            return board[a] && board[a]===board[b] && board[a]===board[c];
        });
    }

    function highlightWin(){
        requestAnimationFrame(() => {
            const c = statusPara;
            const el = statusEl;
            if(c.textContent === `Draw!`){
                el.classList.add('draw-style');
            }
            if(c.textContent !== `Player X's turn` && c.textContent !== `Player O's turn`) {
                c.classList.add('win-flash');
                if(c.textContent === `Player X wins!`){
                    c.style.textShadow = '0 0 0.15em hsla(280, 100%, 80%, 1), 0 0 0.45em var(--purpleX)';
                    c.style.color = 'var(--purpleX)';
                }else if(c.textContent === `Player O wins!`){
                    c.style.textShadow = '0 0 0.15em hsla(199, 95%, 74%, 1), 0 0 0.45em var(--blueO)';
                    c.style.color = 'var(--blueO)';
                }else if(c.textContent === `Draw!`){
                    c.style.textShadow = '0 0 0.15em hsla(0, 0%, 100%, 1.00), 0 0 0.45em white';
                    c.style.color = 'white';
                }
            }
        });
    }

    function updateScoreDisplay(){
        scoreElX.textContent = `X: ${scores.X}`;
        scoreElO.textContent = `O: ${scores.O}`;
        scoreElDraw.textContent = `Draws: ${scores.D}`;
    }

    function resetBoard(clearScores = false){
        board = Array(9).fill(null);
        current = 'X';
        running = true;
        updateStatus();
        const cells = boardEl.querySelectorAll('.cell');
        cells.forEach(c => {
            c.textContent = '';
            c.classList.remove('x','o','disabled');
            statusPara.style.textShadow = 'none';
            statusPara.style.color = 'var(--muted)';
            statusPara.classList.remove('win-flash');
            statusEl.classList.remove('draw-style');
            c.disabled = false;
        });
        if(clearScores){ 
            scores = {X:0, O:0, D:0}; 
            updateScoreDisplay(); 
        }
        leadPara.style.opacity = '1';
    }

    createBoard();
    updateStatus();
    updateScoreDisplay();

    resetBtn.addEventListener('click', () => resetBoard(false));
    newMatchBtn.addEventListener('click', () => resetBoard(true));

})();