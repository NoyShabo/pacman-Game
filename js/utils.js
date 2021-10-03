function printMat(mat, selector) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            var className = 'cell cell' + i + '-' + j;
            if (cell === WALL)
                className += ' wall';
            else if (cell === WALLPRO)
                className += ' wallPro';
            if ((i === 0 && (j < 15 || (j > 16 && j < 31))) ||
                (i === mat.length - 1 && ((j > 0 && j < 15) || j > 16)) ||
                ((i === 2 || i === 8) && ((j > 2 && j < 11) || (j > 20 && j < 29))))
                className += ' wallRow';
            if ((i === 0 || i === mat.length - 1) && j === 14 || ((i === 2 || i === 8) && (j === 10 || j === 28)) ||
                (i === 10 && j === 31) || (i === 0 && j === 31))
                className += ' wallColRight';
            if (((i === 0 || i === 10) && (j === 0 || j === 17)) || ((i === 2 || i === 8) && (j === 3 || j === 21)))
                className += ' wallColLeft';
            if ((i > 2 && i < 10 && j === 0) || (i > 0 && i < 8 && j === 31) || ((i > 3 && i < 7 && (j === 2 || j === 29))))
                className += ' wallColBothSide';
            if (((i === 2 || i === 10) && j == 0) || (i === 7 && j === 31) || ((i === 3 || i === 6) && (j === 2 || j === 29)))
                className += ' wallRowDown';
            if (i === 0 && j === 31)
                className += ' wallRowUP';
            strHTML += '<td class="' + className + '"> ' + cell + ' </td>'

        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}

// location such as: {i: 2, j: 7}
function renderCell(location, value, ghostColor = null) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    if (value === GHOST) {
        elCell.classList.add('ghost');
        elCell.style.backgroundColor = gPacman.isSuper ? 'blue' : ghostColor;
    } else {
        if (elCell.classList.contains('ghost'))
            elCell.classList.remove('ghost');
        elCell.style.backgroundColor = 'black';
    }
    elCell.innerHTML = value;

}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function get_random_color() {
    var color = "";
    for (var i = 0; i < 3; i++) {
        var sub = Math.floor(Math.random() * 256).toString(16);
        color += (sub.length == 1 ? "0" + sub : sub);
    }
    return "#" + color;
}