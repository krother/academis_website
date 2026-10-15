const canvas = document.getElementById("card_canvas");
const ctx = canvas.getContext("2d");

// Store card data
const cards = [];

// Different light tones of a single color
const colors = ["#d7e6c4", "#b3d789", "#80b940"];

// Function to generate random positions for the cards
function getRandomPosition(width, height) {
  const x = Math.floor(Math.random() * (canvas.width - width));
  const y = Math.floor(Math.random() * (canvas.height - height));
  return { x, y };
}

// Function to draw a card
function drawCard(card) {
  ctx.fillStyle = card.color;
  ctx.fillRect(card.x, card.y, card.width, card.height);
  ctx.fillStyle = "#000";
  ctx.font = "22px Arial";
  ctx.fillText(card.text, card.x + 20, card.y + 40);
}

function createCards(words) {
  words.forEach((word, index) => {
    const width = 250;
    const height = 85;
    const { x, y } = getRandomPosition(width, height);
    const color = colors[index % colors.length];

    const card = { text: word, x, y, width, height, color, visible: true };
    cards.push(card);
    drawCard(card);
  });
}

// Function to check if a click is within a card
function isInsideCard(x, y, card) {
  return x >= card.x && x <= card.x + card.width &&
  y >= card.y && y <= card.y + card.height;
}

// Event listener for clicks on canvas
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  // Check each card to see if the click was inside it
  for (const card of cards) {
    if (card.visible && isInsideCard(clickX, clickY, card)) {
      card.visible = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cards.filter(card => card.visible).forEach(drawCard);
      break;
    }
  }
});

document.getElementById("start_btn").addEventListener("click", () => {
  const words = document.getElementById("word_input").value
    .split("\n")
    .map(w => w.trim())
    .filter(w => w.length > 0);
  document.getElementById("setup").style.display = "none";
  canvas.style.display = "block";
  createCards(words);
});
