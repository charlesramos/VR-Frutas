const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let basketX = canvas.width / 2;
const basketWidth = 100;
const basketHeight = 20;
let score = 0;

// Lista de frutinhas
const fruits = [];
const fruitRadius = 15;

// Atualizar pontuação
const scoreElement = document.getElementById('score');

// Adicionar frutinhas
function addFruit() {
  const x = Math.random() * (canvas.width - 2 * fruitRadius) + fruitRadius;
  fruits.push({ x, y: 0, speed: Math.random() * 3 + 2 });
}

// Atualizar posição das frutinhas
function updateFruits() {
  for (let i = fruits.length - 1; i >= 0; i--) {
    const fruit = fruits[i];
    fruit.y += fruit.speed;

    // Verificar colisão com a cesta
    if (
      fruit.y + fruitRadius >= canvas.height - basketHeight &&
      fruit.x > basketX &&
      fruit.x < basketX + basketWidth
    ) {
      fruits.splice(i, 1);
      score++;
      scoreElement.innerText = `Pontuação: ${score}`;
    }

    // Remover frutinha que sai da tela
    if (fruit.y > canvas.height) {
      fruits.splice(i, 1);
    }
  }
}

// Desenhar a cesta
function drawBasket() {
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(basketX, canvas.height - basketHeight, basketWidth, basketHeight);
}

// Desenhar frutinhas
function drawFruits() {
  ctx.fillStyle = '#FF6347';
  fruits.forEach(fruit => {
    ctx.beginPath();
    ctx.arc(fruit.x, fruit.y, fruitRadius, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Movimentar a cesta com o giroscópio
if (window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', (event) => {
    const gamma = event.gamma; // Inclinação no eixo X
    if (gamma) {
      basketX += gamma * 2;
      basketX = Math.max(0, Math.min(canvas.width - basketWidth, basketX));
    }
  });
}

// Loop principal do jogo
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Atualizar e desenhar frutinhas
  updateFruits();
  drawFruits();

  // Desenhar cesta
  drawBasket();

  requestAnimationFrame(gameLoop);
}

// Adicionar frutinhas periodicamente
setInterval(addFruit, 1000);

// Iniciar o jogo
gameLoop();
