// Tambola Game JavaScript
class TambolaWebGame {
    constructor() {
        this.players = [];
        this.calledNumbers = [];
        this.remainingNumbers = this.shuffleArray([...Array(90)].map((_, i) => i + 1));
        this.gameActive = false;
        this.autoPlay = false;
        this.autoPlayInterval = null;
        this.gameWinners = {};
        
        this.initializeEventListeners();
        this.updateCalledNumbersGrid();
    }
    
    initializeEventListeners() {
        // Button event listeners
        document.getElementById('newGameBtn').addEventListener('click', () => this.showSetupModal());
        document.getElementById('callNumberBtn').addEventListener('click', () => this.callNextNumber());
        document.getElementById('autoPlayBtn').addEventListener('click', () => this.toggleAutoPlay());
        document.getElementById('rulesBtn').addEventListener('click', () => this.showRulesModal());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        
        // Modal close buttons
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.target.closest('.modal').classList.add('hidden');
            });
        });
        
        // Number of players change
        document.getElementById('numPlayers').addEventListener('change', () => this.updatePlayerNameInputs());
        
        // Close modals when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        });
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    showSetupModal() {
        document.getElementById('setupModal').classList.remove('hidden');
        this.updatePlayerNameInputs();
    }
    
    closeSetupModal() {
        document.getElementById('setupModal').classList.add('hidden');
    }
    
    updatePlayerNameInputs() {
        const numPlayers = parseInt(document.getElementById('numPlayers').value);
        const container = document.getElementById('playerNamesContainer');
        container.innerHTML = '';
        
        for (let i = 1; i <= numPlayers; i++) {
            const div = document.createElement('div');
            div.innerHTML = `
                <label for="player${i}Name">Player ${i} Name:</label>
                <input type="text" id="player${i}Name" placeholder="Enter player ${i} name" value="Player ${i}">
            `;
            container.appendChild(div);
        }
    }
    
    startGame() {
        const numPlayers = parseInt(document.getElementById('numPlayers').value);
        const playerNames = [];
        
        // Get player names
        for (let i = 1; i <= numPlayers; i++) {
            const name = document.getElementById(`player${i}Name`).value.trim() || `Player ${i}`;
            if (playerNames.includes(name)) {
                alert(`Duplicate name "${name}". Please use unique names.`);
                return;
            }
            playerNames.push(name);
        }
        
        // Initialize game
        this.players = playerNames.map(name => ({
            name: name,
            ticket: this.generateTicket(),
            wins: []
        }));
        
        this.calledNumbers = [];
        this.remainingNumbers = this.shuffleArray([...Array(90)].map((_, i) => i + 1));
        this.gameActive = true;
        this.gameWinners = {};
        
        // Update UI
        this.closeSetupModal();
        this.renderPlayers();
        this.updateGameStatus('Game started! Click "Call Number" to begin.');
        this.updateCurrentNumber('Ready!');
        this.updateNumbersCalledInfo();
        this.updateCalledNumbersGrid();
        
        // Enable game buttons
        document.getElementById('callNumberBtn').disabled = false;
        document.getElementById('autoPlayBtn').disabled = false;
        
        alert(`Game started with ${numPlayers} player(s)!`);
    }
    
    generateTicket() {
        const ticket = Array(3).fill().map(() => Array(9).fill(0));
        const marked = Array(3).fill().map(() => Array(9).fill(false));
        
        // Column ranges: 1-9, 10-19, 20-29, ..., 80-90
        const columnRanges = [
            [1, 9], [10, 19], [20, 29], [30, 39], [40, 49],
            [50, 59], [60, 69], [70, 79], [80, 90]
        ];
        
        // Generate numbers for each column
        const allNumbers = [];
        for (let col = 0; col < 9; col++) {
            const [start, end] = columnRanges[col];
            const count = Math.floor(Math.random() * 3) + 1; // 1-3 numbers per column
            const numbers = [];
            
            while (numbers.length < count && numbers.length < (end - start + 1)) {
                const num = Math.floor(Math.random() * (end - start + 1)) + start;
                if (!numbers.includes(num)) {
                    numbers.push(num);
                    allNumbers.push({ num, col });
                }
            }
        }
        
        // Ensure we have exactly 15 numbers
        while (allNumbers.length < 15) {
            const col = Math.floor(Math.random() * 9);
            const [start, end] = columnRanges[col];
            const num = Math.floor(Math.random() * (end - start + 1)) + start;
            
            if (!allNumbers.some(item => item.num === num)) {
                allNumbers.push({ num, col });
            }
        }
        
        if (allNumbers.length > 15) {
            allNumbers.splice(15);
        }
        
        // Distribute numbers across rows (5 per row)
        const shuffled = this.shuffleArray(allNumbers);
        for (let row = 0; row < 3; row++) {
            const rowNumbers = shuffled.slice(row * 5, (row + 1) * 5);
            rowNumbers.sort((a, b) => a.col - b.col); // Sort by column
            
            for (const { num, col } of rowNumbers) {
                ticket[row][col] = num;
            }
        }
        
        return { grid: ticket, marked: marked };
    }
    
    renderPlayers() {
        const container = document.getElementById('playersContainer');
        container.innerHTML = '';
        
        this.players.forEach(player => {
            const playerDiv = document.createElement('div');
            playerDiv.className = 'player-card';
            playerDiv.innerHTML = `
                <div class="player-header">
                    <div class="player-name">🎫 ${player.name}</div>
                    <div class="player-wins" id="wins-${player.name}">
                        ${player.wins.length > 0 ? '🏆 ' + player.wins.join(', ') : ''}
                    </div>
                </div>
                <div class="ticket-grid" id="ticket-${player.name}">
                    ${this.renderTicket(player.ticket)}
                </div>
            `;
            container.appendChild(playerDiv);
        });
    }
    
    renderTicket(ticket) {
        let html = '';
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 9; col++) {
                const number = ticket.grid[row][col];
                const isMarked = ticket.marked[row][col];
                const isEmpty = number === 0;
                
                let cellClass = 'ticket-cell';
                if (isEmpty) cellClass += ' empty';
                if (isMarked) cellClass += ' marked';
                
                html += `<div class="${cellClass}" data-number="${number}">
                    ${isEmpty ? '' : number}
                </div>`;
            }
        }
        return html;
    }
    
    callNextNumber() {
        if (!this.gameActive || this.remainingNumbers.length === 0) {
            return;
        }
        
        const number = this.remainingNumbers.shift();
        this.calledNumbers.push(number);
        
        // Update UI
        this.updateCurrentNumber(number);
        this.updateNumbersCalledInfo();
        this.updateCalledNumbersGrid();
        this.updateRecentNumbers();
        
        // Mark numbers on tickets and check for wins
        const playersWithNumber = [];
        const newWinners = [];
        
        this.players.forEach(player => {
            const previousWins = [...player.wins];
            
            if (this.markNumberOnTicket(player.ticket, number)) {
                playersWithNumber.push(player.name);
                this.updatePlayerTicketDisplay(player);
            }
            
            // Check for new wins
            const newWins = this.checkForWins(player.ticket, previousWins);
            if (newWins.length > 0) {
                newWinners.push({ name: player.name, wins: newWins });
                player.wins = [...previousWins, ...newWins];
                
                // Record winners
                newWins.forEach(win => {
                    if (!this.gameWinners[win]) {
                        this.gameWinners[win] = [];
                    }
                    this.gameWinners[win].push(player.name);
                });
                
                // Update wins display
                document.getElementById(`wins-${player.name}`).textContent = 
                    player.wins.length > 0 ? '🏆 ' + player.wins.join(', ') : '';
            }
        });
        
        // Update game status
        if (playersWithNumber.length > 0) {
            this.updateGameStatus(`Number ${number} found on: ${playersWithNumber.join(', ')}`);
        } else {
            this.updateGameStatus(`Number ${number} - No matches`);
        }
        
        // Show winner announcements
        if (newWinners.length > 0) {
            this.showWinnerAnnouncement(newWinners);
        }
        
        // Check if game should end
        if (this.gameWinners['Full House'] || this.remainingNumbers.length === 0) {
            this.endGame();
        }
    }
    
    markNumberOnTicket(ticket, number) {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 9; col++) {
                if (ticket.grid[row][col] === number) {
                    ticket.marked[row][col] = true;
                    return true;
                }
            }
        }
        return false;
    }
    
    updatePlayerTicketDisplay(player) {
        const ticketElement = document.getElementById(`ticket-${player.name}`);
        ticketElement.innerHTML = this.renderTicket(player.ticket);
    }
    
    checkForWins(ticket, previousWins) {
        const newWins = [];
        
        // Check lines
        for (let row = 0; row < 3; row++) {
            if (this.isLineComplete(ticket, row)) {
                const lineWin = ['First Line', 'Second Line', 'Third Line'][row];
                if (!previousWins.includes(lineWin)) {
                    newWins.push(lineWin);
                }
            }
        }
        
        // Check four corners
        if (this.areFourCornersComplete(ticket) && !previousWins.includes('Four Corners')) {
            newWins.push('Four Corners');
        }
        
        // Check full house
        if (this.isFullHouseComplete(ticket) && !previousWins.includes('Full House')) {
            newWins.push('Full House');
        }
        
        return newWins;
    }
    
    isLineComplete(ticket, row) {
        for (let col = 0; col < 9; col++) {
            if (ticket.grid[row][col] !== 0 && !ticket.marked[row][col]) {
                return false;
            }
        }
        return true;
    }
    
    areFourCornersComplete(ticket) {
        const corners = [];
        
        // Find corners for first and last rows
        for (const row of [0, 2]) {
            const rowNumbers = [];
            for (let col = 0; col < 9; col++) {
                if (ticket.grid[row][col] !== 0) {
                    rowNumbers.push({ row, col });
                }
            }
            if (rowNumbers.length >= 2) {
                corners.push(rowNumbers[0], rowNumbers[rowNumbers.length - 1]);
            }
        }
        
        if (corners.length === 4) {
            return corners.every(({ row, col }) => ticket.marked[row][col]);
        }
        return false;
    }
    
    isFullHouseComplete(ticket) {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 9; col++) {
                if (ticket.grid[row][col] !== 0 && !ticket.marked[row][col]) {
                    return false;
                }
            }
        }
        return true;
    }
    
    showWinnerAnnouncement(winners) {
        const winnerInfo = document.getElementById('winnerInfo');
        let html = '';
        
        winners.forEach(winner => {
            html += `<div style="margin-bottom: 15px;">
                <h3>🎉 ${winner.name} 🎉</h3>
                <p><strong>Won:</strong> ${winner.wins.join(', ')}</p>
            </div>`;
        });
        
        winnerInfo.innerHTML = html;
        document.getElementById('winnerModal').classList.remove('hidden');
    }
    
    toggleAutoPlay() {
        this.autoPlay = !this.autoPlay;
        const btn = document.getElementById('autoPlayBtn');
        const status = document.getElementById('autoPlayStatus');
        
        if (this.autoPlay) {
            btn.textContent = '⏸️ Stop Auto';
            btn.className = 'btn btn-danger';
            status.textContent = 'Auto-play: ON';
            status.classList.remove('hidden');
            document.getElementById('callNumberBtn').disabled = true;
            
            this.autoPlayInterval = setInterval(() => {
                if (this.gameActive && this.remainingNumbers.length > 0) {
                    this.callNextNumber();
                } else {
                    this.toggleAutoPlay();
                }
            }, 2000);
        } else {
            btn.textContent = '⏯️ Auto Play';
            btn.className = 'btn btn-warning';
            status.textContent = 'Auto-play: OFF';
            status.classList.add('hidden');
            document.getElementById('callNumberBtn').disabled = false;
            
            if (this.autoPlayInterval) {
                clearInterval(this.autoPlayInterval);
                this.autoPlayInterval = null;
            }
        }
    }
    
    updateCurrentNumber(number) {
        document.getElementById('currentNumber').textContent = number;
    }
    
    updateNumbersCalledInfo() {
        document.getElementById('numbersCalledInfo').textContent = 
            `Numbers Called: ${this.calledNumbers.length}/90`;
    }
    
    updateGameStatus(message) {
        document.getElementById('gameStatusInfo').textContent = message;
    }
    
    updateCalledNumbersGrid() {
        const grid = document.getElementById('calledNumbersGrid');
        grid.innerHTML = '';
        
        this.calledNumbers.forEach(number => {
            const div = document.createElement('div');
            div.className = 'called-number';
            div.textContent = number;
            grid.appendChild(div);
        });
    }
    
    updateRecentNumbers() {
        const recent = this.calledNumbers.slice(-10);
        document.getElementById('recentNumbers').textContent = 
            recent.length > 0 ? recent.join(', ') : 'None';
    }
    
    endGame() {
        this.gameActive = false;
        if (this.autoPlay) {
            this.toggleAutoPlay();
        }
        
        // Disable game buttons
        document.getElementById('callNumberBtn').disabled = true;
        document.getElementById('autoPlayBtn').disabled = true;
        
        this.showFinalResults();
    }
    
    showFinalResults() {
        const resultsDiv = document.getElementById('finalResults');
        let html = '';
        
        if (Object.keys(this.gameWinners).length === 0) {
            html = '<p>No winners in this game! Better luck next time!</p>';
        } else {
            html = '<h3>🏆 Winners:</h3>';
            
            const prizeOrder = ['First Line', 'Second Line', 'Third Line', 'Four Corners', 'Full House'];
            prizeOrder.forEach(prize => {
                if (this.gameWinners[prize]) {
                    html += `<div style="margin-bottom: 10px;">
                        <strong>${prize}:</strong> ${this.gameWinners[prize].join(', ')}
                    </div>`;
                }
            });
        }
        
        html += '<p style="margin-top: 20px;">Thanks for playing Tambola!</p>';
        resultsDiv.innerHTML = html;
        document.getElementById('resultsModal').classList.remove('hidden');
    }
    
    resetGame() {
        if (confirm('Are you sure you want to reset the game?')) {
            this.gameActive = false;
            if (this.autoPlay) {
                this.toggleAutoPlay();
            }
            
            this.players = [];
            this.calledNumbers = [];
            this.remainingNumbers = this.shuffleArray([...Array(90)].map((_, i) => i + 1));
            this.gameWinners = {};
            
            // Reset UI
            document.getElementById('playersContainer').innerHTML = `
                <div class="no-game-message">
                    <p>🎮 Click "New Game" to start playing!</p>
                    <p>📋 Click "Rules" to learn how to play</p>
                </div>
            `;
            
            this.updateCurrentNumber('Ready!');
            this.updateNumbersCalledInfo();
            this.updateGameStatus('Welcome to Tambola!');
            this.updateCalledNumbersGrid();
            document.getElementById('recentNumbers').textContent = 'None';
            
            // Disable game buttons
            document.getElementById('callNumberBtn').disabled = true;
            document.getElementById('autoPlayBtn').disabled = true;
        }
    }
    
    showRulesModal() {
        document.getElementById('rulesModal').classList.remove('hidden');
    }
    
    closeRulesModal() {
        document.getElementById('rulesModal').classList.add('hidden');
    }
    
    closeWinnerModal() {
        document.getElementById('winnerModal').classList.add('hidden');
    }
    
    closeResultsModal() {
        document.getElementById('resultsModal').classList.add('hidden');
        this.resetGame();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.tambolaGame = new TambolaWebGame();
});

// Global functions for modal controls
function startGame() {
    window.tambolaGame.startGame();
}

function closeSetupModal() {
    window.tambolaGame.closeSetupModal();
}

function closeRulesModal() {
    window.tambolaGame.closeRulesModal();
}

function closeWinnerModal() {
    window.tambolaGame.closeWinnerModal();
}

function closeResultsModal() {
    window.tambolaGame.closeResultsModal();
}
