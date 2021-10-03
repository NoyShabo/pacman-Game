'use strict';
const WALL = '2';
const FOOD = '&bull;';
const EMPTY = '';
const CHERRY = '🍒'
const POWER_FOOD = '⚪️';
const WALLPRO = '3';

var gTimerInterval;
var gTimer = {
    msec: 0,
    sec: 0,
    min: 0,
    hur: 0
};


window.onload = init;

var gBoard;
var gIntervalCherry;
var gGame = {
    score: 0,
    isOn: false
};

function init() {
    document.addEventListener('keydown', changePacImg);
    hideModal();
    restartTimer();
    pacmanEats = 0;
    updateScore(0)
    gBoard = buildBoard();
    setBTNReatart();
    createPacman(gBoard);
    createGhosts(gBoard);
    printMat(gBoard, '.board-container');
    setCherryInterval();
    gGame.isOn = true;
}

function setBTNReatart() {
    var elBtn = document.querySelector('button');
    elBtn.onclick = init;
}

function restartTimer() {
    var theTime = gTimer.hur + ':' + gTimer.min + ':' + gTimer.sec + ':' + gTimer.msec;
    var getTimer = document.querySelector('.timer')
    getTimer.innerHTML = theTime;


}


function myTimer() {
    gTimer.msec = gTimer.msec + 1;
    if (gTimer.msec === 1000) {
        gTimer.msec = 0;
        gTimer.sec += 1;
    }
    if (gTimer.sec === 60) {
        gTimer.sec = 0;
        gTimer.min += 1;
    }
    if (gTimer.min === 60) {
        gTimer.min = 0;
        gTimer.hur += 1;
    }
    if (gTimer.hur === 24) {
        gTimer.hur = 0;
        clearInterval(gTimerInterval);
        liveTimer = null;
    }
    var theTime = gTimer.hur + ':' + gTimer.min + ':' + gTimer.sec + ':' + gTimer.msec;
    var getTimer = document.querySelector('.timer')
    getTimer.innerHTML = theTime;
}

function buildBoard() {
    var SIZE = 11;
    var SIZEJ = 32;
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZEJ; j++) {
            board[i][j] = FOOD;
            if (i === 0 || i === SIZE - 1 ||
                j === 0 || j === SIZEJ - 1 ||
                (j === 12 && i > 2 && i < SIZE - 3) ||
                (j === 19 && i > 2 && i < SIZE - 3) ||
                (i === 7 && j > 12 && j < SIZEJ - 13) ||
                (i === 3 && j > 12 && j < SIZEJ - 13) ||
                (i === 2 && j > 2 && j < SIZEJ - 21) ||
                (i === 2 && j > 20 && j < SIZEJ - 3) ||
                (i === SIZE - 3 && j > 2 && j < SIZEJ - 21) ||
                (i === SIZE - 3 && j > 20 && j < SIZEJ - 3) ||
                (j === 2 && i > 3 && i < SIZE - 4) ||
                (j === SIZEJ - 3 && i > 3 && i < SIZE - 4)
            ) {
                board[i][j] = WALL;
            }
            if ((i > 3 && j > 3 && i < 7 && j < 11) ||
                (i > 3 && j > SIZEJ - 12 && i < 7 && j < SIZEJ - 4)
            ) {
                // WALLPRO
                board[i][j] = WALLPRO;
            }
            if (i > 3 && j > 12 && i < 7 && j < 19) {
                board[i][j] = EMPTY;
            }
        }
    }
    board[3][15] = board[3][16] = FOOD;
    board[0][15] = board[0][16] = FOOD;
    board[SIZE - 1][15] = board[SIZE - 1][16] = FOOD;
    board[2][0] = board[1][0] = FOOD;
    board[SIZE - 3][SIZEJ - 1] = board[SIZE - 2][SIZEJ - 1] = FOOD;
    board[1][SIZEJ - 2] = board[3][7] = POWER_FOOD;
    board[SIZE - 4][SIZEJ - 8] = board[9][1] = POWER_FOOD;
    return board;
}

// update model and dom
function updateScore(diff) {
    //model
    gGame.score += diff;

    if (diff === 0) {
        gGame.score = 0;
    }
    //dom
    var elScore = document.querySelector('h2 span');
    elScore.innerText = gGame.score;

}

function gameOver(isWin) {
    resetTimer();
    var elModal = document.querySelector('.modal');
    elModal.style.display = 'block';
    var elH1 = document.querySelector('h1');
    elH1.innerText = isWin;
    gGame.isOn = false;
    clearInterval(gIntervalGhosts);
    clearInterval(gIntervalCherry);
    gIntervalGhosts = null;
}

function hideModal() {
    var elModal = document.querySelector('.modal');
    elModal.style.display = 'none';
}

function setCherryInterval() {
    gIntervalCherry = setInterval(() => {
        randomCherry();
    }, 15000);
}

function randomCherry() {
    var emptyCells = findEmptyCells();
    if (emptyCells.length === 0) return;
    var randomCell = emptyCells[getRandomIntInclusive(0, emptyCells.length - 1)];
    gBoard[randomCell.i][randomCell.j] = CHERRY;
    renderCell(randomCell, CHERRY);
}

function findEmptyCells() {
    var EmptyCells = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j] === EMPTY) {
                EmptyCells.push({ i: i, j: j });
            }
        }
    }
    return EmptyCells;
}

function moveUnderGround(nextLocation) {
    if (nextLocation.i === gBoard.length) {
        nextLocation.i = 0;
        return nextLocation;
    }
    if (nextLocation.i === -1) {
        nextLocation.i = gBoard.length - 1;
        return nextLocation;
    }
    if (nextLocation.j === gBoard[0].length) {
        nextLocation.j = 0;
        nextLocation.i = 1;
        return nextLocation;
    }
    if (nextLocation.j === -1) {
        nextLocation.j = gBoard[0].length - 1;
        nextLocation.i = gBoard.length - 2;
        return nextLocation;
    }
}

function resetTimer() {
    clearInterval(gTimerInterval);
    gTimerInterval = null;
    gTimer.msec = 0;
    gTimer.sec = 0;
    gTimer.min = 0;
    gTimer.hur = 0;
}