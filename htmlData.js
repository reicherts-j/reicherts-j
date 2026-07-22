function js(fn) {
  const s = fn.toString();
  return s.slice(s.indexOf('{') + 1, s.lastIndexOf('}'));
}

const htmlData = [
  {
    category: `Games`,
    title: `Cheat Detection`,
    HTML: `<div id='gameArea'>
<div id='leekObj'></div>
	<div class='text'id='leekText'></div>
	<div id='upgradeContainer'>
		<div class='upg text'id='gardeners'></div>
		<div class='upg text'id='shoppers'></div>
		<div class='upg text'id='massproduction'></div>
	</div>
</div>`,
    CSS: `*{
	user-select: none;
}


#leekObj {
	background-image: url('https://pngimg.com/uploads/leek/leek_PNG26.png');
  height: 180px;
	width: 300px;
  background-size: contain;
	background-repeat: no-repeat;
	border: solid 4px white;
	border-radius: 8px;
	margin: auto;
	margin-top: 40px;
	background-color: #f1ffef;
	cursor: pointer;
}

#gameArea {
	background-color: #abc9a7;
	height: 500px;
	width: 700px;
	transform: translate(-50%, -50%);
	position: absolute;
	top: 50%;
	left: 50%;
}

#leekText {
	font-size: 45px;
	margin-top: 20px;
}

.text {
	color: white;
	text-align: center;
	font-weight: bolder;
}

.upg {
	padding: 5px;
	border: solid 3px white;
	border-radius: 4px;
	margin: 5px;
	width: 200px;
	cursor: pointer;
}

#upgradeContainer {
	display: grid;
	place-items: center;
}

.upg:hover {
	transform: translate(0, 4px);
	transition-duration: 100ms;
	border-left: none;
	border-right: none;
}`,
    JS: js(()=>{const GAME = {
	leeks: 0,
	lps: 0,
	lpc: 1,
	upgrades: [
		{
			id: "gardeners",
			label: "Gardener",
			baseCost: 25,
			cost: 25,
			gain: (state) => Math.floor(state.lpc * randomFactor(1.2, 0.2) + 1),
			priceGrowth: (cost) => Math.floor(cost * randomFactor(2, 0.2) + 0)
		},
		{id: "shoppers",
      label: "Shopper",
      baseCost: 50,
      cost: 50,
      gain: (state) => (state.lps !== 0 ? Math.floor(state.lps * randomFactor(1.2, 0.2) + 1) : 1),
      priceGrowth: (cost) => Math.floor(cost * randomFactor(2, 0.2) + 0)
    },
    {
      id: "massproduction",
      label: "Mass Production",
      baseCost: 80,
      cost: 80,
      gain: (state) => (state.lps !== 0 ? Math.floor(state.lps * randomFactor(2.4, 0.4) + 1) : 1),
      priceGrowth: (cost) => Math.floor(cost * randomFactor(4, 0.2) + 0)
    }
  ]
};

function randomFactor(base, spread) {
	return base + Math.random() * spread;
}

function initUpgradeButtons() {
	upgradeContainer.innerHTML = '';
	GAME.upgrades.forEach((up) => {
		const btn = document.createElement('div');
		btn.id = up.id;
		btn.dataset.upgradeId = up.id;
		btn.textContent = `${up.label} | cost: ${up.cost}`;
		btn.classList.add('upg', 'text');
		upgradeContainer.appendChild(btn);
		btn.addEventListener('click', () => handleBuy(up.id));
	});
}

function updateUI() {
	leekText.textContent = `You have ${GAME.leeks} leeks`;
	GAME.upgrades.forEach((up) => {
		const btn = document.getElementById(up.id);
		if (btn) btn.textContent = `${up.label} | cost: ${up.cost}`;
	});
}

function handleBuy(upgradeId) {
	const up = GAME.upgrades.find((u) => u.id === upgradeId);
	if (!up) return false;
	if (GAME.leeks < up.cost) return false;
	
	const gain = up.gain(GAME);
	switch (up.id) {
		case "gardeners":
			GAME.lpc += gain;
			break;
		case "shoppers":
			GAME.lps += gain;
			break;
		case "massproduction":
			GAME.lps += gain;
			break;
		default:
			break;
	}
	
	GAME.leeks -= up.cost;
	up.cost = up.priceGrowth(up.cost);
	updateUI();
	return true;
}

var aTen = 0;
var isC = false;

leekObj.addEventListener('click', () => {
	if (!isC) {
	GAME.leeks += GAME.lpc;
	aTen++;
	console.log(aTen);
	updateUI();
	} else {
		GAME.leeks = 0;
		leekText.textContent = 'No cheating!!';
	clearInterval(updateFrame);
	}
});

var updateFrame = setInterval(function() {
	GAME.leeks += GAME.lps;
	if (aTen >= 15) {isC = true};
	aTen = 0;
	updateUI();
}, 1000);

initUpgradeButtons();
updateUI();})
  },
  {
    category: `Games`,
    title: `Pokemon Simulator`,
    HTML: `<html lang="en">

<body>

  <div id="gameArea">
    <div id="tileWrapper"></div>
    <div id="playerChar"></div>
    <div id="pokemonMenu">

      <div id="menuHeader"></div>

      <div id="pokedexListContainer"></div>
      <div id="seePokedex" class="option">Pokédex</div>

      <div id="pokemonListContainer"></div>
      <div id="seePokemon" class="option">Pokémon</div>

      <div id="bagListContainer"></div>
      <div id="seeBag" class="option">Bag</div>

      <div id="saveOption" class="option">Save</div>

      <div id="loadOption" class="option">Load</div>

      <div id="openMenu" class="option">ᐯ</div>

    </div>
  </div>

  <div id="battleArea">
    <img id="opposingPokemon"></img>

    <div id="opposingPokemonStats">

      <div id="oppoPokeName"></div>
      <div id="oppoPokeLevel"></div>
      <div id="oppoStatusCircle"></div>
      <div id="oppoHealthBarContainer">
        <div id="oppoIndent">HP</div>
        <div id="oppoHealthBar">
          <div id="oppoHealthFill"></div>
        </div>
      </div>
    </div>

    <img id="userPokemon" src=""></img>

    <div id="userPokemonStats">

      <div id="userPokeName"></div>
      <div id="userPokeLevel"></div>
      <div id="userStatusCircle"></div>
      <div id="userHealthBarContainer">
        <div id="userIndent">HP</div>
        <div id="userHealthBar">
          <div id="userHealthFill"></div>
        </div>
      </div>
      <div id="userHealthInt"></div>
    </div>

    <div id="battleUIContainer">

      <div id="eventContainer"></div>

      <div id="userChoiceUI">
        <div class="option optionOne" id="battleOption"><span>Fight</span></div>

        <div class="option optionOne" id="bagOption"><span>Bag</span></div>

        <div class="option optionOne" id="pokemonOption"><span>Pokémon</span></div>

        <div class="option optionOne" id="runOption"><span>Run</span></div>

        <div id='moveContainer'></div>

        <div id='bagContainer'></div>

        <div id='pokemonContainer'></div>

        <div class="option" id="backOption"><span>Back</span></div>

      </div>

    </div>

  </div>
</body>

</html>`,
    CSS: `* {
  background-size: contain;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  font-family: Arial, Helvetica, sans-serif;
}

body {
  background-color: #111;
  overflow: hidden;
}

:root {
  --oneColor: #1f333a;
  --groundColor: #73caa2;
  --areaBorder: #e5d4ef;
  --charColor: #e5d4ef;
  --areaWidth: 0px;
  --areaHeight: 0px;
  --animationReverse: normal;
  --animationFill: forwards;
  --barFillColorUser: #5cff85;
  --barFillColorOppo: #5cff85;
  --colorRed: #d33;
  --colorBlue: #66c;
  --colorGreen: #3c6;
  --colorYellow: #f7d02c;
  --backgroundMain: #EDEDE9;
  --opponentScale: 2.2;
  --userScale: 2.2;
  --userBottom: 200px; 
}

#gameArea,
#battleArea,
#pokemonMenu {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1.1);
  width: var(--areaWidth);
  height: var(--areaHeight);
  border: solid 5px var(--areaBorder);
  background-color: var(--groundColor);
  border-radius: 2px;
  z-index: 0;
}


#battleArea {
  margin: 0 auto;
  overflow: hidden;
  user-select: none;
  opacity: 0;
  background-color: var(--backgroundMain);
  pointer-events: none;
}

#pokemonMenu {
  z-index: 1;
  width: 25%;
  height: fit-content;
  left: 100%;
  background-color: #fff;
  border: solid 5px #1f333a;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 10px;
  gap: 10px;
  transition-duration: 500ms;
  user-select: none;
  z-index: 15;
  max-height: 540px;
  min-height: 340px;
}

#pokemonMenu .option {
  color: #fff;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  border-radius: 4px;
  font-size: 1em;
  letter-spacing: 1px;
  background-color: #1f333a;
}

#menuHeader {
  display: none;
  color: #1f333a;
  text-align: center;
  border-bottom: solid 6px #1f333a;
  padding: 6px 8px;
  border-radius: 6px;
  font-size: 25px;
  font-weight: bolder;
  letter-spacing: 1px;
}

#pokemonListContainer,
#bagListContainer,
#pokedexListContainer {
  width: 100%;
  flex-direction: column;
  display: none;
  max-height: 400px;
  overflow: scroll;
}

#pokemonListContainer .option,
#bagListContainer .option,
#pokedexListContainer .option {
  width: 50%;
  text-align: left;
  padding: 8px 15px;
  cursor: auto;
  border: none;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  transition: all 500ms ease;
}

#pokemonListContainer .option:hover,
#bagListContainer .option:hover,
#pokedexListContainer .option:hover {
  transform: translateY(0px);
}

.pokeWrapper {
  display: flex;
  align-items: center;
  padding: 2px;
  box-sizing: border-box;
  width: 100%;
  z-index: 10;
  transition: transform 0.4s ease, opacity 0.4s ease;
}

.pokeInfo,
.promoteDiv {
  background-color: #007bff;
  color: white;
  padding: 8px 15px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s ease;
  flex-shrink: 0;
  white-space: nowrap;
}

#pokedexListContainer .pokeInfo {
  border-radius: 4px;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
}

.pokeInfo:hover {
  background-color: #0056b3;
}

.promoteDiv {
  border-radius: 4px;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  background-color: var(--colorGreen);
}

.promoteDiv:hover {
  background-color: color-mix(in srgb, var(--colorGreen) 70%, black);
}

#moveContainer,
#bagContainer,
#pokemonContainer {
  display: none;
  z-index: 1000;
  width: 100%;
  grid-template-columns: repeat(2, auto);
  grid-column: 1 / -1;
  gap: 4px;
}

.option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-radius: 12px;
  color: white;
  white-space: nowrap;
  overflow-y: hidden;
  font-weight: bold;
  font-size: 24px;
  border: 3px solid transparent;
  cursor: pointer;
  position: relative;
  border-bottom: solid 6px #222;
  transition: transform 50ms ease, border-bottom-color 50ms ease;
}

.option:hover {
  transform: translateY(4px);
  border-bottom-color: transparent;
}

.option span {
  pointer-events: none;
}

#openMenu {
  height: 5px;
  padding: 6px 8px;
  overflow: hidden;
  justify-content: center;
}

#battleOption {
  border-color: var(--colorRed);
  color: var(--colorRed);
  background-color: color-mix(in srgb, var(--colorRed) 10%, white);
}

#pokemonOption {
  border-color: var(--colorGreen);
  color: var(--colorGreen);
  background-color: color-mix(in srgb, var(--colorGreen) 10%, white);
}

#bagOption {
  border-color: var(--colorYellow);
  color: var(--colorYellow);
  background-color: color-mix(in srgb, var(--colorYellow) 10%, white);
}

#runOption {
  border-color: var(--colorBlue);
  color: var(--colorBlue);
  background-color: color-mix(in srgb, var(--colorBlue) 10%, white);
}

#backOption {
  border-color: var(--colorBlue);
  color: var(--colorBlue);
  background-color: color-mix(in srgb, var(--colorBlue) 10%, white);
  display: none;
}

#opposingPokemon,
#userPokemon {
  position: absolute;
  width: 124px;
  height: 124px;
  z-index: 10;
}

#opposingPokemon {
  top: 55px;
  right: 126px;
  transform: scale(var(--opponentScale));
}

#userPokemon {
  bottom: var(--userBottom);
  left: 126px;
  transform: scale(var(--userScale));
}

#battleUIContainer {
  height: 180px;
  width: 100%;
  bottom: 0px;
  display: flex;
  flex-direction: row;
  z-index: 11;
  position: absolute;
  color: #1f333a;
  box-sizing: border-box;
  background-color: #1f333a;
}

#battleUIContainer span {
  /*color for span elements*/
  user-select: none;
}

#userChoiceUI {
  order: 2;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  padding: 8px;
  overflow-x: scroll;
  background-color: color-mix(in srgb, #1f333a 90%, white);
}

#userChoiceUI .option {
  border-radius: 0px;
}

#eventContainer,
#userChoiceUI {
  width: 50%;
  border: solid 12px #1f333a;
}

#eventContainer {
  order: 1;
  border-right: none;
  overflow: hidden;
  font-weight: bold;
  font-size: 26px;
  letter-spacing: 0.15px;
  z-index: 11;
  text-align: left;
  padding: 14px 14px;
  color: #1f333a;
  background-color: var(--backgroundMain);
}

#battleUIContainer.flipped #eventContainer {
  border-left: none;
  order: 2;
  width: 40%;
}

#battleUIContainer.flipped #userChoiceUI {
  order: 1;
  width: 60%;
}

#userPokemonStats,
#opposingPokemonStats {
  border: 4px solid #1f333a;
  border-radius: 10px;
  width: 35%;
  height: 75px;
  font-weight: bold;
  color: #1f333a;
  position: absolute;
  border: solid 4px #1f333a;
  background-color: var(--backgroundMain);
}

#userPokemonStats {
  bottom: 200px;
  right: 18px;
}

#opposingPokemonStats {
  top: 20px;
  left: 18px;
  height: 60px;
  z-index: 11;
}

#userPokeName,
#oppoPokeName {
  display: inline-block;
  font-size: 22px;
  margin-top: 5px;
  margin-left: 10px;
}

#userHealthInt {
  font-size: 22px;
  display: inline-flex;
  position: absolute;
  margin-top: 5px;
  right: 5px;
  bottom: 0px;
}

#userPokeLevel,
#oppoPokeLevel {
  margin-top: 5px;
  font-size: 22px;
  display: inline-flex;
  position: absolute;
  right: 5px;
  top: 0px;
}

#userStatusCircle,
#oppoStatusCircle {
  width: calc(35% - 24px - 5px);
  height: 10px;
  padding: 2px;
  border-radius: 5px;
  background-color: purple;
  bottom: 10px;
  left: 10px;
  font-size: 15px;
  font-weight: bolder;
  position: absolute;
  color: white;
  align-items: center;
  text-align: center;
  justify-content: center;
  display: none;
}

#userStatusCircle {
  bottom: 25px;
}

#userHealthBarContainer,
#oppoHealthBarContainer {
  background-color: #1f333a;
  border-radius: 5px;
  width: 65%;
  height: 10px;
  padding-right: 5px;
  padding: 2px;
  display: flex;
  align-items: center;
  position: absolute;
  right: 5px;
  bottom: 25px;
}

#oppoHealthBarContainer {
  bottom: 10px;
}

#userIndent,
#oppoIndent {
  font-size: 15px;
  font-weight: bolder;
  color: rgb(255, 104, 104);
  overflow: hidden;
  padding: 0 4px;
  margin: 0;
}

#userHealthBar,
#oppoHealthBar {
  flex-grow: 1;
  position: relative;
  height: 100%;
  background-color: #333;
  display: flex;
  border-radius: 3px;
  border: none;
}

#userHealthFill,
#oppoHealthFill {
  border: solid 2px var(--backgroundMain);
  height: 65%;
  width: 100%;
  border-radius: 3px;
  position: relative;
  transition: width 0.3s ease-in-out;
}

#userHealthFill {
  background: linear-gradient(45deg,
      color-mix(in srgb, var(--barFillColorUser) 80%, black),
      var(--barFillColorUser)),
    color-mix(in srgb, var(--barFillColorUser) 80%, white);
}

#oppoHealthFill {
  background: linear-gradient(45deg,
      color-mix(in srgb, var(--barFillColorOppo) 80%, black),
      var(--barFillColorOppo)),
    color-mix(in srgb, var(--barFillColorOppo) 80%, white);
}

#playerChar {
  position: absolute;
  background-color: var(--charColor);
  border-radius: 10px;
  transform: scale(0.8);
  z-index: 10;
  transition-duration: 10ms;
}

obj {
  position: absolute;
  width: 50px;
  height: 50px;
  background-color: transparent;
}

.gameAreaEnc {
  animation: encGameArea 350ms linear var(--animationReverse) 1;
  animation-fill-mode: var(--animationFill);
}

.battleAreaEnc {
  animation: encBattleArea 350ms linear var(--animationReverse) 1;
  animation-fill-mode: forwards;
}

@keyframes encGameArea {
  100% {
    top: 200%;
    opacity: 1;
  }
}

@keyframes encBattleArea {
  0% {
    top: -100%;
    opacity: 0;
  }

  100% {
    top: 50%;
    opacity: 1;
  }
}

.movingToTop {
  animation: slideUp 0.4s ease forwards;
}

@keyframes slideUp {
  0% {
    transform: translateY(0);
    z-index: 10;
  }

  50% {
    transform: translateY(-20px);
    z-index: 11;
  }

  100% {
    transform: translateY(0);
    z-index: 10;
  }
}`,
    JS: js(()=>{class MOVE {
    constructor(NAME, TYPE, POWER, ACC, { statusEffect = null, statChange = null, miscEffect = null } = {}) {
        this.NAME = NAME;
        this.TYPE = TYPE;
        this.POWER = POWER;
        this.ACC = ACC;
        this.statusEffect = statusEffect;
        this.statChange = statChange;
        this.miscEffect = miscEffect;
    }
}

var playerCharInfo = {
    NAME: '',
    pokemonTeam: [],
    lastActivePokemon: null,
    playerInventory: {
        pokeballs: 50,
        potions: 50
    }
};
const bagContentColors = {
    pokeballs: '#d33',
    potions: '#f7d02c'
}
const gameAreas = [
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 2, 2, 1, 1, 2, 2, 2, 0, 1, 2, 2, 1],
        [1, 1, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2, 2, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1],
        [1, 2, 0, 3, 0, 1, 0, 0, 2, 2, 0, 0, 0, 4],
        [1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 2, 2, 2, 1, 0, 0, 1],
        [1, 1, 0, 0, 0, 2, 2, 2, 2, 1, 1, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 1, 2, 2, 0, 0, 0, 1, 1],
        [1, 0, 0, 0, 0, 1, 1, 2, 2, 2, 0, 1, 1, 1],
        [1, 2, 1, 0, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    [
        [1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 3, 0, 1, 1, 2, 2, 2, 1, 2, 1, 0, 1],
        [1, 1, 2, 0, 0, 0, 0, 2, 2, 1, 2, 0, 2, 1],
        [1, 2, 0, 0, 0, 0, 0, 2, 1, 1, 2, 2, 2, 1],
        [4, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 2, 1],
        [1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 2, 1],
        [1, 1, 1, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 1],
        [1, 1, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 1, 1],
        [1, 2, 0, 0, 2, 1, 1, 2, 1, 2, 0, 2, 1, 1],
        [1, 1, 2, 0, 2, 1, 1, 2, 1, 0, 0, 2, 1, 1],
        [1, 1, 1, 0, 2, 1, 1, 1, 2, 2, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
]

//1 = WALL
//2 = BUSH
//3 = PLAYER SPAWN
//4 = NEW ROOM

var currentRoom = 0;
var areaData = gameAreas[currentRoom];

const areaWidth = areaData[0].length;
const areaHeight = areaData.length;

const areaScale = 50;

var playerCoords = [0, 0];

function setLeft(id, x) {
    document.getElementById(id).style.left = (areaScale * x) + "px";
}

function setTop(id, y) {
    document.getElementById(id).style.top = (areaScale * y) + "px";
}

function drawArea() {
    for (var y = 0; y < areaHeight; y++) {
        for (var x = 0; x < areaWidth; x++) {
            var newEle = document.createElement("obj");
            document.getElementById("tileWrapper").appendChild(newEle);
            var divId = "tile-" + x + "-" + y;
            newEle.setAttribute("id", divId);
            setLeft(divId, x);
            setTop(divId, y);
            if (areaData[y][x] === 1) {
                document.getElementById(divId).style.backgroundColor = "#1f333a"
            } else if (areaData[y][x] === 2) {
                document.getElementById(divId).style.backgroundColor = "green"
            } else if (areaData[y][x] === 0) {
            } if (areaData[y][x] == 3) {
                playerCoords = [x, y];
            }
        }
    }
}

function setGame() {
    setLeft('playerChar', playerCoords[0]);
    setTop('playerChar', playerCoords[1]);

    document.documentElement.style.setProperty('--areaWidth', areaWidth * areaScale + "px");
    document.documentElement.style.setProperty('--areaHeight', areaHeight * areaScale + "px");
    playerChar.style.width = areaScale + "px";
    playerChar.style.height = areaScale + "px";
}

drawArea();
setGame();

document.addEventListener('keydown', function (e) {
    reposX = playerCoords[0];
    reposY = playerCoords[1];

    if (e.key === 'ArrowLeft') {
        reposX--;
    } else if (e.key === 'ArrowRight') {
        reposX++;
    } else if (e.key === 'ArrowUp') {
        reposY--;
    } else if (e.key === 'ArrowDown') {
        reposY++;
    }

    const inBounds = reposY >= 0 && reposY < areaHeight && reposX >= 0 && reposX < areaWidth;
    const TILE = inBounds ? areaData[reposY][reposX] : undefined;

    window.beginBattleBoolean = false;

    if (inBounds && TILE !== 1 && TILE !== undefined && !window.encounterActive) {
        playerCoords = [reposX, reposY];
        setLeft("playerChar", reposX);
        setTop("playerChar", reposY);

        if (window.beginBattleBoolean === false && TILE === 2) {
            const randNum = Math.random()
            const percChanceEncounter = 30;
            randNum * 100 >= 100 - percChanceEncounter ? window.beginBattleBoolean = true : window.beginBattleBoolean = false;
        }

    }

    if (areaData[reposY] && areaData[reposY][reposX] === 4) {
        let exitOffset = [reposX, reposY];
        currentRoom === 0 ? currentRoom++ : currentRoom--;
        areaData = gameAreas[currentRoom];
        document.getElementById("tileWrapper").innerHTML = '';
        drawArea();
        for (let y = 0; y < areaHeight; y++) {
            for (let x = 0; x < areaWidth; x++) {
                if (areaData[y][x] === 4) {
                    if (x === exitOffset[0] || y === exitOffset[1]) {
                        playerCoords = [x, y];
                        break;
                    }
                }
            }
        }
        setGame();
    }
});
const moveList = [
    new MOVE("Scratch", "N", 40, 95), //0
    new MOVE("Ember", "F", 40, 100, { statusEffect: { TYPE: 'BURN', CHANCE: 10 } }), //1
    new MOVE("Vine Whip", "G", 45, 100), //2
    new MOVE("Water Gun", "W", 40, 100), //3
    new MOVE("Thunder Shock", "E", 40, 100, { statusEffect: { TYPE: 'PARALYZE', CHANCE: 10 } }), //4
    new MOVE("Swift", "N", 60, Infinity), //5
    new MOVE("Tackle", "N", 40, 100), //6
    new MOVE("Peck", "A", 35, 100), //7
    new MOVE("Bite", "D", 60, 100, { statusEffect: { TYPE: 'FLINCH', CHANCE: 30 } }), //8
    new MOVE("Bug Bite", "B", 60, 100), //9
    new MOVE("Fire Fang", "F", 65, 95, { statusEffect: { TYPE: 'BURN', CHANCE: 10 } }), //10
    new MOVE("Slash", "N", 70, 100), //11
    new MOVE("Spark", "E", 65, 100, { statusEffect: { TYPE: 'PARALYZE', CHANCE: 30 } }), //12
    new MOVE("Iron Tail", "S", 100, 75, { statChange: { TARGET: 'OPPONENT', STAT: ["DEFENSE"], STAGES: -1, CHANCE: 30 } }), //13
    new MOVE("Flare Blitz", "F", 120, 100), //14
    new MOVE("Volt Tackle", "E", 120, 100), //15
    new MOVE("Air Slash", "A", 75, 95), //16
    new MOVE("Thunder", "E", 110, 70, { statusEffect: { TYPE: 'PARALYZE', CHANCE: 30 } }), //17
    new MOVE("Flamethrower", "F", 90, 100), //18
    new MOVE("Thunder Punch", "E", 75, 100, { statusEffect: { TYPE: 'PARALYZE', CHANCE: 10 } }), //19
    new MOVE("Razor Leaf", "G", 55, 95), //20
    new MOVE("Water Pulse", "W", 60, 100), //21
    new MOVE("Hydro Pump", "W", 110, 80), //22
    new MOVE("Solar Beam", "G", 120, 100), //23
    new MOVE("Surf", "W", 90, 100), //24
    new MOVE("Sludge Bomb", "P", 90, 100, { statusEffect: { TYPE: 'POISON', CHANCE: 30 } }), //25
    new MOVE("Take Down", "N", 90, 85), //26
    new MOVE("Venoshock", "P", 65, 100), //27
    new MOVE("Aqua Tail", "W", 90, 90), //28
    new MOVE("Drill Peck", "A", 80, 100), //29
    new MOVE("Assurance", "D", 60, 100), //30
    new MOVE("Drill Run", "g", 80, 95), //31
    new MOVE("Psybeam", "p", 65, 100), //32
    new MOVE("Bug Buzz", "B", 90, 100), //33
    new MOVE("Poison Sting", "P", 15, 100, { statusEffect: { TYPE: 'POISON', CHANCE: 30 } }), //34
    new MOVE("X-Scissor", "B", 80, 100), //35
    new MOVE("Gunk Shot", "P", 120, 80), //36
    new MOVE("Thunder Fang", "E", 65, 95, { statusEffect: { TYPE: 'PARALYZE', CHANCE: 10 } }), //37
    new MOVE("Swords Dance", "N", 0, Infinity, { statChange: { TARGET: "SELF", STAT: ["ATTACK"], STAGES: 2, CHANCE: 100 } }), //38
    new MOVE("Growl", "N", 0, 100, { statChange: { TARGET: "OPPONENT", STAT: ["ATTACK"], STAGES: -1, CHANCE: 100 } }), //39
    new MOVE("Teleport", "p", 0, Infinity, { miscEffect: { TYPE: "TELEPORT" } }), //40
    new MOVE("U-turn", "B", 70, 100, { miscEffect: { TYPE: "U_TURN" } }), //41
    new MOVE("Smokescreen", "N", 0, 100, { statChange: { TARGET: "OPPONENT", STAT: ["ACCURACY"], STAGES: -1, CHANCE: 100 } }), //42
    new MOVE("Tail Whip", "N", 0, 100, { statChange: { TARGET: "OPPONENT", STAT: ["DEFENSE"], STAGES: -1, CHANCE: 100 } }), //43
    new MOVE("Charm", "f", 0, 100, { statChange: { TARGET: "OPPONENT", STAT: ["ATTACK"], STAGES: -2, CHANCE: 100 } }), //44
    new MOVE("Recover", "N", 0, Infinity, { miscEffect: { TYPE: "HEAL" } }), //45
    new MOVE("Calm Mind", "p", 0, Infinity, { statChange: { TARGET: "SELF", STAT: ["ATTACK", "DEFENSE"], STAGES: 1, CHANCE: 100 } }), //46
    new MOVE("Psychic", "p", 90, 100, { statChange: { TARGET: "OPPONENT", STAT: ["DEFENSE"], STAGES: -1, CHANCE: 10 } }), //47
    new MOVE("Psycho Cut", "p", 70, 100), //48
    new MOVE("Defense Curl", "N", 0, Infinity, { statChange: { TARGET: "SELF", STAT: ["DEFENSE"], STAGES: 1, CHANCE: 100 } }), //49
    new MOVE("Sand Attack", "g", 0, 100, { statChange: { TARGET: "OPPONENT", STAT: ["ACCURACY"], STAGES: -1, CHANCE: 100 } }), //50
    new MOVE("Earthquake", "g", 100, 100), //51
    new MOVE("Fury Cutter", "B", 40, 95), //52
    new MOVE("Bulldoze", "g", 60, 100, { statChange: { TARGET: "OPPONENT", STAT: ["SPEED"], STAGES: -1, CHANCE: 100 } }), //53
    new MOVE("Poison Powder", "P", 0, 75, { statusEffect: { TYPE: 'POISON', CHANCE: 100 } }), //54
    new MOVE("Leech Life", "B", 80, 100, { miscEffect: { TYPE: "HEAL" } }), //55
    new MOVE("Zen Headbutt", "p", 80, 90, { statusEffect: { TYPE: 'FLINCH', CHANCE: 20 } }), //56
    new MOVE("Sleep Powder", 'G', 0, 75, { statusEffect: { TYPE: 'SLEEP', CHANCE: 100 } }), //57
    new MOVE("Growth", "N", 0, Infinity, { statChange: { TARGET: "SELF", STAT: ["ATTACK"], STAGES: 1, CHANCE: 100 } }), //58
    new MOVE("Acid", "P", 40, 100, { statChange: { TARGET: "OPPONENT", STAT: ["DEFENSE"], STAGES: -1, CHANCE: 10 } }), //59
    new MOVE("Power Whip", "G", 120, 85), //60
    new MOVE("Poison Jab", "P", 80, 100, { statusEffect: { TYPE: "POISON", CHANCE: 30 } }) //61
];

// Attacker > Defender
const typeChart = {
    // FIRE
    F: {
        G: 2, B: 2, S: 2, F: 0.5, W: 0.5,
        N: 1, E: 1, D: 1, f: 1, g: 1, A: 1, P: 1, p: 1
    },

    // GRASS
    G: {
        W: 2, g: 2,
        F: 0.5, G: 0.5, P: 0.5, A: 0.5, B: 0.5, S: 0.5,
        N: 1, E: 1, D: 1, f: 1, p: 1
    },

    // WATER
    W: {
        F: 2, g: 2,
        W: 0.5, G: 0.5,
        N: 1, E: 1, D: 1, f: 1, A: 1, B: 1, S: 1, P: 1, p: 1
    },

    // NORMAL
    N: {
        S: 0.5,
        F: 1, G: 1, W: 1, N: 1, E: 1, D: 1, f: 1, g: 1, A: 1, B: 1, P: 1, p: 1
    },

    // ELECTRIC
    E: {
        W: 2, A: 2,
        E: 0.5, G: 0.5, g: 0,
        F: 1, N: 1, D: 1, f: 1, B: 1, S: 1, P: 1, p: 1
    },

    // DARK
    D: {
        p: 2,
        D: 0.5, f: 0.5,
        F: 1, G: 1, W: 1, N: 1, E: 1, g: 1, A: 1, B: 1, S: 1, P: 1
    },

    // FAIRY
    f: {
        D: 2,
        F: 0.5, P: 0.5, S: 0.5,
        N: 1, G: 1, W: 1, E: 1, g: 1, A: 1, B: 1, p: 1
    },

    // GROUND
    g: {
        F: 2, E: 2, P: 2, S: 2,
        G: 0.5, B: 0.5, A: 0,
        N: 1, W: 1, D: 1, f: 1, g: 1, p: 1
    },

    // FLYING
    A: {
        G: 2, B: 2,
        E: 0.5, S: 0.5,
        F: 1, W: 1, N: 1, D: 1, f: 1, g: 1, A: 1, P: 1, p: 1
    },

    // BUG
    B: {
        G: 2, p: 2, D: 2,
        F: 0.5, P: 0.5, A: 0.5, S: 0.5, f: 0.5,
        N: 1, W: 1, E: 1, g: 1, B: 1
    },

    // STEEL
    S: {
        f: 2,
        F: 0.5, W: 0.5, E: 0.5, S: 0.5,
        N: 1, G: 1, g: 1, A: 1, B: 1, D: 1, P: 1, p: 1
    },

    // POISON
    P: {
        G: 2, f: 2,
        P: 0.5, g: 0.5, S: 0,
        F: 1, W: 1, N: 1, E: 1, D: 1, A: 1, B: 1, p: 1
    },

    // PSYCHIC
    p: {
        P: 2,
        S: 0.5, D: 0,
        F: 1, G: 1, W: 1, N: 1, E: 1, f: 1, g: 1, A: 1, B: 1, p: 0.5
    }
};

const typeColors = {
    F: '#d33',
    W: '#66c',
    G: '#3c6',
    E: '#f7d02c',
    D: '#775544',
    f: '#ee99ee',
    g: '#ddbb55',
    A: '#8899ff',
    B: '#aabb22',
    S: '#aaaabb',
    P: '#aa5599',
    p: '#ff5599',
    N: '#b2b6ba',
    I: '#66ccff'
};

const pokemonData = [
    {
        NAME: "Charmander",
        TYPE: ["F"],
        LEVEL: 3,
        XP: 0,
        ATTACK: 52,
        DEFENSE: 43,
        SPEED: 65,
        HP: 39,
        MOVES: [moveList[0], moveList[1], moveList[42]],
    },
    {
        NAME: "Bulbasaur",
        TYPE: ["G"],
        LEVEL: 3,
        XP: 0,
        ATTACK: 49,
        DEFENSE: 49,
        SPEED: 45,
        HP: 45,
        MOVES: [moveList[6], moveList[2], moveList[39]],
        BOTTOM: 180
    },
    {
        NAME: "Squirtle",
        TYPE: ["W"],
        LEVEL: 3,
        XP: 0,
        ATTACK: 48,
        DEFENSE: 65,
        SPEED: 43,
        HP: 44,
        MOVES: [moveList[6], moveList[3], moveList[43]],
    },
    {
        NAME: "Pikachu",
        TYPE: ["E"],
        LEVEL: 3,
        XP: 0,
        ATTACK: 55,
        DEFENSE: 40,
        SPEED: 90,
        HP: 35,
        MOVES: [moveList[0], moveList[4]],
    },
    {
        NAME: "Eevee",
        TYPE: ["N"],
        LEVEL: 3,
        XP: 0,
        ATTACK: 55,
        DEFENSE: 50,
        SPEED: 55,
        HP: 55,
        MOVES: [moveList[5], moveList[6]],
    },
    {
        NAME: "Spearow",
        TYPE: ["A", "N"],
        LEVEL: 3,
        XP: 0,
        ATTACK: 60,
        DEFENSE: 30,
        SPEED: 70,
        HP: 40,
        MOVES: [moveList[0], moveList[7]], //5 from 0; 6 from 1
    },
    {
        NAME: "Caterpie",
        TYPE: ["B"],
        LEVEL: 3,
        XP: 0,
        ATTACK: 30,
        DEFENSE: 35,
        SPEED: 45,
        HP: 45,
        MOVES: [moveList[6], moveList[9]], //6
    },
    {
        NAME: "Weedle",
        TYPE: ["B", "P"],
        LEVEL: 3,
        XP: 0,
        ATTACK: 35,
        DEFENSE: 30,
        SPEED: 50,
        HP: 40,
        MOVES: [moveList[34], moveList[9]], //7
    },
    {
        NAME: "Ekans",
        TYPE: ["P"],
        LEVEL: 3,
        XP: 0,
        ATTACK: 60,
        DEFENSE: 44,
        SPEED: 55,
        HP: 35,
        MOVES: [moveList[34], moveList[8]], //8
    },
    {
        NAME: "Abra",
        TYPE: ["p"],
        LEVEL: 3,
        XP: 0,
        ATTACK: 105,
        DEFENSE: 55,
        SPEED: 90,
        HP: 25,
        MOVES: [moveList[40]], //9
    },
    {
        NAME: "Sandshrew",
        TYPE: ["g"],
        LEVEL: 3,
        XP: 0,
        ATTACK: 75,
        DEFENSE: 85,
        SPEED: 40,
        HP: 50,
        MOVES: [moveList[0], moveList[49]], //10
    },
    {
        NAME: "Venonat",
        TYPE: ["P", "B"],
        LEVEL: 3,
        XP: 0,
        ATTACK: 55,
        DEFENSE: 50,
        SPEED: 45,
        HP: 60,
        MOVES: [moveList[6], moveList[54]], //11
    },
    {
        NAME: "Bellsprout",
        TYPE: ["G", "P"],
        LEVEL: 3,
        XP: 0,
        ATTACK: 75,
        DEFENSE: 35,
        SPEED: 40,
        HP: 50,
        MOVES: [moveList[2], moveList[58]],
    },
    {
        NAME: "Weepinbell",
        TYPE: ["G", "P"],
        LEVEL: 21,
        XP: 0,
        ATTACK: 90,
        DEFENSE: 50,
        SPEED: 55,
        HP: 65,
        MOVES: [moveList[54], moveList[57], moveList[59]],
    },
    {
        NAME: "Victreebel",
        TYPE: ["G", "P"],
        LEVEL: 31,
        XP: 0,
        ATTACK: 105,
        DEFENSE: 65,
        SPEED: 70,
        HP: 80,
        MOVES: [moveList[57], moveList[60], moveList[61]],
    },
    {
        NAME: "Venomoth",
        TYPE: ["P", "B"],
        LEVEL: 31,
        XP: 0,
        ATTACK: 90,
        DEFENSE: 75,
        SPEED: 90,
        HP: 70,
        MOVES: [moveList[55], moveList[56], moveList[57]],
    },
    {
        NAME: "Sandslash",
        TYPE: ["g"],
        LEVEL: 22,
        XP: 0,
        ATTACK: 100,
        DEFENSE: 110,
        SPEED: 65,
        HP: 75,
        MOVES: [moveList[11], moveList[50], moveList[51]],
    },
    {
        NAME: "Kadabra",
        TYPE: ["p"],
        LEVEL: 16,
        XP: 0,
        ATTACK: 120,
        DEFENSE: 70,
        SPEED: 105,
        HP: 40,
        MOVES: [moveList[48], moveList[46], moveList[45]],
    },
    {
        NAME: "Alakazam",
        TYPE: ["p"],
        LEVEL: 32,
        XP: 0,
        ATTACK: 135,
        DEFENSE: 95,
        SPEED: 120,
        HP: 55,
        MOVES: [moveList[47], moveList[45], moveList[46]],
    },
    {
        NAME: "Charmeleon",
        TYPE: ["F"],
        LEVEL: 16,
        XP: 0,
        ATTACK: 64,
        DEFENSE: 58,
        SPEED: 80,
        HP: 58,
        MOVES: [moveList[11], moveList[18]],
    },
    {
        NAME: "Charizard",
        TYPE: ["F", "A"],
        LEVEL: 36,
        XP: 0,
        ATTACK: 84,
        DEFENSE: 78,
        SPEED: 100,
        HP: 78,
        MOVES: [moveList[11], moveList[14], moveList[16]],
    },
    {
        NAME: "Raichu",
        TYPE: ["E"],
        LEVEL: 20,
        XP: 0,
        ATTACK: 90,
        DEFENSE: 55,
        SPEED: 110,
        HP: 60,
        MOVES: [moveList[19], moveList[13], moveList[17]],
    },
    {
        NAME: "Ivysaur",
        TYPE: ["G", "P"],
        LEVEL: 16,
        XP: 0,
        ATTACK: 62,
        DEFENSE: 63,
        SPEED: 60,
        HP: 60,
        MOVES: [moveList[27], moveList[20]],
    },
    {
        NAME: "Venusaur",
        TYPE: ["G", "P"],
        LEVEL: 32,
        XP: 0,
        ATTACK: 82,
        DEFENSE: 83,
        SPEED: 80,
        HP: 80,
        MOVES: [moveList[23], moveList[25], moveList[26]],
    },
    {
        NAME: "Wartortle",
        TYPE: ["W"],
        LEVEL: 16,
        XP: 0,
        ATTACK: 63,
        DEFENSE: 80,
        SPEED: 58,
        HP: 59,
        MOVES: [moveList[8], moveList[21]],
    },
    {
        NAME: "Blastoise",
        TYPE: ["W"],
        LEVEL: 36,
        XP: 0,
        ATTACK: 83,
        DEFENSE: 100,
        SPEED: 78,
        HP: 79,
        MOVES: [moveList[8], moveList[22], moveList[28]],
    },
    {
        NAME: "Fearow",
        TYPE: ["A", "N"],
        LEVEL: 20,
        XP: 0,
        ATTACK: 90,
        DEFENSE: 65,
        SPEED: 100,
        HP: 65,
        MOVES: [moveList[31], moveList[29], moveList[30]],
    },
    {
        NAME: "Metapod",
        TYPE: ["B"],
        LEVEL: 7,
        XP: 0,
        ATTACK: 20,
        DEFENSE: 55,
        SPEED: 30,
        HP: 50,
        MOVES: [moveList[6], moveList[9]],
    },
    {
        NAME: "Butterfree",
        TYPE: ["B", "A"],
        LEVEL: 10,
        XP: 0,
        ATTACK: 90,
        DEFENSE: 80,
        SPEED: 70,
        HP: 60,
        MOVES: [moveList[32], moveList[33], moveList[16]],
    },
    {
        NAME: "Kakuna",
        TYPE: ["B", "P"],
        LEVEL: 7,
        XP: 0,
        ATTACK: 25,
        DEFENSE: 50,
        SPEED: 35,
        HP: 45,
        MOVES: [moveList[34], moveList[9]],
    },
    {
        NAME: "Beedrill",
        TYPE: ["B", "P"],
        LEVEL: 10,
        XP: 0,
        ATTACK: 90,
        DEFENSE: 40,
        SPEED: 75,
        HP: 65,
        MOVES: [moveList[30], moveList[35], moveList[27]],
    },
    {
        NAME: "Arbok",
        TYPE: ["P"],
        LEVEL: 22,
        XP: 0,
        ATTACK: 95,
        DEFENSE: 69,
        SPEED: 80,
        HP: 60,
        MOVES: [moveList[36], moveList[37], moveList[10]],
    }
];

const evolutionData = [
    {
        FROM: "Charmander",
        TO: "Charmeleon",
        LEVEL: 16
    },
    {
        FROM: "Charmeleon",
        TO: "Charizard",
        LEVEL: 36
    },
    {
        FROM: "Bulbasaur",
        TO: "Ivysaur",
        LEVEL: 16
    },
    {
        FROM: "Ivysaur",
        TO: "Venusaur",
        LEVEL: 32
    },
    {
        FROM: "Squirtle",
        TO: "Wartortle",
        LEVEL: 16
    },
    {
        FROM: "Wartortle",
        TO: "Blastoise",
        LEVEL: 36
    },
    {
        FROM: "Pikachu",
        TO: "Raichu",
        LEVEL: 20
    },
    {
        FROM: "Spearow",
        TO: "Fearow",
        LEVEL: 20
    },
    {
        FROM: "Caterpie",
        TO: "Metapod",
        LEVEL: 7
    },
    {
        FROM: "Metapod",
        TO: "Butterfree",
        LEVEL: 10
    },
    {
        FROM: "Weedle",
        TO: "Kakuna",
        LEVEL: 7
    },
    {
        FROM: "Kakuna",
        TO: "Beedrill",
        LEVEL: 10
    },
    {
        FROM: "Ekans",
        TO: "Arbok",
        LEVEL: 22
    },
    {
        FROM: "Abra",
        TO: "Kadabra",
        LEVEL: 16
    },
    {
        FROM: "Kadabra",
        TO: "Alakazam",
        LEVEL: 32
    },
    {
        FROM: "Sandshrew",
        TO: "Sandslash",
        LEVEL: 22
    },
    {
        FROM: "Venonat",
        TO: "Venomoth",
        LEVEL: 31
    },
    {
        FROM: "Bellsprout",
        TO: "Weepinbell",
        LEVEL: 21
    },
    {
        FROM: "Weepinbell",
        TO: "Victreebel",
        LEVEL: 31
    }
];

class POKEMON {
    constructor({ NAME, TYPE, LEVEL, XP, ATTACK, DEFENSE, SPEED, HP, MOVES, BOTTOM }) {
        this.NAME = NAME;
        this.TYPE = Array.isArray(TYPE) ? TYPE : [TYPE];
        this.LEVEL = LEVEL;
        this.XP = XP;

        this.baseAttack = ATTACK;
        this.baseDefense = DEFENSE;
        this.baseSpeed = SPEED;
        this.baseHP = HP;

        this.MOVES = MOVES;

        this.BOTTOM = BOTTOM;

        const spriteNames = this.renderSpriteName();

        this.frontSprite = spriteNames[0];
        this.backSprite = spriteNames[1];

        this.recalculateStats();
        this.currentHP = this.HP;

        this.STATUS = null;
        this.statusTurns = 0;
        this.statStages = {
            ATTACK: 0,
            DEFENSE: 0,
            SPEED: 0,
            ACCURACY: 0,
            EVASION: 0
        };
    }

    renderPokeSprite() {
        if (this.BOTTOM) {
            userPokemon.style.setProperty('--userBottom', `${this.BOTTOM}` + 'px');
        }
    }

    toJSON() {
        return {
            NAME: this.NAME,
            TYPE: this.TYPE,
            LEVEL: this.LEVEL,
            XP: this.XP,
            ATTACK: this.baseAttack,
            DEFENSE: this.baseDefense,
            SPEED: this.baseSpeed,
            HP: this.baseHP,
            MOVES: this.MOVES,
            currentHP: this.currentHP,
            frontSprite: this.frontSprite,
            backSprite: this.backSprite
        };
    }

    recalculateStats() {
        this.ATTACK = this.calculateStat(this.baseAttack, false);
        this.DEFENSE = this.calculateStat(this.baseDefense, false);
        this.SPEED = this.calculateStat(this.baseSpeed, false);
        this.HP = this.calculateStat(this.baseHP, true);
    }

    calculateStat(BASE, isHP) {
        if (isHP) {
            return Math.floor((2 * BASE * this.LEVEL) / 100 + this.LEVEL + 10);
        } else {
            return Math.floor((2 * BASE * this.LEVEL) / 100 + 5);
        }
    }

    levelUpPokemon() {
        const xpForLevelUp = Math.pow(this.LEVEL + 1, 3);
        if (this.XP >= xpForLevelUp && this.LEVEL < 100) {
            this.LEVEL += 1
            this.recalculateStats();
            return this.levelUpPokemon() || true;
        }
        return false;
    }

    checkEvolution() {
        const evolutionRule = evolutionData.find(rule => rule.FROM === this.NAME && this.LEVEL >= rule.LEVEL);
        if (evolutionRule) {
            this.evolvePoke(evolutionRule);
            this.checkEvolution()
        }
    }

    renderSpriteName() {
        const nameStr = this.NAME.toString().toLowerCase();

        const frontPng = nameStr + 'For.png';
        const backPng = nameStr + 'Back.png';

        const fullFrontFile = 'pokemonSprites/forSprites/' + frontPng;
        const fullBackFile = 'pokemonSprites/backSprites/' + backPng;

        return [fullFrontFile, fullBackFile];
    }

    evolvePoke(evolutionRule) {

        const evolvedPokemonData = pokemonData.find(POKE => POKE.NAME === evolutionRule.TO);
        if (!evolvedPokemonData) return;

        const hpRatio = this.currentHP / this.HP;

        const evolvedPokemon = new POKEMON(evolvedPokemonData);

        this.NAME = evolvedPokemon.NAME;
        this.TYPE = evolvedPokemon.TYPE;
        this.baseAttack = evolvedPokemon.baseAttack;
        this.baseDefense = evolvedPokemon.baseDefense;
        this.baseSpeed = evolvedPokemon.baseSpeed;
        this.baseHP = evolvedPokemon.baseHP;
        this.MOVES = evolvedPokemon.MOVES;
        this.frontSprite = evolvedPokemon.frontSprite;
        this.backSprite = evolvedPokemon.backSprite;

        this.recalculateStats();
        this.currentHP = Math.floor(this.HP * hpRatio);

    }


    calculateXP() {
        const xpYieldBase = Math.floor(((this.ATTACK + this.DEFENSE + this.HP) / 3) * 1.5);
        const totalXpGain = Math.floor((xpYieldBase * this.LEVEL) / 7);
        return totalXpGain;
    }

    returnXpUser(opponentPokemon) {
        if (playerWon === false) return;
        const gainedXP = opponentPokemon.calculateXP();
        this.XP += gainedXP;
        this.levelUpPokemon();
        currentBattle.updateEventContainer(`<span>${currentBattle.userPokemon.NAME}</span> gained <span>${gainedXP}</span> XP!`, currentBattle.userPokemon);
        playSound('gainXp', 0.1);
    }

    takeDamage(DAMAGE) {
        this.currentHP = Math.max(0, this.currentHP - DAMAGE);
    }

    getMove(moveName) {
        return this.MOVES.find(x => x.NAME === moveName);
    }

    getStatMultiplier(statName) {
        const STAGE = this.statStages[statName];
        if (statName === 'ACCURACY' || statName === 'EVASION') {
            if (STAGE >= 0) return (3 + STAGE) / 3;
            else return 3 / (3 - STAGE);
        } else {
            if (STAGE >= 0) return (2 + STAGE) / 2;
            else return 2 / (2 - STAGE);
        }
    }

    getEffectiveStat(statName) {
        let baseValue;
        switch (statName) {
            case 'ATTACK': baseValue = this.ATTACK; break;
            case 'DEFENSE': baseValue = this.DEFENSE; break;
            case 'SPEED': baseValue = this.SPEED; break;
            case 'HP': baseValue = this.HP; break;
            default: return 1;
        }

        let effectiveValue = baseValue * this.getStatMultiplier(statName);

        if (this.STATUS === 'BURN' && statName === 'ATTACK') {
            effectiveValue = Math.floor(effectiveValue * 0.5);
        }
        if (this.STATUS === 'PARALYZE' && statName === 'SPEED') {
            effectiveValue = Math.floor(effectiveValue * 0.5);
        }

        return Math.floor(effectiveValue);
    }

    applyStatus(TYPE) {
        if (this.STATUS) return false;
        this.STATUS = TYPE;
        this.addStatusCircle(TYPE);
        if (TYPE === 'SLEEP') {
            this.statusTurns = Math.floor(Math.random() * 3) + 2;
        } else if (TYPE === 'FREEZE') {
            this.statusTurns = Math.floor(Math.random() * 4) + 2;
        }
        console.log(this.statusTurns);
        return true;
    }

    clearStatus() {
        this.STATUS = null;
        this.statusTurns = 0;
    }

    clearStatusCircle() {
        if (!this.STATUS) {
            let statusCircle = '';
            this === currentBattle.userPokemon ? statusCircle = 'user' : statusCircle = 'oppo';
            statusCircle += 'StatusCircle';
            let circleElement = document.getElementById(statusCircle);

            circleElement.style.display = 'none';
        }
    }

    applyStatChange(STAT, STAGES) {
        if (this.statStages.hasOwnProperty(STAT)) {
            const currentStage = this.statStages[STAT];
            let newStage = currentStage + STAGES;
            newStage = Math.max(-6, Math.min(6, newStage));

            if (newStage !== currentStage) {
                this.statStages[STAT] = newStage;
                return true;
            }
        }
        return false;
    }

    clearAllStatChanges() {
        this.statStages = {
            ATTACK: 0,
            DEFENSE: 0,
            SPEED: 0,
            ACCURACY: 0,
            EVASION: 0
        };
    }

    healPokemon(VALUE) {
        this.currentHP = Math.min(this.HP, this.currentHP + VALUE);
    }

    addStatusCircle(statusApplied) {
        const statusColors = {
            POISON: typeColors["P"],
            BURN: typeColors["F"],
            SLEEP: typeColors["N"],
            PARALYZE: typeColors["E"],
            FREEZE: typeColors["I"],
            FLINCH: typeColors["N"]
        };

        const statusMessage = {
            POISON: 'PSN',
            BURN: 'BRN',
            SLEEP: 'SLP',
            PARALYZE: 'PAR',
            FREEZE: 'FRZ',
            FLINCH: 'FLC',
        }

        let statusCircle = '';

        this === currentBattle.userPokemon ? statusCircle = 'user' : statusCircle = 'oppo';
        statusCircle += 'StatusCircle';
        let circleElement = document.getElementById(statusCircle);

        circleElement.innerHTML = statusMessage[statusApplied];
        circleElement.style.backgroundColor = statusColors[statusApplied];
        circleElement.style.display = 'inline-flex';
        console.log(this, statusCircle, circleElement);
    }

    renderSpriteName() {
        const nameStr = this.NAME.toString().toLowerCase();

        const frontPng = nameStr + 'For.png';
        const backPng = nameStr + 'Back.png';

        const fullFrontFile = 'pokemonSprites/forSprites/' + frontPng;
        const fullBackFile = 'pokemonSprites/backSprites/' + backPng;

        return [fullFrontFile, fullBackFile];
    }
}

let playerWon = false;

class BATTLE {
    constructor(userPokemon, opponentPokemon) {
        this.userPokemon = userPokemon;
        this.opponentPokemon = opponentPokemon;
        this.encounterBoolean = false;
        this.currentPlayer = null;
        this.actionTaken = true;
        this.faintSwap = false;
    }

    async #delay(MS) {
        return new Promise(resolve => setTimeout(resolve, MS));
    }

    calculateDamage(ATTACKER, DEFENDER, MOVE) {
        let totalTypeEffectiveness = 1;

        DEFENDER.TYPE.forEach(defenderType => {
            const typeEffectiveness = typeChart[MOVE.TYPE]?.[defenderType] ?? 1;
            totalTypeEffectiveness *= typeEffectiveness;
        });

        const randomFactor = (Math.floor(Math.random() * 16) + 85) / 100;

        const attackerAttack = ATTACKER.getEffectiveStat('ATTACK');
        const defenderDefense = DEFENDER.getEffectiveStat('DEFENSE');

        const totalDamage = (((((2 * ATTACKER.LEVEL) / 5 + 2) * attackerAttack * MOVE.POWER) / defenderDefense) / 50 + 2) * totalTypeEffectiveness * randomFactor;

        return Math.floor(totalDamage);
    }

    async handleEffectStatus(ATTACKER) {
        this.actionTaken = true;

        if (ATTACKER.STATUS === 'SLEEP') {
            ATTACKER.statusTurns--;
            if (ATTACKER.statusTurns > 0) {
                this.updateEventContainer(`<span>${ATTACKER.NAME}</span> is fast asleep.`, ATTACKER);
                this.actionTaken = false;
            } else {
                this.updateEventContainer(`<span>${ATTACKER.NAME}</span> woke up!`, ATTACKER);
                ATTACKER.clearStatus();
                await this.#delay(1000);
            }
        } else if (ATTACKER.STATUS === 'FREEZE') {
            if (Math.random() < 0.2) {
                this.updateEventContainer(`<span>${ATTACKER.NAME}</span> thawed out!`, ATTACKER);
                ATTACKER.clearStatus();
                await this.#delay(1000);
            } else {
                this.updateEventContainer(`<span>${ATTACKER.NAME}</span> is frozen solid.`, ATTACKER);
                this.actionTaken = false;
            }
        } else if (ATTACKER.STATUS === 'PARALYZE') {
            if (Math.random() < 0.25) {
                this.updateEventContainer(`<span>${ATTACKER.NAME}</span> is fully paralyzed and couldn't move.`, ATTACKER);
                this.actionTaken = false;
            }
        } else if (ATTACKER.STATUS === 'FLINCH') {
            this.updateEventContainer(`<span>${ATTACKER.NAME}</span> flinched and couldn't move.`, ATTACKER);
            this.actionTaken = false;
            ATTACKER.clearStatus();
        }
    }

    async performAttack(ATTACKER, DEFENDER, moveName) {
        const MOVE = ATTACKER.getMove(moveName);

        const accuracyMulti = ATTACKER.getStatMultiplier('ACCURACY');
        const evasionMulti = DEFENDER.getStatMultiplier('EVASION');
        const moveAccuracy = MOVE.ACC === null || MOVE.ACC === undefined ? Infinity : MOVE.ACC;

        const finalAcc = moveAccuracy * (accuracyMulti / evasionMulti);

        if (Math.random() * 100 > finalAcc) {
            this.updateEventContainer(`<span>${ATTACKER.NAME}</span> Missed!`, ATTACKER);
            await this.#delay(1000);
            this.currentTurn === 'userPokemon' ? this.enableMoveButtons() : this.disableMoveButtons();
            await this.handleEffectDamage(ATTACKER);
            return;
        }

        if (MOVE.POWER > 0) {
            playSound('takeDamage', 0.1);
        }

        //FIX THIS OPPONENT NOT GETTING "WONT GO HIGHER" MSG

        if (MOVE.POWER === 0 && MOVE.miscEffect === null) {
            if (MOVE.statChange && Math.random() * 100 < MOVE.statChange.CHANCE) {
                this.updateEventContainer(`<span>${ATTACKER.NAME}</span> used <span>${MOVE.NAME}</span>!`, ATTACKER);
                await this.#delay(1000);
                const targetPoke = MOVE.statChange.TARGET === 'SELF' ? ATTACKER : DEFENDER;

                const statsToChange = Array.isArray(MOVE.statChange.STATS)
                    ? MOVE.statChange.STATS
                    : [MOVE.statChange.STAT];

                statsToChange.forEach(statName => {
                    let displayName = '';
                    statName.forEach(statName => {
                        if (targetPoke.statStages[statName] >= 6) return;
                        displayName += ',' + statName;
                        if (displayName.startsWith(',')) displayName = displayName.slice(1);
                        displayName = displayName.replace(',', ' and ').toLowerCase();
                        const statChanged = targetPoke.applyStatChange(statName, MOVE.statChange.STAGES);
                        if (statChanged) {
                            const moveDirection = MOVE.statChange.STAGES > 0 ? 'rose' : 'fell';
                            this.updateEventContainer(`<span>${targetPoke.NAME}</span>'s <span>${displayName}</span> ${moveDirection}!`, targetPoke);
                        } else {
                            this.updateEventContainer(`<span>${targetPoke.NAME}</span>'s <span>${displayName}</span> won't go any ${MOVE.statChange.STAGES > 0 ? 'higher' : 'lower'}!`, targetPoke);
                        }
                    });
                });
                await this.#delay(1000);
            } else if (MOVE.statusEffect && Math.random() * 100 < MOVE.statusEffect.CHANCE && !DEFENDER.statusEffect) {
                const statusApplied = DEFENDER.applyStatus(MOVE.statusEffect.TYPE);
                console.log(DEFENDER.statusEffect, DEFENDER.statusTurns);
                if (statusApplied) {
                    let pokeWasStr = '';
                    if (MOVE.statusEffect.TYPE === 'BURN' || MOVE.statusEffect.TYPE === 'POISON') {
                        pokeWasStr = MOVE.statusEffect.TYPE + 'ED';
                    } else if (MOVE.statusEffect.TYPE === 'SLEEP') {
                        pokeWasStr = 'put to sleep'
                    } else if (MOVE.statusEffect.TYPE === 'FREEZE') {
                        pokeWasStr = 'frozen solid'
                    } else if (MOVE.statusEffect.TYPE === 'PARALYZE') {
                        pokeWasStr = 'paralyzed'
                    }
                    console.log(pokeWasStr);
                    MOVE.statusEffect.TYPE === 'FLINCH' ? false : this.updateEventContainer(`<span>${DEFENDER.NAME}</span> was <span>${pokeWasStr.toString().toLowerCase()}</span>!`, DEFENDER);

                    this.updateBattleUI();
                    await this.#delay(1000);
                }
            }

            return;
        }

        let DAMAGE = 0;

        if (!MOVE.miscEffect || MOVE.miscEffect.TYPE === 'U_TURN' || MOVE.NAME === 'Leech Life') {
            DAMAGE = this.calculateDamage(ATTACKER, DEFENDER, MOVE);
            DEFENDER.takeDamage(DAMAGE);
            this.updateEventContainer(`<span>${ATTACKER.NAME}</span> used <span>${MOVE.NAME}</span> and dealt <span>${DAMAGE}</span> damage to <span>${DEFENDER.NAME}</span>!`, ATTACKER, DEFENDER);
            this.updateBattleUI();
            await this.#delay(1000);
        }

        if (DEFENDER.currentHP > 0) {
            if (MOVE.POWER > 0 && MOVE.statusEffect && Math.random() * 100 < MOVE.statusEffect.CHANCE) {
                const statusApplied = DEFENDER.applyStatus(MOVE.statusEffect.TYPE);
                console.log(DEFENDER.statusEffect, DEFENDER.statusTurns);
                if (statusApplied) {
                    let pokeWasStr = '';
                    if (MOVE.statusEffect.TYPE === 'BURN' || MOVE.statusEffect.TYPE === 'POISON') {
                        pokeWasStr = MOVE.statusEffect.TYPE + 'ED';
                    } else if (MOVE.statusEffect.TYPE === 'SLEEP') {
                        pokeWasStr = 'put to sleep'
                    } else if (MOVE.statusEffect.TYPE === 'FREEZE') {
                        pokeWasStr = 'frozen solid'
                    } else if (MOVE.statusEffect.TYPE === 'PARALYZE') {
                        pokeWasStr = 'paralyzed'
                    }
                    console.log(pokeWasStr);
                    MOVE.statusEffect.TYPE === 'FLINCH' ? false : this.updateEventContainer(`<span>${DEFENDER.NAME}</span> was <span>${pokeWasStr.toString().toLowerCase()}</span>!`, DEFENDER);

                    this.updateBattleUI();
                    await this.#delay(1000);
                }
            }

            if (MOVE.statChange && MOVE.POWER > 0 && Math.random() * 100 < MOVE.statChange.CHANCE) {
                const targetPoke = MOVE.statChange.TARGET === 'SELF' ? ATTACKER : DEFENDER;

                const statsToChange = Array.isArray(MOVE.statChange.STATS)
                    ? MOVE.statChange.STATS
                    : [MOVE.statChange.STAT];

                statsToChange.forEach(statName => {
                    let displayName = '';
                    statName.forEach(statName => {
                        if (targetPoke.statStages[statName] >= 6) return;
                        displayName += ',' + statName;
                        if (displayName.startsWith(',')) displayName = displayName.slice(1);
                        displayName = displayName.replace(',', ' and ').toLowerCase();
                        const statChanged = targetPoke.applyStatChange(statName, MOVE.statChange.STAGES);
                        if (statChanged) {
                            const moveDirection = MOVE.statChange.STAGES > 0 ? 'rose' : 'fell';
                            this.updateEventContainer(`<span>${targetPoke.NAME}</span>'s <span>${displayName}</span> ${moveDirection}!`, targetPoke);
                            this.updateBattleUI();
                        } else {
                            this.updateEventContainer(`<span>${targetPoke.NAME}</span>'s <span>${displayName}</span> won't go any ${MOVE.statChange.STAGES > 0 ? 'higher' : 'lower'}!`, targetPoke);
                        }
                    });
                });
                await this.#delay(1000);
            }
        }

        if (MOVE.miscEffect) {
            if (MOVE.miscEffect.TYPE === 'TELEPORT') {
                this.updateEventContainer(`<span>${ATTACKER.NAME}</span> used Teleport!`, ATTACKER);
                playerWon = false;
                await this.endEncounter();
                return;
            } else if (MOVE.miscEffect.TYPE === 'U_TURN') {
                this.updateEventContainer(`<span>${ATTACKER.NAME}</span> used U-turn!`, ATTACKER);
                if (ATTACKER === this.userPokemon) {
                    const healthyPokemon = playerCharInfo.pokemonTeam.find(POKE => POKE.currentHP > 0 && POKE !== this.userPokemon);
                    if (healthyPokemon) {
                        this.disableMoveButtons();
                        playerCharInfo.lastActivePokemon = healthyPokemon;
                        await this.switchPokemon(healthyPokemon, true);

                    } else {
                        this.updateEventContainer(`No other Pokemon to swap to.`);
                        await this.#delay(1000);
                    }
                }
                return;
            } else if (MOVE.miscEffect.TYPE === 'HEAL') {
                let recoverValue = 0;
                if (MOVE.NAME === 'Recover') {
                    recoverValue = Math.floor(ATTACKER.HP / 2);
                    ATTACKER.healPokemon(recoverValue);
                } else if (MOVE.NAME === 'Leech Life') {
                    recoverValue = Math.floor(DAMAGE / 2);
                    ATTACKER.healPokemon(recoverValue);
                } else {
                    recoverValue = MOVE.miscEffect.VALUE;
                    ATTACKER.healPokemon(recoverValue);
                }
                this.updateEventContainer(`<span>${ATTACKER.NAME}</span> healed ${recoverValue} HP!`, ATTACKER);
                this.updateBattleUI();
                await this.#delay(1000);
            }
        }
    }

    async handleEffectDamage(POKEMON) {
        if (!POKEMON.STATUS) return;
        console.log(POKEMON.STATUS);

        let DAMAGE = 0;
        let MSG = '';

        switch (POKEMON.STATUS) {
            case 'POISON':
                DAMAGE = Math.floor(POKEMON.HP / 8);
                MSG = `<span>${POKEMON.NAME}</span> is hurt by its poison!`;
                break;
            case 'BURN':
                DAMAGE = Math.floor(POKEMON.HP / 16);
                DAMAGE <= 0 ? DAMAGE = 1 : DAMAGE;
                MSG = `<span>${POKEMON.NAME}</span> is hurt by its burn!`;
                break;
            default:
                return;
        }

        POKEMON.takeDamage(DAMAGE);
        this.updateBattleUI();
        this.updateEventContainer(MSG, POKEMON);
        await this.#delay(1000);

        if (this.opponentPokemon.STATUS) {
            this.enableMoveButtons();
            this.currentTurn = 'userPokemon';
        }

        if (POKEMON.currentHP <= 0) {
            this.updateEventContainer(`<span>${POKEMON.NAME}</span> fainted from its ${POKEMON.STATUS.toString().toLowerCase()}.`, POKEMON);
            POKEMON === userPokemon ? playerWon = false : playerWon = true;
            await this.endEncounter();
        }

        console.log(DAMAGE, MSG);
    }

    updateHealthUI() {
        const userHPRatio = (this.userPokemon.currentHP / this.userPokemon.HP) * 100;
        const oppoHPRatio = (this.opponentPokemon.currentHP / this.opponentPokemon.HP) * 100;

        if (userHPRatio <= 25) {
            document.documentElement.style.setProperty('--barFillColorUser', 'red');
        } else if (userHPRatio <= 50) {
            document.documentElement.style.setProperty('--barFillColorUser', 'yellow');
        } else {
            document.documentElement.style.setProperty('--barFillColorUser', '#5cff85');
        }

        if (oppoHPRatio <= 25) {
            document.documentElement.style.setProperty('--barFillColorOppo', 'red');
        } else if (oppoHPRatio <= 50) {
            document.documentElement.style.setProperty('--barFillColorOppo', 'yellow');
        } else {
            document.documentElement.style.setProperty('--barFillColorOppo', '#5cff85');
        }

        userHealthFill.style.width = `${Math.max(0, userHPRatio)}%`;
        oppoHealthFill.style.width = `${Math.max(0, oppoHPRatio)}%`;

        userHealthInt.innerHTML = `${this.userPokemon.currentHP}/${this.userPokemon.HP}`;
    }

    updateBattleUI() {
        userPokemon.src = this.userPokemon.backSprite;
        opposingPokemon.src = this.opponentPokemon.frontSprite;

        userPokeLevel.innerHTML = `Lv. ${this.userPokemon.LEVEL}`;
        oppoPokeLevel.innerHTML = `Lv. ${this.opponentPokemon.LEVEL}`;

        userPokeName.innerHTML = this.userPokemon.NAME;
        oppoPokeName.innerHTML = this.opponentPokemon.NAME;

        this.userPokemon.renderPokeSprite();
        this.updateHealthUI();
        if (this.userPokemon.STATUS) this.userPokemon.addStatusCircle(this.userPokemon.STATUS);
        this.userPokemon.clearStatusCircle();
        if (this.opponentPokemon) {
            this.opponentPokemon.clearStatusCircle();
        }
    }

    renderMoveButtons() {
        const childOptions = moveContainer.querySelectorAll('.option');
        childOptions.forEach(CHILD => {
            if (CHILD.id !== 'backOption') {
                CHILD.remove();
            }
        });

        this.userPokemon.MOVES.forEach(x => {
            const BUTTON = document.createElement('div');
            BUTTON.classList.add('option');
            BUTTON.innerHTML = `<span>${x.NAME}</span>`;

            BUTTON.addEventListener('click', () => this.handlePlayerMove('MOVE', x));
            BUTTON.addEventListener('mouseenter', () => this.displayMoveInfo(x));


            BUTTON.style.borderColor = typeColors[x.TYPE] || typeColors['N'];
            BUTTON.style.color = typeColors[x.TYPE] || typeColors['N'];
            BUTTON.style.backgroundColor = `color-mix( in srgb, ${typeColors[x.TYPE]} 10%, white)`;

            moveContainer.appendChild(BUTTON);
        });

        moveContainer.append(backOption);

        if (this.currentTurn === 'userPokemon') {
            this.enableMoveButtons();
        } else {
            this.disableMoveButtons();
        }

    }

    displayMoveInfo(MOVE) {
        const typeChartName = {
            N: 'Normal',
            E: 'Electric',
            F: 'Fire',
            G: 'Grass',
            W: 'Water',
            D: 'Dark',
            f: 'Fairy',
            g: 'Ground',
            A: 'Flying',
            B: 'Bug',
            S: 'Steel',
            P: 'Poison',
            p: 'Psychic'
        };

        let typeEffectiveness = 1;
        const moveType = MOVE.TYPE;
        const opponentTypes = this.opponentPokemon.TYPE;

        opponentTypes.forEach(opponentType => {
            if (typeChart[moveType] && typeChart[moveType][opponentType] !== undefined) {
                typeEffectiveness *= typeChart[moveType][opponentType];
            }
        });

        console.log(typeEffectiveness);
        let effectiveMsg = '';
        if (typeEffectiveness >= 2) {
            effectiveMsg = `◎ Super Effective`;
        } else if (typeEffectiveness > 0 && typeEffectiveness < 1) {
            effectiveMsg = `△ Not v. Effective`;
        } else if (typeEffectiveness === 0) {
            effectiveMsg = `╳ No Effect`;
        } else {
            effectiveMsg = `◯ Effective`;
        }

        console.log(typeEffectiveness + 'x');
        const moveAccuracy = MOVE.ACC === null || MOVE.ACC === undefined ? Infinity : MOVE.ACC;
        this.updateEventContainer(`Power: ${MOVE.POWER}<br>Accuracy: ${moveAccuracy}<br>Type: <span style="color:${typeColors[moveType]}">${typeChartName[MOVE.TYPE]}</span><br>${effectiveMsg}`);
    }

    async handlePlayerMove(actionType, actionPayload) {
        if (this.currentTurn !== 'userPokemon') {
            console.log('Not your turn');
            return;
        }

        this.currentTurn = 'opponentPokemon';
        this.disableMoveButtons();
        toggleMenu('backOption', false);

        await this.handleEffectStatus(this.userPokemon);


        if (this.actionTaken) {
            if (actionType === 'MOVE') {
                shiftMoveOptions();
                await this.performAttack(this.userPokemon, this.opponentPokemon, actionPayload.NAME);
                if (eventContainer.innerHTML.includes('Teleport')) return;
                this.faintSwap = false;
            } else if (actionType === 'ITEM') {
                const itemType = actionPayload.TYPE;
                const itemQuantity = actionPayload.QUANT;
                this.updateEventContainer(`<span>${playerCharInfo.NAME}</span> used a <span>${itemType.slice(0, -1)}</span>.`);
                this.faintSwap = false;

                if (itemType === 'pokeballs') {
                    await this.attemptCatch();
                    if (!window.encounterActive) {
                        return;
                    }
                } else if (itemType === 'potions') {
                    await this.usePotion();
                }
            } else if (actionType === 'SWITCH') {
                const wasFaintSwap = this.faintSwap;
                await this.switchPokemon(actionPayload);
                if (wasFaintSwap) {
                    this.faintSwap = false;
                    this.currentTurn = 'userPokemon';
                    this.enableMoveButtons();
                    return;
                }
            }
        } else {
            shiftMoveOptions();
            await this.#delay(1000);
        }

        if (!window.encounterActive) return;

        if (this.opponentPokemon.currentHP <= 0) {
            playerWon = true;
            await this.endEncounter();
            return;
        }

        await this.handleEffectDamage(this.userPokemon);

        if (eventContainer.innerHTML.includes('fainted from its')) return;
        if (eventContainer.innerHTML.includes('U-')) return;

        if (this.userPokemon.currentHP > 0 && this.opponentPokemon.currentHP > 0 && this.faintSwap === false) {
            await this.handleOpponentMove();
        }

        if (this.userPokemon.currentHP > 0 && this.opponentPokemon.currentHP > 0) {
            this.currentTurn = 'userPokemon';
            this.enableMoveButtons();
        }
    }

    async handleOpponentMove() {
        if (!window.encounterActive) {
            return;
        }

        this.disableMoveButtons();
        const randomMove = this.opponentPokemon.MOVES[Math.floor(Math.random() * this.opponentPokemon.MOVES.length)];
        await this.performAttack(this.opponentPokemon, this.userPokemon, randomMove.NAME);

        if (this.userPokemon.currentHP <= 0) {
            const healthyPokemon = playerCharInfo.pokemonTeam.find(P => P.currentHP > 0);
            if (healthyPokemon) {
                this.disableMoveButtons();
                pokemonOption.pointerEvents = 'auto';
                this.currentTurn = 'userPokemon';
                this.faintSwap = true;
                this.updateEventContainer(`<span>${this.userPokemon.NAME}</span> fainted.`, this.userPokemon);
                return;
            }
        }

        this.faintSwap = false;

        if (this.userPokemon.currentHP <= 0) {
            this.updateEventContainer(`<span>${this.userPokemon.NAME}</span> fainted.`, this.userPokemon);
            await this.endEncounter();
            return;
        }

        await this.handleEffectDamage(this.opponentPokemon);
    }

    disableMoveButtons() {
        moveContainer.querySelectorAll('.option').forEach(x => {
            x.style.pointerEvents = 'none';
            x.style.opacity = '0.7';
        });
        battleOption.style.pointerEvents = 'none';
        bagOption.style.pointerEvents = 'none';
        runOption.style.pointerEvents = 'none';
        battleOption.style.opacity = '0.7';
        bagOption.style.opacity = '0.7';
        runOption.style.opacity = '0.7';
    }

    enableMoveButtons() {
        moveContainer.querySelectorAll('.option').forEach(x => {
            x.style.pointerEvents = 'auto';
            x.style.opacity = '1';
        });
        battleOption.style.pointerEvents = 'auto';
        bagOption.style.pointerEvents = 'auto';
        runOption.style.pointerEvents = 'auto';
        battleOption.style.opacity = '1';
        bagOption.style.opacity = '1';
        runOption.style.opacity = '1';
    }

    async attemptCatch() {
        if (playerCharInfo.playerInventory.pokeballs > 0) {
            playerCharInfo.playerInventory.pokeballs--;
            this.renderBagItems();
            this.updateEventContainer('<span>Pokeball</span> thrown!');
            await this.#delay(2000);
            let catchChance = (1 - (this.opponentPokemon.currentHP / this.opponentPokemon.HP)) * 100;
            const randomFactor = Math.random() * 100
            let statusModifier = 1;

            if (this.opponentPokemon.STATUS) {
                switch (this.opponentPokemon.STATUS) {
                    case 'SLEEP':
                    case 'FREEZE':
                        statusModifier = 2;
                        break;
                    case 'PARALYZE':
                    case 'POISON':
                    case 'BURN':
                        statusModifier = 1.5;
                        break;
                }
            }

            catchChance = catchChance * statusModifier;

            console.log(catchChance);


            if (randomFactor < catchChance) {
                this.updateEventContainer(`<span>${this.opponentPokemon.NAME}</span> was caught!`, this.opponentPokemon);
                const caughtPokemon = this.opponentPokemon;
                caughtPokemon.XP = Math.pow(caughtPokemon.LEVEL, 3);
                playerCharInfo.pokemonTeam.push(caughtPokemon);
                window.encounterActive = false;
                playerWon = true;
                await this.endEncounter();
                return;
            } else {
                this.updateEventContainer(`<span>${this.opponentPokemon.NAME}</span> was not caught.`, this.opponentPokemon);
                await this.#delay(1000);
            }
        } else {
            console.log('Not enough Pokeballs');
        }
        this.updateBattleUI();
    }

    async usePotion() {
        if (playerCharInfo.playerInventory.potions > 0) {
            playerCharInfo.playerInventory.potions--;
            this.updateEventContainer(`Used a <span>potion</span> on <span>${this.userPokemon.NAME}</span>.`, this.userPokemon);
            this.renderBagItems();
            const healAmount = Math.floor(this.userPokemon.HP * 0.3);
            this.userPokemon.healPokemon(healAmount);
            this.updateBattleUI();
            await this.#delay(1000);
        }
    }

    renderBagItems() {
        const childOptions = bagContainer.querySelectorAll('.option');
        childOptions.forEach(CHILD => {
            if (CHILD.id !== 'backOption') {
                CHILD.remove();
            }
        });

        for (const itemType in playerCharInfo.playerInventory) {
            if (playerCharInfo.playerInventory.hasOwnProperty(itemType)) {
                const QUANT = playerCharInfo.playerInventory[itemType];
                const displayName = itemType.charAt(0).toUpperCase() + itemType.slice(1).replace(/_/g, ' ');

                const itemDiv = document.createElement('div');
                itemDiv.classList.add('option');
                itemDiv.innerHTML = `<span>${displayName}: ${QUANT}</span>`;
                itemDiv.style.borderColor = bagContentColors[itemType] || 'black';
                itemDiv.style.color = bagContentColors[itemType] || 'black';
                itemDiv.style.backgroundColor = `color-mix( in srgb, ${bagContentColors[itemType]} 10%, white)`;

                if (QUANT > 0) {
                    itemDiv.addEventListener('click', () => {
                        this.handlePlayerMove('ITEM', { TYPE: itemType, QUANT: QUANT });
                    });
                } else {
                    itemDiv.style.pointerEvents = 'none';
                    itemDiv.style.opacity = '0.7';
                }
                bagContainer.appendChild(itemDiv);
                bagContainer.append(backOption);
            }
        }
    }

    renderPokemonOptions() {
        const childOptions = pokemonContainer.querySelectorAll('.option');
        childOptions.forEach(CHILD => {
            if (CHILD.id !== 'backOption') {
                CHILD.remove();
            }
        });

        playerCharInfo.pokemonTeam.forEach((POKE) => {
            const pokeDiv = document.createElement('div');
            pokeDiv.classList.add('option');
            pokeDiv.innerHTML = `<span>${POKE.NAME} Lv. ${POKE.LEVEL}</span>`;
            pokeDiv.style.borderColor = typeColors[POKE.TYPE[0]] || 'black';
            pokeDiv.style.color = typeColors[POKE.TYPE[0]] || typeColors['N'];
            pokeDiv.style.backgroundColor = `color-mix( in srgb, ${typeColors[POKE.TYPE[0]]} 10%, white)`;

            if (POKE === this.userPokemon || POKE.currentHP <= 0) {
                pokeDiv.style.pointerEvents = 'none';
                pokeDiv.style.opacity = '0.7';
                if (POKE === this.userPokemon) pokeDiv.innerHTML += `<small>(Active)</small>`;
                if (POKE.currentHP <= 0) pokeDiv.innerHTML += `<small>(Fainted)</small>`;
            } else {
                pokeDiv.addEventListener('click', () => {
                    this.handlePlayerMove('SWITCH', POKE);
                });
            }
            pokemonContainer.appendChild(pokeDiv);
            pokemonContainer.append(backOption);
        });
    }

    async switchPokemon(newActivePokemon, BOOLEAN) {
        if (newActivePokemon === this.userPokemon) return;
        if (newActivePokemon.currentHP <= 0) return;

        if (BOOLEAN === false) {
            this.updateEventContainer(`<span>${this.userPokemon.NAME}</span> fainted.`, this.userPokemon);
            this.updateEventContainer(`<br>Swapped to <span>${newActivePokemon.NAME}</span>.`, newActivePokemon, null, true);
        } else {
            this.updateEventContainer(`Swapped to <span>${newActivePokemon.NAME}</span>.`, newActivePokemon);
        }

        this.disableMoveButtons();
        this.userPokemon = newActivePokemon;
        playerCharInfo.lastActivePokemon = newActivePokemon;
        this.renderMoveButtons();
        this.updateBattleUI();
        await this.#delay(1500);
    }

    toggleEncounterAnimation(START = true) {
        const REVERSE = START ? 'normal' : 'reverse';
        document.documentElement.style.setProperty('--animationReverse', REVERSE);

        battleArea.style.pointerEvents = 'auto';

        gameArea.classList.remove('gameAreaEnc');
        battleArea.classList.remove('battleAreaEnc');

        void gameArea.offsetWidth;
        void battleArea.offsetWidth;

        gameArea.classList.add('gameAreaEnc');
        battleArea.classList.add('battleAreaEnc');

        this.encounterBoolean = START;
    }

    calculateInitialTurn() {
        if (this.userPokemon.SPEED > this.opponentPokemon.SPEED) {
            this.currentTurn = 'userPokemon';
        } else if (this.userPokemon.SPEED < this.opponentPokemon.SPEED) {
            this.currentTurn = 'opponentPokemon';
        } else {
            this.currentTurn = Math.random() < 0.5 ? 'userPokemon' : 'opponentPokemon';
        }
        this.updateEventContainer(`A wild <span>${this.opponentPokemon.NAME}</span> appeared! <span>${this.currentTurn === 'userPokemon' ? this.userPokemon.NAME : this.opponentPokemon.NAME}</span>'s turn.`, this.userPokemon, this.opponentPokemon);
    }

    async beginEncounter() {
        window.encounterActive = true;
        this.toggleEncounterAnimation(true);
        this.calculateInitialTurn();
        this.updateBattleUI();

        this.encounterBoolean = true;

        if (this.currentTurn === 'opponentPokemon') {
            await this.#delay(1000);
            await this.handleOpponentMove();

            if (this.userPokemon.currentHP > 0 && this.opponentPokemon.currentHP > 0) {
                this.currentTurn = 'userPokemon';
                this.enableMoveButtons();
            }
        } else {
            this.enableMoveButtons();
        }
    }

    async endEncounter() {

        await this.#delay(1000);

        toggleMenu('backOption', false);
        this.updateBattleUI();
        this.disableMoveButtons();
        if (playerWon) playSound('gainXp', 0.1);

        playerCharInfo.pokemonTeam.forEach(POKE => {
            POKE.currentHP > 0 ? POKE.returnXpUser(this.opponentPokemon) : false;
            POKE.recalculateStats();
            POKE.checkEvolution();
            POKE.currentHP = POKE.HP;
            POKE.clearAllStatChanges();
            POKE.clearStatus();
        });
        await this.#delay(1000);

        this.opponentPokemon.currentHP = this.opponentPokemon.HP;
        playerWon = false;
        this.toggleEncounterAnimation(false);
        window.encounterActive = false;
        console.log('Battle Set', this.userPokemon.XP);
    }

    updateEventContainer(STR, pokeOne, pokeTwo, ADD) {
        let formattedStr = STR.toString().trim();

        if (pokeOne instanceof POKEMON) {
            const pokeOneColor = typeColors[pokeOne.TYPE[0]] || typeColors['N'];
            const regexOne = new RegExp(`<span>${pokeOne.NAME}</span>`, 'gi');
            formattedStr = formattedStr.replace(regexOne, `<span style='color: ${pokeOneColor};'>${pokeOne.NAME}</span>`);
        }

        if (pokeTwo instanceof POKEMON) {
            const pokeTwoColor = typeColors[pokeTwo.TYPE[0]] || typeColors['N'];
            const regexOne = new RegExp(`<span>${pokeTwo.NAME}</span>`, 'gi');
            formattedStr = formattedStr.replace(regexOne, `<span style='color: ${pokeTwoColor};'>${pokeTwo.NAME}</span>`);
        }

        if (!ADD) {
            eventContainer.innerHTML = formattedStr;
        } else {
            eventContainer.innerHTML += formattedStr;
        }

    }
}

battleOption.addEventListener('click', () => {
    toggleMenu('battleOption', true);
    currentBattle.renderMoveButtons();
    shiftMoveOptions();
});

pokemonOption.addEventListener('click', () => {
    toggleMenu('pokemonOption', true);
    currentBattle.renderPokemonOptions();
});

bagOption.addEventListener('click', () => {
    toggleMenu('bagOption', true);
    currentBattle.renderBagItems();
});

runOption.addEventListener('click', () => {
    toggleMenu('backOption', false);
    currentBattle.endEncounter();
    currentBattle.disableMoveButtons();
    currentBattle.updateEventContainer('Running away!')
});

backOption.addEventListener('click', () => {
    toggleMenu('backOption', false);
    if (backOption.parentElement.id === 'moveContainer') {
        shiftMoveOptions();
        currentBattle.updateEventContainer(`What will <span>${currentBattle.userPokemon.NAME}</span> do?`, currentBattle.userPokemon);
    }
});

function toggleMenu(targetId, toggleVar) {
    if (toggleVar) {
        document.querySelectorAll('.optionOne').forEach(x => {
            x.style.display = 'none';
        });
        backOption.style.display = 'flex';
        moveContainer.style.display = targetId === 'battleOption' ? 'grid' : 'none';
        bagContainer.style.display = targetId === 'bagOption' ? 'grid' : 'none';
        pokemonContainer.style.display = targetId === 'pokemonOption' ? 'grid' : 'none';
    } else {
        document.querySelectorAll('.optionOne').forEach(x => {
            x.style.display = 'flex';
        });
        backOption.style.display = 'none';
        moveContainer.style.display = 'none';
        bagContainer.style.display = 'none';
        pokemonContainer.style.display = 'none';
    }
}

let activeEncounterBoolean = false;

let initialUserPokemon = new POKEMON(pokemonData[3]); //3 pikachu
playerCharInfo.pokemonTeam.push(initialUserPokemon);
playerCharInfo.lastActivePokemon = initialUserPokemon;

let currentBattle;

document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        console.log(window.beginBattleBoolean, activeEncounterBoolean);
        if (window.beginBattleBoolean && !activeEncounterBoolean) renderPokemon();
    }
});

function renderPokemon() {
    const indexNum = 11; //11
    const randomIndex = Math.floor(Math.random() * indexNum);
    let opponentPokemon = new POKEMON(pokemonData[randomIndex]);

    const highestLevel = playerCharInfo.pokemonTeam.reduce((HIGH, CURRENT) => {
        return CURRENT.LEVEL > HIGH.LEVEL ? CURRENT : HIGH;
    }).LEVEL;

    const levelVariation = 3;
    const randomLevelVar = Math.random() < 0.5 ? Math.floor(Math.random() * levelVariation) : -(Math.floor(Math.random() * levelVariation))
    opponentPokemon.LEVEL = highestLevel + randomLevelVar;

    opponentPokemon.recalculateStats();
    opponentPokemon.checkEvolution();
    opponentPokemon.currentHP = opponentPokemon.HP;
    opponentPokemon.clearStatus();

    let activePlayerPokemon = playerCharInfo.lastActivePokemon || playerCharInfo.pokemonTeam[0];

    if (activePlayerPokemon.currentHP <= 0) {
        const healthyPokemon = playerCharInfo.pokemonTeam.find(P => P.currentHP > 0);
        if (healthyPokemon) {
            activePlayerPokemon = healthyPokemon;
            playerCharInfo.lastActivePokemon = healthyPokemon;
        } else {
            return;
        }
    }

    currentBattle = new BATTLE(activePlayerPokemon, opponentPokemon);
    currentBattle.beginEncounter();
    playSound('encounterSfx', 0);
}

function shiftMenu(OPEN) {
    if (!OPEN) {
        pokemonMenu.style.top = 100 + '%';
        pokemonMenu.style.minHeight = 'auto';
        pokemonMenu.querySelectorAll('.option').forEach(x => {
            x.style.display = 'none';
        });
        openMenu.style.display = 'flex';
        openMenu.innerHTML = 'ᐱ';
    } else {
        pokemonMenu.style.top = 50 + '%';
        pokemonMenu.style.width = 25 + '%';
        pokemonMenu.style.minHeight = 340 + 'px';
        pokemonMenu.querySelectorAll('.option').forEach(x => {
            x.style.display = 'flex';
        });
        openMenu.innerHTML = 'ᐯ';
    }
}

openMenu.addEventListener('click', () => {
    if (openMenu.innerHTML === 'ᐯ') { shiftMenu(false); return };
    if (openMenu.innerHTML === 'ᐱ') { shiftMenu(true); return };
});

saveOption.addEventListener('click', () => {
    const saveData = {
        ...playerCharInfo,
        pokemonTeam: playerCharInfo.pokemonTeam.map(poke => poke.toJSON())
    };
    localStorage.setItem("playerCharInfo", JSON.stringify(saveData));
    saveOption.innerHTML = 'Saved!';
    setTimeout(() => saveOption.innerHTML = 'Save', 1500);
});


loadOption.addEventListener('click', () => {
    const parsedData = JSON.parse(localStorage.getItem("playerCharInfo"));
    if (parsedData) {
        playerCharInfo.pokemonTeam = parsedData.pokemonTeam.map(pokeData => {
            const newPokemon = new POKEMON(pokeData);
            console.log(newPokemon);
            newPokemon.checkEvolution();
            const spriteNames = newPokemon.renderSpriteName();

            newPokemon.frontSprite = spriteNames[0];
            newPokemon.backSprite = spriteNames[1];
            return newPokemon;
        });

        if (parsedData.lastActivePokemon && playerCharInfo.pokemonTeam.length > 0) {
            playerCharInfo.lastActivePokemon = playerCharInfo.pokemonTeam.find(
                POKE => POKE.NAME === parsedData.lastActivePokemon.NAME && POKE.LEVEL === parsedData.lastActivePokemon.LEVEL
            );
            if (!playerCharInfo.lastActivePokemon) playerCharInfo.lastActivePokemon = playerCharInfo.pokemonTeam[0];
        } else if (playerCharInfo.pokemonTeam.length > 0) {
            playerCharInfo.lastActivePokemon = playerCharInfo.pokemonTeam[0];
        }

        playerCharInfo.playerInventory = parsedData.playerInventory;

        loadOption.innerHTML = 'Loaded!';
        setTimeout(() => loadOption.innerHTML = 'Load', 1500);
    }
});

seeBag.addEventListener('click', () => {
    if (!seeBag.textContent.includes('Back')) {
        toggleOptions(false, seeBag);
        bagListContainer.innerHTML = '';
        bagListContainer.style.display = 'flex';

        for (const itemName in playerCharInfo.playerInventory) {
            const itemCount = playerCharInfo.playerInventory[itemName];

            if (itemCount > 0) {
                const itemWrapper = document.createElement('div');
                itemWrapper.classList.add('pokeWrapper');

                const itemDiv = document.createElement('div');
                itemDiv.classList.add('option');
                itemDiv.style.backgroundColor = bagContentColors[itemName] || '#222';
                itemDiv.innerHTML = `${capitalizeWords(itemName)} x${itemCount}`;

                const infoDiv = document.createElement('div');
                infoDiv.classList.add('pokeInfo');
                infoDiv.innerHTML = 'i';

                infoDiv.addEventListener('click', () => {
                    const isOpen = itemDiv.innerHTML.includes('.');
                    displayItemDetail(itemName, itemDiv, isOpen, itemCount);
                });

                itemWrapper.appendChild(itemDiv);
                itemWrapper.appendChild(infoDiv);
                bagListContainer.appendChild(itemWrapper);
            }
        }

    } else {
        bagListContainer.style.display = 'none';
        toggleOptions(true, seeBag);
    }
});

function displayItemDetail(itemName, targetElement, isReturn, itemAmount) {
    const itemData = {
        'Potions': { desc: 'Heals a Pokémon by 1/3<br>of its maximum HP.' },
        'Pokeballs': { desc: 'Used to catch<br>wild Pokémon.' }
    }
    const displayName = capitalizeWords(itemName);
    if (!isReturn) {
        targetElement.style.padding = '14px 15px';
        targetElement.style.borderTopRightRadius = '4px';
        targetElement.style.borderBottomRightRadius = '4px';

        const displayTxt = itemData[displayName] ? itemData[displayName].desc : 'No description.';
        targetElement.innerHTML = `${displayName}<br><br>${displayTxt}<br><br>x${itemAmount}`;
    } else {
        targetElement.style.padding = '8px 15px';
        targetElement.style.borderTopRightRadius = '0px';
        targetElement.style.borderBottomRightRadius = '0px';

        targetElement.innerHTML = `${displayName} x${itemAmount}`;
    }
}

function capitalizeWords(inputString) {
    inputString = inputString
        .toLowerCase()
        .replace(/\b\w/g, (str) => str.toUpperCase());
    return inputString;
}

seePokemon.addEventListener('click', () => {
    if (!seePokemon.textContent.includes('Back')) {
        toggleOptions(false, seePokemon);
        pokemonListContainer.innerHTML = '';
        pokemonListContainer.style.display = 'flex';

        playerCharInfo.pokemonTeam.forEach((POKE, index) => {
            const pokeEntryWrapper = document.createElement('div');
            pokeEntryWrapper.classList.add('pokeWrapper');

            const pokeDiv = document.createElement('div');
            pokeDiv.classList.add('option');
            pokeDiv.style.backgroundColor = typeColors[POKE.TYPE[0]] || typeColors['N'];
            pokeDiv.innerHTML = `${POKE.NAME} Lv. ${POKE.LEVEL}`;

            const infoDiv = document.createElement('div');
            infoDiv.classList.add('pokeInfo');
            infoDiv.innerHTML = 'i';

            infoDiv.addEventListener('click', () => {
                const isOpen = pokeDiv.innerHTML.includes('XP');
                displayPokeStats(POKE, pokeDiv, isOpen);
            });


            const promoteDiv = document.createElement('div');
            promoteDiv.classList.add('promoteDiv');
            promoteDiv.innerHTML = '^';

            promoteDiv.addEventListener('click', () => {
                playerCharInfo.pokemonTeam.splice(index, 1);
                playerCharInfo.pokemonTeam.unshift(POKE);

                playerCharInfo.lastActivePokemon = POKE;

                const firstChild = pokemonListContainer.firstElementChild;

                pokeEntryWrapper.classList.add('movingToTop');

                pokeEntryWrapper.addEventListener('animationend', () => {
                    pokemonListContainer.insertBefore(pokeEntryWrapper, firstChild);
                    pokeEntryWrapper.classList.remove('movingToTop');
                }, { once: true });

            });

            pokeEntryWrapper.appendChild(pokeDiv);
            pokeEntryWrapper.appendChild(infoDiv);
            pokeEntryWrapper.appendChild(promoteDiv);

            pokemonListContainer.appendChild(pokeEntryWrapper);
        });

    } else {
        pokemonListContainer.style.display = 'none';
        toggleOptions(true, seePokemon);
    }
});

seePokedex.addEventListener('click', () => {
    if (!seePokedex.textContent.includes('Back')) {
        toggleOptions(false, seePokedex);
        pokedexListContainer.innerHTML = '';
        pokedexListContainer.style.display = 'flex';

        const sortedPoke = [...pokemonData].sort((a, b) =>
            a.NAME.localeCompare(b.NAME)
        );

        sortedPoke.forEach(POKE => {
            const pokeEntryWrapper = document.createElement('div');
            pokeEntryWrapper.classList.add('pokeWrapper');

            const pokeDiv = document.createElement('div');
            pokeDiv.classList.add('option');
            pokeDiv.style.backgroundColor = typeColors[POKE.TYPE[0]] || typeColors['N'];
            pokeDiv.innerHTML = `${POKE.NAME}`;

            const infoDiv = document.createElement('div');
            infoDiv.classList.add('pokeInfo');
            infoDiv.innerHTML = 'i';

            infoDiv.addEventListener('click', () => {
                const isOpen = pokeDiv.innerHTML.includes('XP');
                displayPokeStats(POKE, pokeDiv, isOpen, true);
            });

            pokeEntryWrapper.appendChild(pokeDiv);
            pokeEntryWrapper.appendChild(infoDiv);

            pokedexListContainer.appendChild(pokeEntryWrapper);
        });

    } else {
        pokedexListContainer.style.display = 'none';
        toggleOptions(true, seePokedex);
    }
});

function displayPokeStats(POKE, targetElement, isReturn, isDex = false) {
    if (!isReturn) {
        targetElement.style.padding = '14px 15px';
        targetElement.style.borderTopRightRadius = '4px';
        targetElement.style.borderBottomRightRadius = '4px';

        let statStr = '';

        if (isDex) {
            statStr = `${POKE.NAME}<br><br>Base HP: ${POKE.HP}<br>Base Attack: ${POKE.ATTACK}<br>Base Defense: ${POKE.DEFENSE}<br>Base Speed: ${POKE.SPEED}<br><br>XP: ${POKE.XP}<br>`;
        } else {
            statStr = `${POKE.NAME} Lv. ${POKE.LEVEL}<br><br>HP: ${POKE.HP}<br>Attack: ${POKE.ATTACK}<br>Defense: ${POKE.DEFENSE}<br>Speed: ${POKE.SPEED}<br><br>XP: ${POKE.XP}<br>`;
        }

        targetElement.innerHTML = statStr;
    } else {
        targetElement.style.padding = '8px 15px';
        targetElement.style.borderTopRightRadius = '0px';
        targetElement.style.borderBottomRightRadius = '0px';

        if (isDex) {
            targetElement.innerHTML = `${POKE.NAME}`;
        } else {
            targetElement.innerHTML = `${POKE.NAME} Lv. ${POKE.LEVEL}`;
        }
    }
}

function toggleOptions(isExit, targetId) {
    let targetStr = '';
    targetId === seePokedex ? targetStr = 'Pokédex' : false
    targetId === seePokemon ? targetStr = 'Pokémon' : false
    targetId === seeBag ? targetStr = 'Bag' : false

    if (!isExit) {

        menuHeader.innerHTML = targetStr;
        menuHeader.style.display = 'block';

        targetId.innerHTML = 'Back';
        targetId.style.width = 30 + '%';
        targetId.style.marginTop = 'auto';

        pokemonMenu.style.width = 50 + '%';
        pokemonMenu.style.left = 50 + '%';

        pokemonMenu.querySelectorAll('.option').forEach(x => {
            x.style.display = 'none';
        });

        targetId.style.display = 'flex';

    } else {

        targetId.innerHTML = targetStr;
        targetId.style.width = 'auto';
        targetId.style.marginTop = 0;

        menuHeader.style.display = 'none';

        pokemonMenu.style.width = 25 + '%';
        pokemonMenu.style.left = 100 + '%';

        pokemonMenu.querySelectorAll('.option').forEach(x => {
            x.style.display = 'flex';
        });
    }
}

function shiftMoveOptions() {
    battleUIContainer.classList.toggle('flipped');
}

function debug() {
    pokemonData.forEach(x => {
        const y = new POKEMON(x);
        playerCharInfo.pokemonTeam.push(y);
    });
    moveList.forEach(x => { playerCharInfo.pokemonTeam[0].MOVES.push(x) });
}


document.addEventListener('click', (e) => {
    const ELE = e.target;
    ELE.classList.forEach(x => {
        //x === 'option' ? playSound('acceptSfx', 0.26) : false;
    });
});

function playSound(fileName, time) {
    const sfx = new Audio(`audioAssets/${fileName}.mp3`);
    sfx.currentTime = time;
    sfx.play();
}

console.log("working");})
  },
  {
    category: `Utility`,
    title: `Calculator`,
    HTML: `<div class="CURSOR"></div>

<div id='calcDiv'>
	<div id="fireworkContainer"></div>
	<div id='answerContainer'><span id="blinker">|</span>
</div>
	<div id='keyContainer'>
		<div class='keyDiv' id='keyOne'>1</div>
		<div class='keyDiv' id='keyTwo'>2</div>
		<div class='keyDiv' id='keyThree'>3</div>
		<div class='keyDiv' id='keyDEL'>DEL</div>
		<div class='keyDiv' id='keyFour'>4</div>
		<div class='keyDiv' id='keyFive'>5</div>
		<div class='keyDiv' id='keySix'>6</div>
		<div class='keyDiv' id='keyAC'>AC</div>
		<div class='keyDiv' id='keySeven'>7</div>
		<div class='keyDiv' id='keyEight'>8</div>
		<div class='keyDiv' id='keyNine'>9</div>
		<div class='keyDiv' id='keyEquals'>=</div>
		<div class='keyDiv' id='keyZero'>0</div>
		<div class='keyDiv' id='keyDecimal'>.</div>
		<div class='keyDiv argKey' id='keyAdd'>+</div>
		<div class='keyDiv argKey' id='keySubtract'>-</div>
		<div class='keyDiv argKey' id='keyDivide'>/</div>
		<div class='keyDiv argKey' id='keyMultiply'>*</div>
	</div>
</div>`,
    CSS: `
body {
	top: 0;
	bottom: 0;
	right: 0;
	left: 0;
	position: fixed;
    height: 100%;
    width: 100%;
}

#calcDiv {
	width: 300px;
	margin: 40px auto;
	padding: 20px;
	border-radius: 20px;
	background: #1e1e2f;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
	font-family: "Segoe UI", sans-serif;
}

#answerContainer {
	height: 60px;
	background: #292940;
	border-radius: 10px;
	margin-bottom: 15px;
	color: #fff;
	line-height: 40px;
	overflow-x: auto;
	overflow-y: hidden;
	font-size: 2rem;
	padding: 10px;
	text-align: right;
	white-space: nowrap;
	font-family: monospace;
}

.operator {
	color: #ff6b6b;
	font-weight: bold;
}

.decimal, .number {
	color: #1dd1a1;
	font-weight: bold;
}

.bounce {
	animation: bouncey 0.3s ease;
}

@keyframes bouncey {
	0%, 100% { transform: translateY(0); }
	50% { transform: translateY(-10px); }
}

#keyContainer {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 10px;
}

.keyDiv {
	background: #3b3b5b;
	color: #fff;
	font-size: 20px;
	text-align: center;
	padding: 20px 0;
    cursor: pointer;
	border-radius: 12px;
	user-select: none;
	transition: background 0.2s, transform 0.1s;
}

.keyDiv:hover {
	background: #505071;
	transform: scale(1.05);
}

.keyDiv:active {
	background: #68689b;
}

#keyDEL,
#keyAC {
	background: #ff6b6b;
}

#keyDEL:hover,
#keyAC:hover {
	background: #ff8585;
}

#keyEquals {
	background: #00d4ff;
	grid-column: span 2;
}

#keyEquals:hover {
	background: #3aefff;
}

#keyDecimal,
#keyZero {
	grid-column: span 1;
}

.argKey {
	background: #ffb84d;
	color: #000;
}

.argKey:hover {
	background: #ffd280;
}
	
@keyframes raveClear {
	0% {
		background-color: #ff00ff;
		color: white;
		transform: scale(1) rotate(0deg);
	}
	20% {
		background-color: #00ffff;
		transform: scale(1.1) rotate(90deg);
	}
	40% {
		background-color: #ffff00;
		transform: scale(0.9) rotate(-90deg);
	}
	60% {
		background-color: #ff0000;
		transform: scale(1.2) rotate(90deg);
	}
	80% {
		background-color: #00ff00;
		transform: scale(0.8) rotate(-90deg);
	}
	100% {
		background-color: black;
		color: white;
		opacity: 0;
		transform: scale(0.5) rotate(0deg);
	}
}

.raveAnimation {
	animation: raveClear 0.7s ease-in-out forwards;
}

#fireworkContainer {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
	overflow: hidden;
	z-index: 999;
}

.firework {
	position: absolute;
	width: 6px;
	height: 6px;
	border-radius: 50%;
	background-color: #fff;
	opacity: 1;
	animation: explode 0.8s ease-out forwards;
}

@keyframes explode {
	0% {
		transform: translate(0, 0) scale(1);
		opacity: 1;
	}
	100% {
		transform: translate(var(--x), var(--y)) scale(0.5);
		opacity: 0;
	}
}

#blinker {
  animation: blink 1s step-start infinite;
	opacity:1;
}

#blinker.typing {
  animation: none;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.keyDiv:active {
 transform: scale(0.97);
  transition: transform 0.1s;
}

#answerContainer span {
  display: inline-block;
  transform: translateY(10px);
  opacity: 0;
  animation: appearUp 0.3s ease-out forwards;
}

@keyframes appearUp {
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
`,
    JS: js(() => {
var argumentStr = "";

const allKeys = document.querySelectorAll(".keyDiv");
const argKeys = document.querySelectorAll(".argKey");

allKeys.forEach((KEY) => {
	KEY.addEventListener("click", function () {
		let validKey = parseInt(KEY.innerHTML);
		if (!isNaN(validKey)) {
			const rect = KEY.getBoundingClientRect();
	const x = rect.left + rect.width / 2;
	const y = rect.top + rect.height / 2;
			argumentStr += `${parseInt(KEY.innerHTML)}`;
			argumentStr = argumentStr.trimStart();
			changeAnswerContents(argumentStr);
		}
	});
});

argKeys.forEach((KEY) => {
	KEY.addEventListener("click", function () {
		const testArg = argumentStr.replace(/\s+/g, "");
		const isArgTrue = /^[e0-9+\-*/().\s]+$/.test(testArg);
		console.log(testArg, isArgTrue);
		if (isArgTrue) {
			console.log(KEY.innerHTML)
			argumentStr += `${(KEY.innerHTML)}`;
			changeAnswerContents(argumentStr);
		}
	});
});

function currentNumberHasDecimal(str) {
	const cleanStr = str.replace(/\s+/g, '');
	const numbers = cleanStr.split(/[\+\-\*\/×÷]/);
	const currentNum = numbers[numbers.length - 1];
	const decimalCount = (currentNum.match(/\./g) || []).length;
	return decimalCount > 0;
}

keyDecimal.addEventListener('click', (e) => {
	if(argumentStr && !currentNumberHasDecimal(argumentStr)) {
		let isValid = false;
		const isValidEnd = argumentStr[argumentStr.length - 1];
		isValidEnd === '.' ? isValid = false : isValid = true;
		isValid === true ? argumentStr += '.' : false;
		console.log(argumentStr, isValidEnd, isValid)
		changeAnswerContents(argumentStr);
	}
});

keyEquals.addEventListener('click', (e) => {
	if (argumentStr) {
		const answerStr = eval(argumentStr);
		createFireworkEffect();
		argumentStr = answerStr.toString();
		changeAnswerContents(answerStr.toString());
	}
});

keyAC.addEventListener('click', (e) => {
	if (argumentStr) {
		answerContainer.classList.add('raveAnimation');
		setTimeout(() => {
			argumentStr = '';
			changeAnswerContents(argumentStr);
			answerContainer.classList.remove('raveAnimation');
			answerContainer.innerHTML = '...';
		}, 700);
	}
});

keyDEL.addEventListener('click', (e) => {
	if (argumentStr) {
		const replaceArg = argumentStr.replace(/\s+/g, '');
		const newArg = replaceArg.slice(0, -1);
		argumentStr = newArg;
		changeAnswerContents(argumentStr);
	}
});

function changeAnswerContents(str) {
	const coloredStr = str.replace(/([+\-*/])|(\d*\.\d+)|(\d+)/g, (match, operator, decimal, number) => {
		if (operator) return `<span class="operator">${operator}</span>`;
		if (decimal) return `<span class="decimal">${decimal}</span>`;
		if (number) return `<span class="number">${number}</span>`;
		return match;
	});

	const tempDiv = document.createElement("div");
	tempDiv.innerHTML = coloredStr;
	const spans = tempDiv.querySelectorAll("span");
	let lastClass = "number";

	if (spans.length > 0) {
		lastClass = spans[spans.length - 1].className;
	}
const blinker = document.getElementById("blinker");
handleTypingActivity();
		answerContainer.innerHTML = `${coloredStr}<span id="blinker" class="${lastClass}">|</span>`;
[...answerContainer.querySelectorAll('span')].forEach((el, i) => {
  if (el.id !== "blinker") {
    el.style.animationDelay = `${i * 0.02}s`;
  }
});
	
	answerContainer.classList.remove('bounce');
	void answerContainer.offsetWidth;
	answerContainer.classList.add('bounce');

	answerContainer.scrollLeft = answerContainer.scrollWidth;
}

let typingTimer;
const blinkDelay = 600;
const blinker = document.getElementById("blinker");

function handleTypingActivity() {
	clearTimeout(typingTimer);
	const blinker = document.getElementById("blinker");
	if (blinker) blinker.classList.add("typing");

	typingTimer = setTimeout(() => {
		const blinker = document.getElementById("blinker");
		if (blinker) blinker.classList.remove("typing");
	}, blinkDelay);
}

function createFireworkEffect() {
	const amountOfParticles = 50;
	const fireworkContainer = document.getElementById('fireworkContainer');

	for (let i = 0; i < amountOfParticles; i++) {
		const particle = document.createElement('div');
		particle.classList.add('firework');

		const x = (Math.random() - 0.5) * 500 + 'px';
		const y = (Math.random() - 0.5) * 500 + 'px';

		particle.style.setProperty('--x', x);
		particle.style.setProperty('--y', y);
		particle.style.left = '50%';
		particle.style.top = '50%';
		particle.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 70%)`;

		fireworkContainer.appendChild(particle);

		setTimeout(() => {
			particle.remove();
		}, 800);
	}
}

document.addEventListener('keydown', function(e) {
	const key = e.key;
	if (!isNaN(key)) {
		const BTN = [...allKeys].find(k => k.innerText === key);
		if (BTN) BTN.click();
	} else if (['+', '-', '*', '/', '(', ')'].includes(key)) {
		const BTN = [...argKeys].find(k => k.innerText === key);
		if (BTN) BTN.click();
	} else if (key === '.' && keyDecimal) {
		keyDecimal.click();
	} else if (key === 'Enter') {
		e.preventDefault();
		keyEquals.click();
	} else if (key === 'Backspace') {
		keyDEL.click();
	} else if (key.toLowerCase() === 'a') {
		keyAC.click();
	}
});

    })
  }
];