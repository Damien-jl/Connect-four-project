class Game {
  constructor(player1,player2, width = 7, height = 6) {
    this.width = width;
    this.height = height;
    this.players = [player1,player2]
    this.currPlayer = player1;
    this.makeBoard();
    this.makeHtmlBoard();
    this.gameOver = false;
  }

  makeBoard() {
    this.board = []
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  makeHtmlBoard() {
    const gameBoard = document.querySelector('#board');
    gameBoard.innerHTML = '';
    const colTop = document.createElement('tr');
    colTop.setAttribute('id', 'column-top');
    this.gameClick = this.handleClick.bind(this);
    colTop.addEventListener('click', this.gameClick);
  
    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      colTop.append(headCell);
    }
      gameBoard.append(colTop);
  
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');
  
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
  
      gameBoard.append(row);
    }
  }

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) {
    alert(msg);
    const colTop = document.querySelector('#column-top');
    colTop.removeEventListener('click', this.gameClick);
  }

  handleClick(evt) {
    const x = +evt.target.id;
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    
    if (this.checkForWin()) {
      this.gameOver = true;
      return this.endGame(`The ${this.currPlayer.color} Player won!`);
    }
  
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
          this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  }

  checkForWin() {
    const _win = cells => 
      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height && 
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
  
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

class Player {
  constructor (color) {
    this.color = color;
  }
}

let startBtn = document.querySelector('#start-game');
startBtn.addEventListener('click', () => {
  const player1 = new Player(document.querySelector('#play1-color').value);
  const player2 = new Player(document.querySelector('#play2-color').value);
  new Game(player1,player2);
})
