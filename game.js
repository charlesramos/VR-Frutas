const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let basketX = canvas.width / 2 - 50;
const basketWidth = 100;
const basketHeight = 50;
const basketY = canvas.height - basketHeight - 10;
let score = 0;

// Atualizar pontuação
const scoreElement = document.getElementById('score');

// Lista de imagens das frutas
const fruitImages = [
  'imagens/banana.png',
  'imagens/maca.png',
  'imagens/melancia.png',
];

// Lista de frutinhas
const fruits = [];

// Carregar imagens
const loadedImages = fruitImages.map((src) => {
  const img = new Image();
  img.src = src;
  return img;
});

// Adicionar frutinhas
function addFruit() {
  const x = Math.random() * (canvas.width - 50) + 25; // Garantir que a fruta não saia pelas bordas
  const imageIndex = Math.floor(Math.random() * loadedImages.length);
  fruits.push({
    x,
    y: 0,
    speed: Math.random() * 3 + 2,
    image: loadedImages[imageIndex],
    width: 50,
    height: 50,
  });
}

// Atualizar posição das frutinhas
function updateFruits() {
  for (let i = fruits.length - 1; i >= 0; i--) {
    const fruit = fruits[i];
    fruit.y += fruit.speed;

    // Verificar colisão com a cesta
    if (
      fruit.y + fruit.height >= basketY &&
      fruit.x + fruit.width > basketX &&
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
  ctx.fillRect(basketX, basketY, basketWidth, basketHeight);
}

// Desenhar frutinhas
function drawFruits() {
  fruits.forEach((fruit) => {
    ctx.drawImage(fruit.image, fruit.x, fruit.y, fruit.width, fruit.height);
  });
}

// Movimentar a cesta com o giroscópio
if (window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', (event) => {
    const beta = event.beta; // Inclinação no eixo X
    if (beta) {
      basketX += beta * 1;
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
