// variables declaration
let Maze;   // Will hold muilti dimensional array of Maze
let MazeWidth;  
let MazeHeight;
let startPointX = -1;
let startPointY = -1;
let endingPointX = -1;
let endingPointY = -1;
const BlankSpace = ' ';

//Load text file of maze as input.
var openFile = function(event) {
    let input = event.target;
    let reader = new FileReader();

    reader.onload = function() {
        let text = reader.result;
        convertMazeStringToArray(reader.result);
        $('#wrapper').append('<button id="solveBtn" onclick="onClickSolve()">Solve It</button>');
    };
    reader.readAsText(input.files[0]);
};

/*
* This below function will convert input from text file to multi dimensional array of Maze.
* Create maze in tile format where # represents wall and white tile as blank space.
* Also sets start point "S" and end point "E".
*/
function convertMazeStringToArray(mazeString) {
    Maze = new Array();
    let tempArr = mazeString.split('\n');
    let ele = $("<div></div>");

    for(let i =0; i < tempArr.length; i++) {
        Maze[i] = new Array();

        for(let j=0; j < tempArr[i].length; j++) {

            Maze[i][j] = tempArr[i].charAt(j);
            setTitle(ele, Maze[i][j]);
            setStartAndEndpoints(i, j);
        }
        ele.append("<br />");
    }
    $('#mazeInput').append(ele);

    MazeHeight = Maze.length;
    MazeWidth = Maze[0].length;
}

function setTitle (element, tileChar) {
    if (tileChar == "#") {
        element.append("<span class='tile wall'> </span>");
    } else if (tileChar == "*") {
        element.append("<span class='tile path'> </span>");
    }  else {
        element.append("<span class='tile'>" + tileChar + "</span>");
    }
}

function setStartAndEndpoints (pointX, pointY) {
    let point = Maze[pointX][pointY];
    if (point == "S") {
        startPointX = pointX;
        startPointY = pointY;
        Maze[pointX][pointY] = " ";
    } else if (point == "F") {
        endingPointX = pointX;
        endingPointY = pointY;
        Maze[pointX][pointY] = " ";
    }
}

function solveMaze(X, Y)
{
    Maze[X][Y] = "*";
    // Check if cursor reached to finish point
    if (X == endingPointX && Y == endingPointY) {
        displaySolvedMaze();
        return true;
    }
    
    if (Y > 0 && Maze[X][Y - 1] == BlankSpace && solveMaze(X, Y - 1)) {
        return true;
    }
    
    if (Y < MazeWidth && Maze[X][Y + 1] == BlankSpace && solveMaze(X, Y + 1)) {
        return true;
    }
    
    if (X > 0 && Maze[X - 1][Y] == BlankSpace && solveMaze(X - 1, Y)) {
        return true;
    }
    
    if (X < MazeHeight && Maze[X + 1][Y] == BlankSpace && solveMaze(X + 1, Y)) {
        return true;
    }

    Maze[X][Y] = BlankSpace;
    return false;
}

function displaySolvedMaze () {
    let ele = $("<div></div>");

    for(let i=0; i < Maze.length; i++) {
        for(let j=0; j < Maze[i].length; j++) {

            let char = Maze[i][j];
            setTitle(ele, char);
        }
        ele.append("<br />");
    }
    $('#output').append(ele)
}

function onClickSolve () {
    $("#solveBtn").remove();
    if (endingPointX == -1 || endingPointY == -1 ) {
        $("#status").html('Finish point is not defined');
    } else if (startPointX == -1 || startPointY == -1) {
        $("#status").html('Start point is not defined');
    } else {
        let isSolved = solveMaze(startPointX, startPointY);
        if (!isSolved) {
            $("#status").html('Sorry no solution found!!!');
        } else {
            $("#status").html('Solution found!!!');
        }
    }
}