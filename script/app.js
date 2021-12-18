const gameGrid = document.getElementById("game-grid");
const allTiles = Array.from(document.querySelectorAll('td'));
const revengeBtn = document.getElementById("revenge-btn");
const quitButton = document.getElementById("quit-btn");
const restartBtn = document.getElementById("restart-btn");

let firstTurns;

firstTurns = prompt("who will go first? Red or blue? (blue will be the default if not specified", "blue");
firstTurns = firstTurns === 'Red'.toLowerCase() ? 'blue' : 'red';

let turn = changeTurn(firstTurns);

let board = [
  '', '', '',
  '', '', '',
  '', '', ''
];

/*
*   [0], [1], [2],
*   [3], [4], [5],
*   [6], [7], [8]
* */

const winningConditions = [
  //row
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  //column
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  //diagonal
  [0, 4, 8],
  [2, 4, 6]
];


function setOwner(t, targetEl) {
  if (t === 'blue') {
    targetEl.dataset.owner = 'blue';
  } else if (t === 'red') {
    targetEl.dataset.owner = 'red';
  }
}

function removeOwner() {
  allTiles.forEach(tile => {
    delete tile.dataset.owner;
    delete tile.dataset.haveOwner;
    tile.innerHTML = '';
  });
  document.getElementById("winner-popup").classList.add('hidden-popup');
}

function gameState() {
  let activeGames = true;
  if ((!board.includes('') && hasWinner()) || hasWinner() || (!board.includes('') && !hasWinner())) {
    activeGames = false;
  }
  return activeGames;
}

let blueScore = 0, redScore = 0;

function setScore(winner) {
  if (winner === 'blue') {
    blueScore++;
  } else if (winner === 'red') {
    redScore++;
  } else {
    return;
  }

  return [blueScore, redScore];
}

function outputScore(winner) {
  const redScoreOutput = document.getElementById('players--red-scores');
  const blueScoreOutput = document.getElementById('players--blue-scores');

  const [blueScore, redScore] = setScore(winner);

  redScoreOutput.textContent = `${redScore}`;
  blueScoreOutput.textContent = `${blueScore}`;
}

function hasWinner() {
  let hasWinner = false;
  for (let i = 0; i <= winningConditions.length - 1; i++) {
    const winningCondition = winningConditions[i];
    const a = board[winningCondition[0]];
    const b = board[winningCondition[1]];
    const c = board[winningCondition[2]];

    if (a === '' || b === '' || c === '') {
      continue;
    }
    if (a === b && b === c) {
      hasWinner = true;
      break;
    }

    if (!board.includes('')) {
      return false;
    }
  }
  return hasWinner;
}

function updatePlayerUiTurns() {
  if (turn === 'red') {
    document.querySelector('.players--blue').classList.add('grayscale');
    document.querySelector('.players--red').classList.remove('grayscale');
  } else {
    document.querySelector('.players--blue').classList.remove('grayscale');
    document.querySelector('.players--red').classList.add('grayscale');
  }
}

updatePlayerUiTurns();

function game(targetEl) {
  let content;
  let contentTemplate;
  if (turn === 'blue' && !haveOwner(targetEl)) {
    contentTemplate = document.getElementById('cross-template');
    setOwner('blue', targetEl);
    turn = changeTurn('blue');
  } else if (turn === 'red' && !haveOwner(targetEl)) {
    contentTemplate = document.getElementById('ellipse-template');
    setOwner('red', targetEl);
    turn = changeTurn('red');
  }
  board[allTiles.indexOf(targetEl)] = targetEl.dataset.owner;

  if (haveOwner(targetEl)) {
    return;
  }
  content = document.importNode(contentTemplate.content, true);
  targetEl.append(content);
  updatePlayerUiTurns();
}

function changeTurn(turn) {
  if (turn === 'blue') {
    turn = 'red';
  } else if (turn === 'red') {
    turn = 'blue';
  }
  return turn;
}

function setClickedTilesToInactive(tile) {
  tile.dataset.haveOwner = 'true';
}

function haveOwner(tile) {
  if (tile.dataset.haveOwner) {
    return true;
  } else {
    return false;
  }
}

function returnWinner() {
  let winner;
  if (hasWinner() && turn === 'red' && !gameState()) {
    winner = 'blue';
  } else if (hasWinner() && turn === 'blue' && !gameState()) {
    winner = 'red';
  }
  if (!hasWinner() && !board.includes('')) {
    winner = 'draw';
  }
  return winner;
}

function switchButton() {
  document.getElementById("quit-btn").className = "secondary-button secondary-button--blue";
  document.getElementById("quit-btn").id = "revenge-btn";
  document.getElementById("revenge-btn").textContent = "leave victoriously";
  document.getElementById("revenge-btn").nextElementSibling.className = "primary-button primary-button--red";
  document.getElementById("revenge-btn").nextElementSibling.id = "quit-btn";
  document.getElementById("revenge-btn").nextElementSibling.textContent = "revenge!";
}

function createRestartBtn(root) {
  const restartBtn = document.createElement('button');
  restartBtn.className = "primary-button primary-button--blue";
  restartBtn.id = "restart-btn";
  restartBtn.textContent = "restart";
  restartBtn.addEventListener("click", () => {
    revengeBtn.click();
  });
  if (root.childElementCount > 2) {
    return;
  }
  root.append(restartBtn);
}

function disableRevengeAndLeaveBtn() {
  document.getElementById("quit-btn").setAttribute("hidden", "true");
  document.getElementById("revenge-btn").setAttribute("hidden", "true");
}

function reactivateRevengeAndLeaveBtn() {
  document.getElementById("quit-btn").removeAttribute("hidden");
  document.getElementById("revenge-btn").removeAttribute("hidden");
  if (document.getElementById("restart-btn")) {
    document.getElementById("restart-btn").remove();
  }
}

function showWinner() {
  const winnerName = document.getElementById("winner-name");
  if (hasWinner() && !gameState()) {
    document.getElementById("winner-popup").classList.remove('hidden-popup');
  }
  if (returnWinner() === 'blue') {
    winnerName.textContent = "BLUE ";
    winnerName.className = "blue-won";
    outputScore('blue');
    switchButton();
    reactivateRevengeAndLeaveBtn();
  } else if (returnWinner() === 'red') {
    winnerName.textContent = "RED ";
    winnerName.className = "red-won";
    outputScore('red');
    reactivateRevengeAndLeaveBtn();
  } else if (!board.includes('') && returnWinner() === 'draw') {
    document.getElementById("winner-popup").classList.remove('hidden-popup');
    winnerName.textContent = "a DRAW, no one";
    winnerName.className = 'draw';
    setScore('draw');
    disableRevengeAndLeaveBtn();
    createRestartBtn(document.querySelector(".button-box"));
  }
}


function init(event) {
  const tile = event.target.closest("td");
  game(tile);
  setClickedTilesToInactive(tile);
  showWinner();
}

gameGrid.addEventListener("click", init);

revengeBtn.addEventListener("click", () => {
  board = [
    '', '', '',
    '', '', '',
    '', '', ''
  ];
  removeOwner();
  updatePlayerUiTurns();
});

quitButton.addEventListener("click", () => {
  document.getElementById("winner-popup").classList.add('hidden-popup');
  gameGrid.removeEventListener("click", init);
  turn = returnWinner();
  updatePlayerUiTurns();
  // window.close();
});


