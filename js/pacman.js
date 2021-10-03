'use strict';
const PACMAN = '<img class="pacman" src="imgs/pac.png">';
var gMusicGame;

var gPacman;
var pacmanEats = 0;
var gIntervalPowerFood;

function createPacman(board) {
    gPacman = {
        location: {
            i: 8,
            j: 17
        },
        isSuper: false
    };
    board[gPacman.location.i][gPacman.location.j] = PACMAN;
}

function powerFood() {
    gPacman.isSuper = true;
    setTimeout(function() {
        gPacman.isSuper = false;
    }, 5000);
}

function pacmanEatsFood() {
    pacmanEats++;
    if (pacmanEats === 1) {
        gTimerInterval = setInterval(myTimer, 1);
        gMusicGame = new Audio('./audio/pac.mp3');
        gMusicGame.play();
    }
    updateScore(1);
    var eatSound = new Audio('./audio/eatsound.mp3');
    eatSound.play();

    if (pacmanEats === 155) {
        gameOver('You Win !');
        setTimeout(() => {
            gMusicGame.pause();
        }, 3000);
    }
}

function pacmanEatsGhost(nextCell) {
    console.log('pacman eat ghost');
    var i = 0;
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;
    renderCell(gPacman.location, EMPTY);

    var deadGhost = null;
    for (; i < gGhosts.length; i++) {
        var currGhostPos = gGhosts[i].location
        if (nextCell.i === currGhostPos.i && nextCell.j === currGhostPos.j) {
            deadGhost = gGhosts.splice(i, 1)[0];
            if (deadGhost.currCellContent === FOOD) pacmanEatsFood();
            if (deadGhost.currCellContent === CHERRY) updateScore(10);
            deadGhost.currCellContent = EMPTY;
            // deadGhost.location = { i: }
            gPacman.location = nextCell;
            gBoard[nextCell.i][nextCell.j] = PACMAN;
            renderCell(nextCell, PACMAN);
            break;
        }
    }

    if (deadGhost !== [] || !deadGhost)
        var intervalGhostZombie = setInterval(() => {
            if (!gPacman.isSuper) {
                gGhosts.push(deadGhost);
                clearInterval(intervalGhostZombie);
            }
        }, 1);
}

function movePacman(ev) {
    if (!gGame.isOn) return;
    // : use getNextLocation(), nextCell
    var nextLocation = getNextLocation(ev);
    if (nextLocation.i === -1 || nextLocation.i === gBoard.length ||
        nextLocation.j === -1 || nextLocation.j === gBoard[0].length)
        moveUnderGround(nextLocation);
    var nextCellContent = gBoard[nextLocation.i][nextLocation.j];
    if (nextCellContent === WALL) return;
    if (nextCellContent === WALLPRO) return;
    else if (nextCellContent === FOOD) pacmanEatsFood();
    else if (nextCellContent === POWER_FOOD && gPacman.isSuper) return
    else if (nextCellContent === POWER_FOOD) powerFood();
    else if (nextCellContent === CHERRY) updateScore(10);
    else if (nextCellContent === GHOST && !(gPacman.isSuper)) {
        gameOver('looser');
        return;
    } else if (nextCellContent === GHOST && gPacman.isSuper) {
        pacmanEatsGhost(nextLocation);
        return;
    }

    // : moving from corrent position:
    // : update the model
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;
    // : update the DOM
    renderCell(gPacman.location, EMPTY);
    // : Move the pacman to new location
    gPacman.location = nextLocation;
    // : update the model
    gBoard[nextLocation.i][nextLocation.j] = PACMAN;
    // : update the DOM
    renderCell(nextLocation, PACMAN);
}


function getNextLocation(ev) {

    var nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    };
    // : figure out nextLocation
    switch (ev.key) {
        case 'ArrowDown':
            nextLocation.i++;
            break;
        case 'ArrowUp':
            nextLocation.i--;
            break;
        case 'ArrowRight':
            nextLocation.j++;
            break;
        case 'ArrowLeft':
            nextLocation.j--;
            break;
    }
    return nextLocation;
}

function changePacImg(ev) {
    var elPacman = document.querySelector('.pacman');
    switch (ev.key) {
        case 'ArrowDown':
            elPacman.style.transform = 'rotate(90deg)';
            break;
        case 'ArrowUp':
            elPacman.style.transform = 'rotate(270deg)';
            break;
        case 'ArrowRight':
            elPacman.style.transform = 'rotate(0deg)';
            break;
        case 'ArrowLeft':
            elPacman.style.transform = 'rotate(180deg)';
            break;
    }

}
