class GobangGame {
    constructor() {
        this.boardSize = 15;
        this.board = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(0));
        this.currentPlayer = 1;
        this.gameStatus = 'playing';
        this.history = [];
        this.skillUsed = false;
        this.gameMode = 'single'; // single or multi
        this.aiLevel = 'normal'; // normal, chitu, tuxue, delu
        this.aiPlayer = null;
        
        this.initGame();
        this.bindEvents();
    }
    
    initGame() {
        this.createBoard();
        this.resetBoard();
        this.updatePlayerStatus();
    }
    
    createBoard() {
        const boardElement = document.getElementById('game-board');
        boardElement.innerHTML = '';
        
        const grid = document.createElement('div');
        grid.className = 'board-grid';
        
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                const cell = document.createElement('div');
                cell.className = 'board-cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                grid.appendChild(cell);
            }
        }
        
        boardElement.appendChild(grid);
    }
    
    resetBoard() {
        this.board = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(0));
        this.currentPlayer = 1;
        this.gameStatus = 'playing';
        this.history = [];
        this.skillUsed = false;
        
        const cells = document.querySelectorAll('.board-cell');
        cells.forEach(cell => {
            cell.classList.remove('stone', 'player1', 'player2');
        });
        
        this.updatePlayerStatus();
    }
    
    bindEvents() {
        // 游戏模式按钮
        document.getElementById('single-player').addEventListener('click', () => {
            this.setGameMode('single');
        });
        
        document.getElementById('multi-player').addEventListener('click', () => {
            this.setGameMode('multi');
        });
        
        // 棋盘点击事件
        const boardElement = document.getElementById('game-board');
        boardElement.addEventListener('click', (e) => {
            const cell = e.target.closest('.board-cell');
            if (cell && this.gameStatus === 'playing') {
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                this.placeStone(row, col);
            }
        });
        
        // 重新开始按钮
        document.getElementById('restart').addEventListener('click', () => {
            this.resetBoard();
        });
        
        // 悔棋按钮
        document.getElementById('undo').addEventListener('click', () => {
            this.undoMove();
        });
        
        // 技能卡点击事件
        document.getElementById('skill1').addEventListener('click', () => {
            this.useSkill('马踏飞燕');
        });
        
        document.getElementById('skill2').addEventListener('click', () => {
            this.useSkill('画地为牢');
        });
        
        document.getElementById('skill3').addEventListener('click', () => {
            this.useSkill('福运加身');
        });
        
        // 模态框按钮
        document.getElementById('play-again').addEventListener('click', () => {
            this.hideModal();
            this.resetBoard();
        });
        
        document.getElementById('back-to-menu').addEventListener('click', () => {
            this.hideModal();
            this.resetBoard();
        });
    }
    
    setGameMode(mode) {
        this.gameMode = mode;
        
        // 更新按钮状态
        document.getElementById('single-player').classList.toggle('active', mode === 'single');
        document.getElementById('multi-player').classList.toggle('active', mode === 'multi');
        document.getElementById('watch-mode').classList.toggle('active', mode === 'watch');
        
        // 重置游戏
        this.resetBoard();
        
        if (mode === 'single') {
            // 随机选择AI级别
            const aiLevels = ['normal', 'chitu', 'tuxue', 'delu'];
            this.aiLevel = aiLevels[Math.floor(Math.random() * aiLevels.length)];
            this.aiPlayer = 2;
            alert(`单机模式已开启！AI性格：${this.getAICharacterName()}`);
        } else if (mode === 'multi') {
            this.aiPlayer = null;
            alert('联机模式已开启！请与好友一起游戏。');
            this.showMultiplayerUI();
        } else if (mode === 'watch') {
            this.aiPlayer = null;
            alert('观赛模式已开启！正在寻找高手对决...');
            this.showWatchUI();
        }
    }
    
    showMultiplayerUI() {
        // 显示联机模式UI
        const gameInfo = document.querySelector('.game-info');
        gameInfo.innerHTML = `
            <div class="multiplayer-ui">
                <h3>联机模式</h3>
                <div class="connection-status">
                    <span class="status-indicator"></span>
                    <span>正在寻找对手...</span>
                </div>
                <div class="multiplayer-options">
                    <button class="option-btn" id="create-room">创建房间</button>
                    <button class="option-btn" id="join-room">加入房间</button>
                    <button class="option-btn" id="local-match">本地对战</button>
                </div>
                <div class="room-code">
                    <label>房间码：</label>
                    <input type="text" id="room-input" placeholder="输入房间码">
                    <button class="join-btn">加入</button>
                </div>
            </div>
        `;
        
        // 绑定联机模式按钮事件
        document.getElementById('create-room').addEventListener('click', () => {
            this.createRoom();
        });
        
        document.getElementById('join-room').addEventListener('click', () => {
            this.joinRoom();
        });
        
        document.getElementById('local-match').addEventListener('click', () => {
            this.startLocalMatch();
        });
    }
    
    showWatchUI() {
        // 显示观赛模式UI
        const gameInfo = document.querySelector('.game-info');
        gameInfo.innerHTML = `
            <div class="watch-ui">
                <h3>观赛模式</h3>
                <div class="ongoing-matches">
                    <h4>正在进行的比赛</h4>
                    <div class="match-list">
                        <div class="match-item">
                            <div class="match-players">
                                <span class="player red">红马</span>
                                <span>vs</span>
                                <span class="player blue">蓝马</span>
                            </div>
                            <div class="match-status">进行中</div>
                            <button class="watch-btn">观看</button>
                        </div>
                        <div class="match-item">
                            <div class="match-players">
                                <span class="player red">赤兔马</span>
                                <span>vs</span>
                                <span class="player blue">的卢</span>
                            </div>
                            <div class="match-status">进行中</div>
                            <button class="watch-btn">观看</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // 绑定观赛按钮事件
        const watchBtns = document.querySelectorAll('.watch-btn');
        watchBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.startWatching();
            });
        });
    }
    
    createRoom() {
        // 生成随机房间码
        const roomCode = Math.floor(100000 + Math.random() * 900000);
        alert(`房间创建成功！房间码：${roomCode}`);
        // 实际游戏中需要连接服务器创建房间
    }
    
    joinRoom() {
        const roomCode = prompt('请输入房间码：');
        if (roomCode) {
            alert(`正在加入房间 ${roomCode}...`);
            // 实际游戏中需要连接服务器加入房间
        }
    }
    
    startLocalMatch() {
        alert('本地对战模式已开启！请与好友轮流落子。');
        this.resetBoard();
        // 恢复默认游戏信息UI
        this.showDefaultGameInfo();
    }
    
    startWatching() {
        alert('开始观赛！');
        // 实际游戏中需要连接服务器获取比赛数据
    }
    
    showDefaultGameInfo() {
        // 恢复默认游戏信息UI
        const gameInfo = document.querySelector('.game-info');
        gameInfo.innerHTML = `
            <div class="player-info">
                <div class="player player1">
                    <div class="player-avatar red-horse"></div>
                    <div class="player-name">红马</div>
                    <div class="player-status active">当前回合</div>
                </div>
                <div class="player player2">
                    <div class="player-avatar blue-horse"></div>
                    <div class="player-name">蓝马</div>
                    <div class="player-status"></div>
                </div>
            </div>
            
            <div class="skill-cards">
                <h3>技能卡</h3>
                <div class="cards">
                    <div class="skill-card" id="skill1">
                        <div class="skill-icon">🐎</div>
                        <div class="skill-name">马踏飞燕</div>
                        <div class="skill-desc">移动对方任意一个棋子一步</div>
                    </div>
                    <div class="skill-card" id="skill2">
                        <div class="skill-icon">🔒</div>
                        <div class="skill-name">画地为牢</div>
                        <div class="skill-desc">封锁对方两个交叉点</div>
                    </div>
                    <div class="skill-card" id="skill3">
                        <div class="skill-icon">🍀</div>
                        <div class="skill-name">福运加身</div>
                        <div class="skill-desc">本局首次落子必成活三</div>
                    </div>
                </div>
            </div>
        `;
        
        // 重新绑定技能卡事件
        document.getElementById('skill1').addEventListener('click', () => {
            this.useSkill('马踏飞燕');
        });
        
        document.getElementById('skill2').addEventListener('click', () => {
            this.useSkill('画地为牢');
        });
        
        document.getElementById('skill3').addEventListener('click', () => {
            this.useSkill('福运加身');
        });
    }
    
    getAICharacterName() {
        switch (this.aiLevel) {
            case 'chitu': return '赤兔马（攻击性极强）';
            case 'tuxue': return '踏雪乌骓（防守严密）';
            case 'delu': return '的卢（擅长绝地反击）';
            default: return '普通马（平衡型）';
        }
    }
    
    placeStone(row, col) {
        if (this.board[row][col] !== 0) return;
        
        this.board[row][col] = this.currentPlayer;
        this.history.push({ row, col, player: this.currentPlayer });
        
        // 更新UI
        const cell = document.querySelector(`.board-cell[data-row="${row}"][data-col="${col}"]`);
        cell.classList.add('stone', `player${this.currentPlayer}`);
        
        // 播放落子音效
        this.playSound('drop');
        
        // 检查胜负
        if (this.checkWin(row, col)) {
            this.gameStatus = 'ended';
            this.showWinModal(this.currentPlayer);
            return;
        }
        
        // 切换玩家
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.updatePlayerStatus();
        
        // AI落子
        if (this.gameMode === 'single' && this.currentPlayer === this.aiPlayer) {
            setTimeout(() => {
                this.aiMove();
            }, 500);
        }
    }
    
    aiMove() {
        if (this.gameStatus !== 'playing') return;
        
        let bestMove;
        
        switch (this.aiLevel) {
            case 'chitu':
                bestMove = this.getChituMove();
                break;
            case 'tuxue':
                bestMove = this.getTuxueMove();
                break;
            case 'delu':
                bestMove = this.getDeluMove();
                break;
            default:
                bestMove = this.getNormalMove();
                break;
        }
        
        if (bestMove) {
            this.placeStone(bestMove.row, bestMove.col);
        }
    }
    
    getNormalMove() {
        // 简单的AI落子逻辑：优先攻击，其次防守
        const move = this.findWinningMove(2) || this.findWinningMove(1) || this.findCenterMove();
        return move || this.findRandomMove();
    }
    
    getChituMove() {
        // 赤兔马：攻击性极强，优先攻击
        const move = this.findWinningMove(2) || this.findWinningMove(1) || this.findOffensiveMove();
        return move || this.findRandomMove();
    }
    
    getTuxueMove() {
        // 踏雪乌骓：防守严密，优先防守
        const move = this.findWinningMove(1) || this.findWinningMove(2) || this.findDefensiveMove();
        return move || this.findRandomMove();
    }
    
    getDeluMove() {
        // 的卢：擅长绝地反击，综合策略
        const move = this.findWinningMove(2) || this.findWinningMove(1) || this.findBalancedMove();
        return move || this.findRandomMove();
    }
    
    findWinningMove(player) {
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (this.board[i][j] === 0) {
                    this.board[i][j] = player;
                    if (this.checkWin(i, j)) {
                        this.board[i][j] = 0;
                        return { row: i, col: j };
                    }
                    this.board[i][j] = 0;
                }
            }
        }
        return null;
    }
    
    findCenterMove() {
        const center = Math.floor(this.boardSize / 2);
        for (let i = center - 2; i <= center + 2; i++) {
            for (let j = center - 2; j <= center + 2; j++) {
                if (i >= 0 && i < this.boardSize && j >= 0 && j < this.boardSize && this.board[i][j] === 0) {
                    return { row: i, col: j };
                }
            }
        }
        return null;
    }
    
    findOffensiveMove() {
        // 寻找攻击性位置
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (this.board[i][j] === 0) {
                    // 检查周围是否有自己的棋子
                    let count = 0;
                    for (let di = -1; di <= 1; di++) {
                        for (let dj = -1; dj <= 1; dj++) {
                            if (di === 0 && dj === 0) continue;
                            const ni = i + di;
                            const nj = j + dj;
                            if (ni >= 0 && ni < this.boardSize && nj >= 0 && nj < this.boardSize && this.board[ni][nj] === 2) {
                                count++;
                            }
                        }
                    }
                    if (count > 0) {
                        return { row: i, col: j };
                    }
                }
            }
        }
        return this.findCenterMove();
    }
    
    findDefensiveMove() {
        // 寻找防守性位置
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (this.board[i][j] === 0) {
                    // 检查周围是否有对方的棋子
                    let count = 0;
                    for (let di = -1; di <= 1; di++) {
                        for (let dj = -1; dj <= 1; dj++) {
                            if (di === 0 && dj === 0) continue;
                            const ni = i + di;
                            const nj = j + dj;
                            if (ni >= 0 && ni < this.boardSize && nj >= 0 && nj < this.boardSize && this.board[ni][nj] === 1) {
                                count++;
                            }
                        }
                    }
                    if (count > 0) {
                        return { row: i, col: j };
                    }
                }
            }
        }
        return this.findCenterMove();
    }
    
    findBalancedMove() {
        // 寻找平衡位置
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (this.board[i][j] === 0) {
                    // 检查周围是否有棋子
                    let selfCount = 0;
                    let opponentCount = 0;
                    for (let di = -1; di <= 1; di++) {
                        for (let dj = -1; dj <= 1; dj++) {
                            if (di === 0 && dj === 0) continue;
                            const ni = i + di;
                            const nj = j + dj;
                            if (ni >= 0 && ni < this.boardSize && nj >= 0 && nj < this.boardSize) {
                                if (this.board[ni][nj] === 2) {
                                    selfCount++;
                                } else if (this.board[ni][nj] === 1) {
                                    opponentCount++;
                                }
                            }
                        }
                    }
                    if (selfCount > 0 || opponentCount > 0) {
                        return { row: i, col: j };
                    }
                }
            }
        }
        return this.findCenterMove();
    }
    
    findRandomMove() {
        // 随机落子
        const emptyCells = [];
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (this.board[i][j] === 0) {
                    emptyCells.push({ row: i, col: j });
                }
            }
        }
        if (emptyCells.length > 0) {
            return emptyCells[Math.floor(Math.random() * emptyCells.length)];
        }
        return null;
    }
    
    checkWin(row, col) {
        const directions = [
            [0, 1],   // 水平
            [1, 0],   // 垂直
            [1, 1],   // 对角线
            [1, -1]   // 反对角线
        ];
        
        for (const [dx, dy] of directions) {
            let count = 1;
            
            // 向一个方向检查
            for (let i = 1; i < 5; i++) {
                const newRow = row + i * dx;
                const newCol = col + i * dy;
                
                if (newRow < 0 || newRow >= this.boardSize || newCol < 0 || newCol >= this.boardSize) {
                    break;
                }
                
                if (this.board[newRow][newCol] === this.currentPlayer) {
                    count++;
                } else {
                    break;
                }
            }
            
            // 向相反方向检查
            for (let i = 1; i < 5; i++) {
                const newRow = row - i * dx;
                const newCol = col - i * dy;
                
                if (newRow < 0 || newRow >= this.boardSize || newCol < 0 || newCol >= this.boardSize) {
                    break;
                }
                
                if (this.board[newRow][newCol] === this.currentPlayer) {
                    count++;
                } else {
                    break;
                }
            }
            
            if (count >= 5) {
                this.showWinEffect(row, col, dx, dy);
                return true;
            }
        }
        
        return false;
    }
    
    showWinEffect(row, col, dx, dy) {
        // 显示胜利特效
        const winLine = [];
        for (let i = -4; i <= 4; i++) {
            const newRow = row + i * dx;
            const newCol = col + i * dy;
            
            if (newRow >= 0 && newRow < this.boardSize && newCol >= 0 && newCol < this.boardSize) {
                if (this.board[newRow][newCol] === this.currentPlayer) {
                    winLine.push({ row: newRow, col: newCol });
                }
            }
        }
        
        // 为获胜线添加特效
        winLine.forEach((pos, index) => {
            setTimeout(() => {
                const cell = document.querySelector(`.board-cell[data-row="${pos.row}"][data-col="${pos.col}"]`);
                cell.style.animation = 'winPulse 1s ease-in-out';
            }, index * 100);
        });
        
        // 播放胜利音效
        this.playSound('win');
    }
    
    undoMove() {
        if (this.history.length === 0) return;
        
        const lastMove = this.history.pop();
        this.board[lastMove.row][lastMove.col] = 0;
        
        // 更新UI
        const cell = document.querySelector(`.board-cell[data-row="${lastMove.row}"][data-col="${lastMove.col}"]`);
        cell.classList.remove('stone', `player${lastMove.player}`);
        
        // 切换回上一个玩家
        this.currentPlayer = lastMove.player;
        this.updatePlayerStatus();
    }
    
    useSkill(skillName) {
        if (this.skillUsed) {
            alert('技能已使用，每局只能使用一次技能！');
            return;
        }
        
        this.skillUsed = true;
        
        switch (skillName) {
            case '马踏飞燕':
                this.skillHorseStep();
                break;
            case '画地为牢':
                this.skillLock();
                break;
            case '福运加身':
                this.skillLuck();
                break;
        }
    }
    
    skillHorseStep() {
        // 简单实现：移动对方最近的一个棋子
        const opponent = this.currentPlayer === 1 ? 2 : 1;
        let targetCell = null;
        
        // 找到对方最近的棋子
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (this.board[i][j] === opponent) {
                    targetCell = { row: i, col: j };
                    break;
                }
            }
            if (targetCell) break;
        }
        
        if (targetCell) {
            // 随机移动到一个相邻位置
            const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
            const randomDir = directions[Math.floor(Math.random() * directions.length)];
            const newRow = targetCell.row + randomDir[0];
            const newCol = targetCell.col + randomDir[1];
            
            if (newRow >= 0 && newRow < this.boardSize && newCol >= 0 && newCol < this.boardSize && this.board[newRow][newCol] === 0) {
                // 移动棋子
                this.board[targetCell.row][targetCell.col] = 0;
                this.board[newRow][newCol] = opponent;
                
                // 更新UI
                const oldCell = document.querySelector(`.board-cell[data-row="${targetCell.row}"][data-col="${targetCell.col}"]`);
                oldCell.classList.remove('stone', `player${opponent}`);
                
                const newCell = document.querySelector(`.board-cell[data-row="${newRow}"][data-col="${newCol}"]`);
                newCell.classList.add('stone', `player${opponent}`);
                
                alert('马踏飞燕技能使用成功！');
            } else {
                alert('没有可移动的位置！');
                this.skillUsed = false;
            }
        } else {
            alert('没有对方棋子可移动！');
            this.skillUsed = false;
        }
    }
    
    skillLock() {
        // 简单实现：封锁两个随机位置
        const lockPositions = [];
        let count = 0;
        
        while (count < 2) {
            const row = Math.floor(Math.random() * this.boardSize);
            const col = Math.floor(Math.random() * this.boardSize);
            
            if (this.board[row][col] === 0) {
                lockPositions.push({ row, col });
                count++;
            }
        }
        
        // 标记封锁位置
        lockPositions.forEach(pos => {
            const cell = document.querySelector(`.board-cell[data-row="${pos.row}"][data-col="${pos.col}"]`);
            cell.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
            cell.style.cursor = 'not-allowed';
            // 实际游戏中需要在placeStone方法中检查这些位置
        });
        
        alert('画地为牢技能使用成功！封锁了两个位置！');
    }
    
    skillLuck() {
        // 简单实现：确保首次落子形成活三
        if (this.history.length === 0) {
            // 放置在中心位置
            const center = Math.floor(this.boardSize / 2);
            this.placeStone(center, center);
            alert('福运加身技能使用成功！首次落子必成活三！');
        } else {
            alert('福运加身技能只能在首次落子前使用！');
            this.skillUsed = false;
        }
    }
    
    updatePlayerStatus() {
        const player1Status = document.querySelector('.player1 .player-status');
        const player2Status = document.querySelector('.player2 .player-status');
        
        if (this.currentPlayer === 1) {
            player1Status.textContent = '当前回合';
            player1Status.classList.add('active');
            player2Status.textContent = '';
            player2Status.classList.remove('active');
        } else {
            player2Status.textContent = '当前回合';
            player2Status.classList.add('active');
            player1Status.textContent = '';
            player1Status.classList.remove('active');
        }
    }
    
    showWinModal(winner) {
        const modal = document.getElementById('game-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalMessage = document.getElementById('modal-message');
        
        modalTitle.textContent = '马到成功！';
        modalMessage.textContent = winner === 1 ? '红马获胜！' : '蓝马获胜！';
        
        // 显示马到成功印章特效
        this.showStampEffect();
        
        modal.classList.add('show');
    }
    
    hideModal() {
        const modal = document.getElementById('game-modal');
        modal.classList.remove('show');
    }
    
    showStampEffect() {
        const board = document.getElementById('game-board');
        const stamp = document.createElement('div');
        stamp.className = 'stamp-effect';
        stamp.textContent = '马到成功';
        stamp.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 3rem;
            color: #8b4513;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            animation: stamp 1s ease-out;
            z-index: 100;
        `;
        
        board.appendChild(stamp);
        
        setTimeout(() => {
            stamp.remove();
        }, 1000);
    }
    
    playSound(type) {
        // 简单的音效模拟
        console.log(`播放${type}音效`);
        // 实际游戏中可以使用Audio对象播放真实音效
    }
}

// 页面加载完成后初始化游戏
window.addEventListener('DOMContentLoaded', () => {
    new GobangGame();
});

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes winPulse {
        0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(230, 126, 34, 0.7);
        }
        70% {
            transform: scale(1.1);
            box-shadow: 0 0 0 10px rgba(230, 126, 34, 0);
        }
        100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(230, 126, 34, 0);
        }
    }
    
    @keyframes stamp {
        0% {
            transform: translate(-50%, -50%) scale(0) rotate(-45deg);
            opacity: 0;
        }
        50% {
            transform: translate(-50%, -50%) scale(1.2) rotate(-45deg);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(1) rotate(-45deg);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);