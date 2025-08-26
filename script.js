// ===== CATEGORÍAS PREDEFINIDAS =====
const categories = {
  futbolistas: [
    "Lionel Messi","Cristiano Ronaldo","Neymar Jr","Kylian Mbappé","Mohamed Salah",
    "Robert Lewandowski","Luka Modrić","Sergio Ramos","Kevin De Bruyne","Eden Hazard",
    "Karim Benzema","Harry Kane","Virgil van Dijk","Sadio Mané","Paul Pogba",
    "Gareth Bale","Zlatan Ibrahimović","Luis Suárez","David De Gea","Manuel Neuer",
    "Thibaut Courtois","Philippe Coutinho","Antoine Griezmann","Gerard Piqué","Sergio Agüero",
    "Cesc Fàbregas","Ángel Di María","James Rodríguez","Radamel Falcao","Diego Costa",
    "N’Golo Kanté","Marco Verratti","Isco Alarcón","Lorenzo Insigne","Romelu Lukaku",
    "Pierre-Emerick Aubameyang","Mauro Icardi","Mats Hummels","Toni Kroos","Xavi Hernández",
    "Andrés Iniesta","Wayne Rooney","Iker Casillas","Gianluigi Buffon","Kaká",
    "Ronaldinho","David Beckham","Didier Drogba","Franck Ribéry","Mesut Özil"
  ]
};

// ===== ESTADO DEL JUEGO =====
let words = [];            // todas las palabras disponibles
let players = [];          // [{name, role, word}]
let playerCount = 0;
let impostorCount = 1;
let currentPlayer = 0;
let impostors = [];
let selectedCategories = new Set();

// ===== UTILIDADES DE UI =====
const $ = (id) => document.getElementById(id);
const show = (id) => $(id).classList.add('visible');
const hide = (id) => $(id).classList.remove('visible');

function renderWordList(){
  $('wordList').innerText = words.join(', ');
}

// ===== FLUJO: INICIO =====
function selectCategory(key, btnId){
  if(!categories[key] || selectedCategories.has(key)) return;
  selectedCategories.add(key);
  // unir y evitar duplicados
  words = Array.from(new Set([...words, ...categories[key]]));
  renderWordList();
  // feedback visual
  const btn = $(btnId);
  if(btn){
    btn.disabled = true;
    btn.textContent = "Cargada ✓";
  }
}

function addWord(){
  const input = $('wordInput');
  const w = (input.value || '').trim();
  if(!w) return;
  words = Array.from(new Set([...words, w]));
  input.value = '';
  renderWordList();
}

function startGame(){
  playerCount = parseInt(($('playerCount').value||'0'),10);
  impostorCount = parseInt(($('impostorCount').value||'0'),10);

  // Validaciones
  if(words.length === 0){
    alert('Agregá al menos una palabra (o una categoría).');
    return;
  }
  if(isNaN(playerCount) || playerCount < 1 || playerCount > 20){
    alert('Número de jugadores inválido (1–20).');
    return;
  }
  if(isNaN(impostorCount) || impostorCount < 1 || impostorCount > 6){
    alert('Número de impostores inválido (1–6).');
    return;
  }
  if(impostorCount >= playerCount){
    alert('Debe haber al menos 1 jugador NO impostor.');
    return;
  }

  // Setup de roles
  players = [];
  impostors = [];
  currentPlayer = 0;

  const pool = Array.from({length: playerCount}, (_, i) => i);
  while(impostors.length < impostorCount){
    const idx = Math.floor(Math.random() * pool.length);
    impostors.push(pool.splice(idx,1)[0]);
  }

  const randomWord = words[Math.floor(Math.random()*words.length)];
  for(let i=0;i<playerCount;i++){
    players.push({
      name: `Jugador ${i+1}`,
      role: impostors.includes(i) ? 'Impostor' : 'Jugador',
      word: randomWord
    });
  }

  // Cambiar de pantalla: INICIO -> GAME
  hide('screen-setup');
  show('screen-game');
  $('playerLabel').innerText = players[currentPlayer].name;
  $('cardButton').innerText = 'Ver carta';
  $('cardButton').onclick = revealCard;
}

// ===== FLUJO: CARTAS =====
function revealCard(){
  const p = players[currentPlayer];
  $('cardButton').innerText = (p.role === 'Impostor')
    ? '¡Eres el impostor!'
    : `La palabra es: ${p.word}`;
  $('cardButton').onclick = nextPlayer;
}

function nextPlayer(){
  currentPlayer++;
  if(currentPlayer >= playerCount){
    goToEndScreen();
    return;
  }
  $('playerLabel').innerText = players[currentPlayer].name;
  $('cardButton').innerText = 'Ver carta';
  $('cardButton').onclick = revealCard;
}

// ===== FLUJO: FINAL =====
function goToEndScreen(){
  hide('screen-game');
  show('screen-end');
}

// ===== RESET =====
function resetGame(){
  // limpiar estado
  words = [];
  players = [];
  currentPlayer = 0;
  playerCount = 0;
  impostorCount = 1;
  impostors = [];
  selectedCategories.clear();

  // limpiar UI
  $('wordList').innerText = '';
  $('wordInput').value = '';
  $('playerCount').value = '';
  $('impostorCount').value = '';

  // reactivar botones de categorías
  const btnF = $('btn-futbolistas');
  if(btnF){ btnF.disabled = false; btnF.textContent = '⚽ Futbolistas'; }

  hide('screen-end');
  hide('screen-game');
  show('screen-setup');
}

// Exponer funciones al scope global (para los onclick del HTML)
window.selectCategory = selectCategory;
window.addWord = addWord;
window.startGame = startGame;
window.revealCard = revealCard;
window.nextPlayer = nextPlayer;
window.resetGame = resetGame;
