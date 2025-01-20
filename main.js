import './style.css'

// Navigation
const snakeButton = document.getElementById('snakeButton');
const game2Button = document.getElementById('game2Button');
const game3Button = document.getElementById('game3Button');
const snakeSection = document.getElementById('snakeGame');
const game2Section = document.getElementById('game2');
const game3Section = document.getElementById('game3');

snakeButton.addEventListener('click', () => {
  snakeButton.classList.add('active');
  game2Button.classList.remove('active');
  game3Button.classList.remove('active');
  snakeSection.classList.add('active');
  game2Section.classList.remove('active');
  game3Section.classList.remove('active');
  if (gameLoop) {
    cancelAnimationFrame(gameLoop);
    gameRunning = false;
  }
});

game2Button.addEventListener('click', () => {
  game2Button.classList.add('active');
  snakeButton.classList.remove('active');
  game3Button.classList.remove('active');
  game2Section.classList.add('active');
  snakeSection.classList.remove('active');
  game3Section.classList.remove('active');
  if (gameLoop) {
    cancelAnimationFrame(gameLoop);
    gameRunning = false;
  }
});

game3Button.addEventListener('click', () => {
  game3Button.classList.add('active');
  snakeButton.classList.remove('active');
  game2Button.classList.remove('active');
  game3Section.classList.add('active');
  snakeSection.classList.remove('active');
  game2Section.classList.remove('active');
  if (gameLoop) {
    cancelAnimationFrame(gameLoop);
    gameRunning = false;
  }
});

// Snake Game
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const startButton = document.getElementById('startButton');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let dx = 0;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameRunning = false;
let gameLoop = null;

highScoreElement.textContent = `Meilleur Score: ${highScore}`;

startButton.addEventListener('click', () => {
  if (gameLoop) {
    cancelAnimationFrame(gameLoop);
  }
  resetGame();
  gameRunning = true;
  drawGame();
});

document.addEventListener('keydown', (event) => {
  if (!gameRunning) return;
  
  switch(event.key) {
    case 'ArrowUp':
      if (dy === 0) { dx = 0; dy = -1; }
      break;
    case 'ArrowDown':
      if (dy === 0) { dx = 0; dy = 1; }
      break;
    case 'ArrowLeft':
      if (dx === 0) { dx = -1; dy = 0; }
      break;
    case 'ArrowRight':
      if (dx === 0) { dx = 1; dy = 0; }
      break;
  }
});

function drawGame() {
  if (!gameRunning) return;

  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreElement.textContent = `Score: ${score}`;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('snakeHighScore', highScore);
      highScoreElement.textContent = `Meilleur Score: ${highScore}`;
    }
    food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
  } else {
    snake.pop();
  }

  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    gameOver();
    return;
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver();
      return;
    }
  }

  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.strokeStyle = 'rgba(100, 108, 255, 0.1)';
  for (let i = 0; i < tileCount; i++) {
    ctx.beginPath();
    ctx.moveTo(i * gridSize, 0);
    ctx.lineTo(i * gridSize, canvas.height);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, i * gridSize);
    ctx.lineTo(canvas.width, i * gridSize);
    ctx.stroke();
  }

  ctx.shadowBlur = 15;
  ctx.shadowColor = 'rgba(255, 0, 0, 0.5)';
  ctx.fillStyle = '#ff0000';
  ctx.beginPath();
  ctx.arc((food.x * gridSize) + gridSize/2, (food.y * gridSize) + gridSize/2, gridSize/2 - 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 0;

  snake.forEach((segment, index) => {
    const gradient = ctx.createLinearGradient(
      segment.x * gridSize,
      segment.y * gridSize,
      (segment.x + 1) * gridSize,
      (segment.y + 1) * gridSize
    );
    gradient.addColorStop(0, '#646cff');
    gradient.addColorStop(1, '#7c83ff');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
  });

  gameLoop = setTimeout(() => requestAnimationFrame(drawGame), 100);
}

function gameOver() {
  gameRunning = false;
  const gradient = ctx.createLinearGradient(0, canvas.height/2 - 50, 0, canvas.height/2 + 50);
  gradient.addColorStop(0, '#ff6b6b');
  gradient.addColorStop(1, '#ff8585');
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.font = '30px "Press Start 2P"';
  ctx.fillStyle = gradient;
  ctx.textAlign = 'center';
  ctx.fillText('Game Over!', canvas.width/2, canvas.height/2);
  
  ctx.font = '16px "Press Start 2P"';
  ctx.fillStyle = '#fff';
  ctx.fillText(`Score: ${score}`, canvas.width/2, canvas.height/2 + 40);
}

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  food = { x: 5, y: 5 };
  dx = 0;
  dy = 0;
  score = 0;
  scoreElement.textContent = `Score: ${score}`;
}

// Memory Game
const memoryGrid = document.getElementById('memoryGrid');
const memoryMovesElement = document.getElementById('memoryMoves');
const memoryPairsElement = document.getElementById('memoryPairs');
const memoryStartButton = document.getElementById('memoryStartButton');

const emojis = ['🎮', '🎲', '🎯', '🎪', '🎨', '🎭', '🎪', '🎯'];
let cards = [];
let flippedCards = [];
let moves = 0;
let pairs = 0;
let canFlip = true;

function createMemoryCard(emoji, index) {
  const card = document.createElement('div');
  card.className = 'memory-card';
  card.dataset.index = index;
  card.dataset.emoji = emoji;
  card.addEventListener('click', () => flipCard(card));
  return card;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function flipCard(card) {
  if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) {
    return;
  }

  card.classList.add('flipped');
  card.textContent = card.dataset.emoji;
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    moves++;
    memoryMovesElement.textContent = `Coups: ${moves}`;
    canFlip = false;

    if (flippedCards[0].dataset.emoji === flippedCards[1].dataset.emoji) {
      flippedCards.forEach(card => card.classList.add('matched'));
      pairs++;
      memoryPairsElement.textContent = `Paires: ${pairs}/8`;
      flippedCards = [];
      canFlip = true;

      if (pairs === 8) {
        setTimeout(() => {
          alert(`Bravo ! Vous avez gagné en ${moves} coups !`);
        }, 500);
      }
    } else {
      setTimeout(() => {
        flippedCards.forEach(card => {
          card.classList.remove('flipped');
          card.textContent = '';
        });
        flippedCards = [];
        canFlip = true;
      }, 1000);
    }
  }
}

function initMemoryGame() {
  memoryGrid.innerHTML = '';
  moves = 0;
  pairs = 0;
  flippedCards = [];
  canFlip = true;
  memoryMovesElement.textContent = `Coups: ${moves}`;
  memoryPairsElement.textContent = `Paires: ${pairs}/8`;

  const gameEmojis = [...emojis, ...emojis];
  shuffleArray(gameEmojis);
  
  gameEmojis.forEach((emoji, index) => {
    const card = createMemoryCard(emoji, index);
    memoryGrid.appendChild(card);
  });
}

// Puzzle Game
const puzzleGrid = document.getElementById('puzzleGrid');
const puzzleMovesElement = document.getElementById('puzzleMoves');
const puzzleStartButton = document.getElementById('puzzleStartButton');

let puzzleTiles = [];
let puzzleMoves = 0;
let emptyTileIndex = 8;

function createPuzzleTile(number, index) {
  const tile = document.createElement('div');
  tile.className = 'puzzle-tile';
  if (number === 0) {
    tile.classList.add('empty');
  } else {
    tile.textContent = number;
    tile.addEventListener('click', () => movePuzzleTile(index));
  }
  return tile;
}

function updatePuzzleGrid() {
  puzzleGrid.innerHTML = '';
  puzzleTiles.forEach((number, index) => {
    const tile = createPuzzleTile(number, index);
    if (number !== 0 && number === index + 1) {
      tile.classList.add('correct');
    }
    puzzleGrid.appendChild(tile);
  });
}

function movePuzzleTile(index) {
  const row = Math.floor(index / 3);
  const emptyRow = Math.floor(emptyTileIndex / 3);
  const col = index % 3;
  const emptyCol = emptyTileIndex % 3;

  if (
    (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
    (Math.abs(col - emptyCol) === 1 && row === emptyRow)
  ) {
    [puzzleTiles[index], puzzleTiles[emptyTileIndex]] = [puzzleTiles[emptyTileIndex], puzzleTiles[index]];
    emptyTileIndex = index;
    puzzleMoves++;
    puzzleMovesElement.textContent = `Coups: ${puzzleMoves}`;
    updatePuzzleGrid();
    checkPuzzleWin();
  }
}

function checkPuzzleWin() {
  const isWin = puzzleTiles.every((number, index) => {
    if (index === 8) return number === 0;
    return number === index + 1;
  });

  if (isWin) {
    setTimeout(() => {
      alert(`Bravo ! Vous avez résolu le puzzle en ${puzzleMoves} coups !`);
    }, 500);
  }
}

function initPuzzleGame() {
  puzzleTiles = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  emptyTileIndex = 8;
  puzzleMoves = 0;
  puzzleMovesElement.textContent = `Coups: ${puzzleMoves}`;

  // Mélanger le puzzle
  for (let i = 0; i < 1000; i++) {
    const possibleMoves = [];
    const emptyRow = Math.floor(emptyTileIndex / 3);
    const emptyCol = emptyTileIndex % 3;

    // Vérifier les mouvements possibles
    if (emptyRow > 0) possibleMoves.push(emptyTileIndex - 3);
    if (emptyRow < 2) possibleMoves.push(emptyTileIndex + 3);
    if (emptyCol > 0) possibleMoves.push(emptyTileIndex - 1);
    if (emptyCol < 2) possibleMoves.push(emptyTileIndex + 1);

    // Faire un mouvement aléatoire
    const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    [puzzleTiles[randomMove], puzzleTiles[emptyTileIndex]] = [puzzleTiles[emptyTileIndex], puzzleTiles[randomMove]];
    emptyTileIndex = randomMove;
  }

  updatePuzzleGrid();
}

puzzleStartButton.addEventListener('click', initPuzzleGame);

// Initialize all games
document.fonts.ready.then(() => {
  // Snake Game initial screen
  ctx.font = '30px "Press Start 2P"';
  ctx.fillStyle = '#646cff';
  ctx.textAlign = 'center';
  ctx.fillText('Snake Game', canvas.width/2, canvas.height/2 - 20);
  
  ctx.font = '16px "Press Start 2P"';
  ctx.fillStyle = '#fff';
  ctx.fillText('Cliquez sur Nouvelle Partie', canvas.width/2, canvas.height/2 + 20);
  ctx.fillText('pour commencer', canvas.width/2, canvas.height/2 + 50);

  // Initialize Memory Game
  initMemoryGame();

  // Initialize Puzzle Game
  initPuzzleGame();
});