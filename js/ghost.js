'use strict';
const GHOST = '1';

var gGhosts;
var gIntervalGhosts;

// 3 ghosts and an interval
function createGhosts(board) {
    gGhosts = [];
    createGhost(board);
    createGhost(board);
    createGhost(board);
    gIntervalGhosts = setInterval(moveGhosts, 300);
}

function createGhost(board) {
    var ghost = {
        location: {
            i: 5,
            j: 15
        },
        currCellContent: EMPTY,
        color: get_random_color()
    };
    gGhosts.push(ghost);

    board[ghost.location.i][ghost.location.j] = GHOST;
}



// : loop through ghosts
function moveGhosts() {
    for (var i = 0; i < gGhosts.length; i++) {
        moveGhost(gGhosts[i], i);
    }
}

// : figure out moveDiff, nextLocation, nextCell
function moveGhost(ghost, ghostIdx) {
    // { i: 0, j: 1 }
    var moveDiff = getMoveDiff();
    var nextLocation = {
        i: ghost.location.i + moveDiff.i,
        j: ghost.location.j + moveDiff.j,
    };
    if (nextLocation.i === -1 || nextLocation.i === gBoard.length ||
        nextLocation.j === -1 || nextLocation.j === gBoard[0].length)
        moveUnderGround(nextLocation);
    var nextCellContent = gBoard[nextLocation.i][nextLocation.j]; //

    // : return if cannot move
    if (nextCellContent === WALL) return;
    if (nextCellContent === WALLPRO) return;

    if (nextCellContent === GHOST) return;
    // : hitting a pacman?  call gameOver
    if (nextCellContent === PACMAN && !gPacman.isSuper) {
        gameOver('Looser ');
        return;
    }

    if (nextCellContent === PACMAN && gPacman.isSuper) {
        ghostEattenByPac(nextLocation, ghost, ghostIdx);
        return;
    }

    gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent;
    // : update the DOM
    renderCell(ghost.location, ghost.currCellContent);
    // : Move the ghost to new location
    ghost.currCellContent = nextCellContent; //

    ghost.location = nextLocation;
    // : update the model
    gBoard[nextLocation.i][nextLocation.j] = GHOST;
    // : update the DOM
    renderCell(nextLocation, GHOST, ghost.color);
}


function ghostEattenByPac(nextPos, ghost, ghostIdx) {
    console.log('ghost eat pacman');
    gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent;
    renderCell(ghost.location, ghost.currCellContent);

    var deadGhost = gGhosts.splice(ghostIdx, 1)[0];
    deadGhost.location = nextPos;
    deadGhost.currCellContent = EMPTY;
    // deadGhost.currCellContent = EMPTY;

    var intervalDeadGhost = setInterval(() => {
        if (!gPacman.isSuper) {
            if (deadGhost.location === gPacman.location)
                deadGhost.currCellContent = PACMAN;
            gGhosts.push(deadGhost);
            clearInterval(intervalDeadGhost);
        }
    }, 1);
}




function getMoveDiff() {
    var randNum = getRandomIntInclusive(1, 100);
    if (randNum <= 25) {
        return { i: 0, j: 1 };
    } else if (randNum <= 50) {
        return { i: -1, j: 0 };
    } else if (randNum <= 75) {
        return { i: 0, j: -1 };
    } else {
        return { i: 1, j: 0 };
    }
}

// function getGhostHTML(ghost) {
//     return `<span style="color:${ghost.color}">${GHOST}</span>`;
// }