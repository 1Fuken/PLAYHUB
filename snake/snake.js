// Sélection des éléments du jeu
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const cellSize = 20;
const startX = 5;
const startY = 5;
const offset = 2;
const apple = { x: 10, y: 10 };
const tail = [];
const snake = {
  x: startX,
  y: startY,
  velocityX: 1,
  velocityY: 0,
  length: 1,
};
const snakeColors = ["#63c74d", "#3e8948", "#265c42", "#193c3e"];
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
document.getElementById('highScore').innerText = highScore;
let gameInterval;

// Démarrer le jeu
startGame();

function startGame() {
  gameInterval = setInterval(loop, 1000 / 12);
  document.addEventListener("keydown", handleMovement);

  // Détecter la connexion de la manette et commencer la mise à jour de l'état du gamepad
  window.addEventListener("gamepadconnected", () => {
    console.log("Manette connectée !");
    updateGamepad();
  });
}

// Mise à jour de la direction en fonction de la manette
function updateGamepad() {
  const gamepads = navigator.getGamepads();
  if (!gamepads[0]) return;  // Si aucune manette n'est connectée, on quitte

  const gp = gamepads[0];  // On récupère la première manette connectée

  // Détection des boutons de la croix directionnelle (haut, bas, gauche, droite)
  const up = gp.buttons[12].pressed;   // Bouton haut
  const down = gp.buttons[13].pressed; // Bouton bas
  const left = gp.buttons[14].pressed; // Bouton gauche
  const right = gp.buttons[15].pressed;// Bouton droite

  // Empêcher le serpent de faire demi-tour et éviter qu'il aille dans la direction opposée
  if (up && snake.velocityY !== 1) {
    snake.velocityX = 0;
    snake.velocityY = -1;
  } else if (down && snake.velocityY !== -1) {
    snake.velocityX = 0;
    snake.velocityY = 1;
  } else if (left && snake.velocityX !== 1) {
    snake.velocityX = -1;
    snake.velocityY = 0;
  } else if (right && snake.velocityX !== -1) {
    snake.velocityX = 1;
    snake.velocityY = 0;
  }

  // Répéter la détection à chaque frame
  requestAnimationFrame(updateGamepad);
}

// Fonction de la boucle du jeu
function loop() {
  // Déplacer le serpent
  snake.x += snake.velocityX;
  snake.y += snake.velocityY;

  // Vérifier les collisions avec les murs
  if (snake.x < 0) {
    snake.x = gridSize - 1;
  } else if (snake.x >= gridSize) {
    snake.x = 0;
  } else if (snake.y < 0) {
    snake.y = gridSize - 1;
  } else if (snake.y >= gridSize) {
    snake.y = 0;
  }

  // Vérifier si le serpent entre en collision avec lui-même
  for (let i = 0; i < tail.length; i++) {
    if (tail[i].x === snake.x && tail[i].y === snake.y) {
      gameOver(); // Game over si le serpent se mord
    }
  }

  // Effacer l'écran
  ctx.fillStyle = "#181425";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Dessiner la pomme
  ctx.fillStyle = "#ff0044";
  ctx.fillRect(
    apple.x * cellSize + offset / 2,
    apple.y * cellSize + offset / 2,
    cellSize - offset,
    cellSize - offset
  );

  // Dessiner le serpent
  for (let i = 0; i < tail.length; i++) {
    ctx.fillStyle =
      snakeColors[Math.min(tail.length - i - 1, snakeColors.length - 1)];
    ctx.fillRect(
      tail[i].x * cellSize + offset / 2,
      tail[i].y * cellSize + offset / 2,
      cellSize - offset,
      cellSize - offset
    );
  }

  // Ajouter la nouvelle position du serpent à la queue
  tail.push({ x: snake.x, y: snake.y });

  // Garder la longueur de la queue correcte
  while (tail.length > snake.length) {
    tail.shift();
  }

  // Vérifier les collisions avec la pomme
  if (snake.x === apple.x && snake.y === apple.y) {
    snake.length++;
    score++;
    document.getElementById('score').innerText = score;
    placeApple();
  }
}

function gameOver() {
  // Arrêter le jeu
  clearInterval(gameInterval);
  document.removeEventListener("keydown", handleMovement);
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
    document.getElementById('highScore').innerText = highScore;
  }
  document.getElementById('gameOverMenu').style.display = 'flex';
  document.getElementById('finalScore').innerText = score;
}

function restartGame() {
  // Réinitialiser le jeu
  snake.x = startX;
  snake.y = startY;
  snake.velocityX = 1;
  snake.velocityY = 0;
  snake.length = 1;
  tail.splice(0, tail.length);
  score = 0;
  document.getElementById('score').innerText = score;
  document.getElementById('gameOverMenu').style.display = 'none';
  startGame();
}

function placeApple() {
  // Placer la pomme à un nouvel endroit
  const freeCells = [];
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      let isOccupied = tail.some(
        (segment) => segment.x === i && segment.y === j
      );
      if (!isOccupied) {
        freeCells.push({ x: i, y: j });
      }
    }
  }

  const index = Math.floor(Math.random() * freeCells.length);
  apple.x = freeCells[index].x;
  apple.y = freeCells[index].y;
}

// Gérer les mouvements avec le clavier pour la compatibilité
function handleMovement(e) {
  // Empêcher le serpent de faire demi-tour
  switch (e.key) {
    case "ArrowDown":
    case "s":
      if (snake.velocityY === -1) {
        return;
      }
      snake.velocityY = 1;
      snake.velocityX = 0;
      break;
    case "ArrowUp":
    case "z":
      if (snake.velocityY === 1) {
        return;
      }
      snake.velocityY = -1;
      snake.velocityX = 0;
      break;
    case "ArrowLeft":
    case "q":
      if (snake.velocityX === 1) {
        return;
      }
      snake.velocityX = -1;
      snake.velocityY = 0;
      break;
    case "ArrowRight":
    case "d":
      if (snake.velocityX === -1) {
        return;
      }
      snake.velocityX = 1;
      snake.velocityY = 0;
  }
}
