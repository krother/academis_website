// Word Pizza: a classroom game building a circle of concepts.

const API = '/api/word_pie';
const POLL_MS = 1500;
const SVG_NS = 'http://www.w3.org/2000/svg';

// pizza geometry (SVG viewBox is -320..320)
const R_OUTER = 270;
const CRUST = 18;
const R_INNER = 62;
const PAD_DEG = 1.2;

const params = new URLSearchParams(window.location.search);
const gameId = params.get('game');

let game = null;
let myPosition = null;  // gap this client has drawn, known only to the drawer
let lastRenderKey = '';


// ---------- API ----------

async function api(path, query = {}) {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    (Array.isArray(value) ? value : [value]).forEach(v => qs.append(key, v));
  }
  const url = `${API}/${path}` + (qs.toString() ? `?${qs}` : '');
  const response = await fetch(url);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(typeof data.detail === 'string' ? data.detail : `request failed (${response.status})`);
  }
  return data;
}

const enc = encodeURIComponent;

function showError(err) {
  const box = document.getElementById('error');
  if (err) {
    box.textContent = err.message || err;
    box.classList.remove('d-none');
  } else {
    box.classList.add('d-none');
  }
}


// ---------- lobby ----------

async function loadGameList() {
  const list = document.getElementById('game_list');
  try {
    const games = await api('list_games');
    list.innerHTML = '';
    if (games.length === 0) {
      list.innerHTML = '<div class="text-muted">No games running.</div>';
    }
    for (const id of games) {
      const a = document.createElement('a');
      a.className = 'list-group-item list-group-item-action';
      a.href = `word_pie.html?game=${enc(id)}`;
      a.textContent = id;
      list.appendChild(a);
    }
    showError(null);
  } catch (err) {
    showError(err);
  }
}

async function startGame(event) {
  event.preventDefault();
  const name = document.getElementById('game_name').value.trim();
  const words = [...document.querySelectorAll('.start-word')].map(i => i.value.trim());
  const max_words = document.getElementById('max_words').value;
  try {
    const created = await api('new_game', { name, words, max_words });
    window.location.href = `word_pie.html?game=${enc(created.id)}`;
  } catch (err) {
    showError(err);
  }
}


// ---------- game actions ----------

async function refresh() {
  try {
    game = await api(`game/${enc(gameId)}`);
    showError(null);
  } catch (err) {
    showError(err);
    return;
  }
  if (game.state.name !== 'draw' && game.state.name !== 'guess') {
    myPosition = null;
  }
  render();
}

async function draw() {
  try {
    game = await api(`draw/${enc(gameId)}`);
    myPosition = game.state.secret_position;
    render();
    document.getElementById('secret_word').focus();
  } catch (err) {
    showError(err);
  }
}

async function setWord(event) {
  event.preventDefault();
  const input = document.getElementById('secret_word');
  try {
    game = await api(`set_word/${enc(gameId)}`, { word: input.value });
    input.value = '';
    render();
  } catch (err) {
    showError(err);
  }
}

async function guess(position) {
  if (!game || game.state.name !== 'guess' || myPosition !== null) return;
  try {
    game = await api(`guess/${enc(gameId)}`, { position });
    render();
  } catch (err) {
    showError(err);
  }
}


// ---------- rendering ----------

function sortedWords() {
  return Object.keys(game.words)
    .map(Number)
    .sort((a, b) => a - b)
    .map(k => game.words[k]);
}

function polar(r, deg) {
  const rad = deg * Math.PI / 180;
  return [r * Math.sin(rad), -r * Math.cos(rad)];  // 0° = top, clockwise
}

function sectorPath(r1, r2, a1, a2) {
  const large = (a2 - a1) > 180 ? 1 : 0;
  const [x1, y1] = polar(r2, a1);
  const [x2, y2] = polar(r2, a2);
  const [x3, y3] = polar(r1, a2);
  const [x4, y4] = polar(r1, a1);
  return `M ${x1} ${y1} A ${r2} ${r2} 0 ${large} 1 ${x2} ${y2} ` +
         `L ${x3} ${y3} A ${r1} ${r1} 0 ${large} 0 ${x4} ${y4} Z`;
}

function el(tag, attrs = {}, parent = null) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  if (parent) parent.appendChild(node);
  return node;
}

function hash(text) {
  let h = 2166136261;
  for (const c of text) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {  // tiny deterministic PRNG so toppings stay put between renders
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

function drawSlice(svg, word, a1, a2) {
  const g = el('g', { class: 'slice' }, svg);
  el('path', { d: sectorPath(R_INNER, R_OUTER - CRUST, a1, a2), fill: '#f6c945' }, g);
  el('path', { d: sectorPath(R_OUTER - CRUST, R_OUTER, a1, a2), fill: '#c47a2c' }, g);

  // toppings: pepperoni and basil, placed pseudo-randomly per word
  const rand = hash(word);
  const span = a2 - a1;
  const count = Math.max(1, Math.round(span / 25));
  for (let i = 0; i < count; i++) {
    const r = R_INNER + 25 + rand() * (R_OUTER - CRUST - R_INNER - 45);
    const a = a1 + span * (0.15 + 0.7 * rand());
    const [x, y] = polar(r, a);
    const size = Math.min(14, (r * span * Math.PI / 180) * 0.25);
    el('circle', { cx: x, cy: y, r: size, fill: '#b5332e', opacity: 0.45 }, g);
    if (rand() < 0.4) {
      const [bx, by] = polar(r * 0.8, a1 + span * rand());
      el('ellipse', { cx: bx, cy: by, rx: size * 0.6, ry: size * 0.3, fill: '#3f8f3f', opacity: 0.45,
                      transform: `rotate(${rand() * 180} ${bx} ${by})` }, g);
    }
  }

  // word along the radius, flipped on the left half so it is never upside down
  const mid = (a1 + a2) / 2;
  const rMid = (R_INNER + R_OUTER - CRUST) / 2;
  const [tx, ty] = polar(rMid, mid);
  const rotation = mid <= 180 ? mid - 90 : mid + 90;
  const radialLength = R_OUTER - CRUST - R_INNER - 16;
  const arcWidth = 2 * R_INNER * Math.sin(Math.min(span, 179) * Math.PI / 360) + 10;
  const fontSize = Math.min(30, arcWidth * 0.75, radialLength / (word.length * 0.6));
  const text = el('text', {
    x: 0, y: 0,
    transform: `translate(${tx} ${ty}) rotate(${rotation})`,
    'text-anchor': 'middle', 'dominant-baseline': 'central',
    'font-size': fontSize.toFixed(1), 'font-weight': 'bold', 'font-family': 'Lato, sans-serif',
    fill: '#3b2412', stroke: '#fff3c4', 'stroke-width': 3, 'paint-order': 'stroke',
  }, g);
  text.textContent = word;
}

function drawGapMarker(svg, index, angle, highlight) {
  const g = el('g', { class: 'gap-marker', 'data-gap': index }, svg);
  const [hx, hy] = polar(R_OUTER + 18, angle);
  el('circle', { cx: hx, cy: hy, r: 24, fill: 'transparent' }, g);  // larger click target
  const tip = polar(R_OUTER + 4, angle);
  const left = polar(R_OUTER + 30, angle - 4);
  const right = polar(R_OUTER + 30, angle + 4);
  el('polygon', {
    points: [tip, left, right].map(p => p.join(',')).join(' '),
    fill: highlight ? '#dc3545' : '#6c757d',
  }, g);
  g.addEventListener('click', () => guess(index));
}

function drawArrow(svg, angle) {
  const [x1, y1] = polar(R_INNER + 6, angle);
  const [x2, y2] = polar(R_OUTER - CRUST - 22, angle);
  el('line', { x1, y1, x2, y2, stroke: '#dc3545', 'stroke-width': 8, 'stroke-linecap': 'round' }, svg);
  const tip = polar(R_OUTER - 4, angle);
  const left = polar(R_OUTER - CRUST - 30, angle - 7);
  const right = polar(R_OUTER - CRUST - 30, angle + 7);
  el('polygon', { points: [tip, left, right].map(p => p.join(',')).join(' '), fill: '#dc3545' }, svg);
}

function drawPizza() {
  const svg = document.getElementById('pizza');
  const words = sortedWords();
  const showArrow = myPosition !== null && ['draw', 'guess'].includes(game.state.name);
  const key = JSON.stringify([words, game.lives, game.state.name, showArrow && myPosition]);
  if (key === lastRenderKey) return;  // avoid flicker while polling
  lastRenderKey = key;

  svg.innerHTML = '';
  svg.classList.toggle('guessing', game.state.name === 'guess' && myPosition === null);
  const step = 360 / words.length;

  words.forEach((word, i) => drawSlice(svg, word, i * step + PAD_DEG, (i + 1) * step - PAD_DEG));
  words.forEach((_, i) => drawGapMarker(svg, i, i * step, showArrow && i === myPosition));
  if (showArrow) drawArrow(svg, myPosition * step);

  // lives in the middle
  el('circle', { r: R_INNER - 6, fill: '#fff', stroke: '#c47a2c', 'stroke-width': 4 }, svg);
  const lives = el('text', {
    y: -4, 'text-anchor': 'middle', 'dominant-baseline': 'central',
    'font-size': 40, 'font-weight': 'bold', fill: '#dc3545',
  }, svg);
  lives.textContent = `${game.lives}`;
  const label = el('text', { y: 28, 'text-anchor': 'middle', 'font-size': 14, fill: '#6c757d' }, svg);
  label.textContent = game.lives === 1 ? 'life' : 'lives';
}

function render() {
  if (!game) return;
  const state = game.state.name;
  const isDrawer = myPosition !== null;
  const count = Object.keys(game.words).length;

  const bigWord = `<span class="d-block display-3 fw-bold text-danger my-3">${escapeHtml(game.state.secret_word)}</span>`;
  let status = '';
  if (state === 'wait') {
    status = `${count} of ${game.max_words} slices. Who comes up with the next word? Click <b>Draw</b>.`;
  } else if (state === 'draw') {
    status = isDrawer
      ? 'Find a word that fits into the gap marked by the arrow.'
      : 'Someone is thinking of a word… <button class="btn btn-link btn-sm p-0 align-baseline" id="redraw_btn">draw instead</button>';
  } else if (state === 'guess') {
    status = isDrawer
      ? `The others are guessing where this word belongs…${bigWord}`
      : `Where does this word belong? Click a triangle between two slices.${bigWord}`;
  } else if (state === 'won') {
    status = '🍕 You completed the pizza! You WON! 🍕';
  } else if (state === 'game_over') {
    status = 'GAME OVER – no lives left.';
  }
  document.getElementById('status').innerHTML = status;
  const redraw = document.getElementById('redraw_btn');
  if (redraw) redraw.addEventListener('click', draw);

  const message = document.getElementById('message');
  message.textContent = game.message;
  message.classList.toggle('d-none', !game.message || state === 'draw' || state === 'guess');
  message.classList.toggle('alert-success', game.message.startsWith('Correct'));
  message.classList.toggle('alert-warning', game.message.startsWith('Wrong'));

  document.getElementById('wait_controls').classList.toggle('d-none', state !== 'wait');
  document.getElementById('word_form').classList.toggle('d-none', !(state === 'draw' && isDrawer));
  document.getElementById('end_controls').classList.toggle('d-none', !['won', 'game_over'].includes(state));

  drawPizza();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text ?? '';
  return div.innerHTML;
}


// ---------- init ----------

if (gameId) {
  document.getElementById('lobby').style.display = 'none';
  document.getElementById('game').style.display = 'block';
  document.getElementById('game_title').textContent = gameId;
  document.getElementById('draw_btn').addEventListener('click', draw);
  document.getElementById('word_form').addEventListener('submit', setWord);
  refresh();
  setInterval(refresh, POLL_MS);
} else {
  document.getElementById('new_game_form').addEventListener('submit', startGame);
  document.getElementById('refresh_btn').addEventListener('click', loadGameList);
  loadGameList();
}
