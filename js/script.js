//hegyek:
//(sor, oszlop) => (2,2), (4,9), (6,4), (9,10), (10,6)

//---------------------------main----------------------------------
const board = document.querySelector("#gameboard")
const actElementBoard = document.querySelector("#act-element-board")
const actElementTimeSpan = document.querySelector("#act-element-time")
const rotateButton = document.querySelector("#rotate-element")
const mirrorButton = document.querySelector("#mirror-element")
const timeLeftText = document.querySelector("#time-left-paragraph")
const challengesTable = document.querySelector("#challenges")
// const seasonsTable = document.querySelector("#seasons-table")
const springPointsSpan = document.querySelector("#spring-points-span")
const summerPointsSpan = document.querySelector("#summer-points-span")
const autumnPointsSpan = document.querySelector("#autumn-points-span")
const winterPointsSpan = document.querySelector("#winter-points-span")
const summedPointsParagraph = document.querySelector("#summed-points-paragraph")
const actualSeasonParagraph = document.querySelector("#actual-season-paragraph")

const elementSize = 3;
const boardSize = 11;
const challengesCount = 4;
const yearLength = 28;
const seasonLength = 7;

let gameOver = false;

let actualElement;
let actualDate = 0;
let actualSeason = "";

let actualChallenges = []

let springPoints = 0;
let summerPoints = 0;
let autumnPoints = 0;
let winterPoints = 0;

generateTable(boardSize, board);
placeMountains();
generateTable(elementSize, actElementBoard)
rerollActualElement();
drawActualElement(actualElement, actElementBoard)
setActualElementTime(actualElement.time, actElementTimeSpan)
displayActualTime()
generateTable(2, challengesTable)
//rollChallenges()
displayChallenges(challengesTable)

if(!gameOver){
    delegate(board, "mouseover", "td", mouseHoverEnter)
    delegate(board, "mouseout", "td", mouseHoverLeave)

    delegate(board, "click", "td", placeElement)

    delegate(rotateButton, "click", "button", rotateActualElementShape)
    delegate(mirrorButton, "click", "button", mirrorActualElementShape)
}


//---------------------------functions--------------------------------

function displayActualSeason(){
    // console.log("season: "+actualSeason)
    switch(actualSeason){
        case "spring":
            actualSeasonParagraph.innerText = "Jelenlegi évszak: Tavasz (A B)"
            break;
        case "summer":
            actualSeasonParagraph.innerText = "Jelenlegi évszak: Nyár (B C)"
            break;
        case "autumn":
            actualSeasonParagraph.innerText = "Jelenlegi évszak: Ősz (C D)"
            break;
        case "winter":
            actualSeasonParagraph.innerText = "Jelenlegi évszak: Tél (A D)"
            break;
        default:
    }
}

function updateSeason() {
    let actSeasonNumber = Math.floor(actualDate / seasonLength)
    // console.log("season num: "+actSeasonNumber)
    switch(actSeasonNumber){
        case 0:
            actualSeason = "spring"
            break;
        case 1:
            actualSeason = "summer"
            break;
        case 2:
            actualSeason = "autumn"
            break;
        case 3:
            actualSeason = "winter"
            break;
        default:
    }
    displayActualSeason()
}

function updatePoints(pointsToAdd) {
    switch(actualSeason){
        case "spring":
            springPoints += pointsToAdd
            break;
        case "summer":
            summerPoints += pointsToAdd
            break;
        case "autumn":
            autumnPoints += pointsToAdd
            break;
        case "winter":
            winterPoints += pointsToAdd
            break;
        default:
    }
    springPointsSpan.innerText = ""+springPoints+" pont"
    summerPointsSpan.innerText = ""+summerPoints+" pont"
    autumnPointsSpan.innerText = ""+autumnPoints+" pont"
    winterPointsSpan.innerText = ""+winterPoints+" pont"
    let sum = springPoints + summerPoints + autumnPoints + winterPoints
    summedPointsParagraph.innerText = "Összpontszám: "+sum+" pont"
    
}

function displayChallenges(table) {
    for (let i = 0; i < challengesCount; ++i) {
        actMission = missions["basic"][i]
        td = table.rows[Math.floor(i / 2)].cells[i % 2]
        td.innerHTML = "<h3>" + actMission["title"] + "</h3>" + actMission["description"]
        td.innerHTML += "<br><br>Küldetés: " + String.fromCharCode(65 + i)
    }
}

function displayActualTime() {
    let msg = "Évszakból hátralévő idő: "
    let time = seasonLength - (actualDate % seasonLength)
    timeLeftText.innerText = (msg + time)
}

function passTime(timeToPass) {
    actualDate += timeToPass
    displayActualTime()
    if(actualDate >= yearLength){
        gameOver = true
    }
}

function mirrorActualElementShape() {

    let shape = actualElement.shape
    let mirroredShape = []

    for (let i = 0; i < elementSize; ++i) {
        mirroredShape.push(shape[i].reverse())
    }

    actualElement.shape = mirroredShape

    clearTable(actElementBoard)
    drawActualElement(actualElement, actElementBoard)
}

function rotateActualElementShape() {

    let shape = actualElement.shape
    let rotatedShape = [[], [], []]

    for (let i = 0; i < elementSize; ++i) {
        for (let j = elementSize - 1; j > -1; --j) {
            rotatedShape[i].push(shape[j][i])
        }
    }

    actualElement.shape = rotatedShape

    clearTable(actElementBoard)
    drawActualElement(actualElement, actElementBoard)
}

function rerollActualElement() {
    actualElement = getActualElement()
}

function placeElement(event) {
    cellI = this.cellIndex
    rowI = this.closest('tr').rowIndex
    let alignmentGood = canPlaceElement(cellI, rowI);
    let elementType = actualElement.type;

    if (!alignmentGood || gameOver) {
        //Kell valahogy jelezni
        console.log("Nope, wrong placement")
    } else {
        for (let i = 0; i < elementSize; ++i) {
            for (let j = 0; j < elementSize; ++j) {

                if (rowI - 1 + i < 0 || rowI - 1 + i > 10 || cellI - 1 + j < 0 || cellI - 1 + j > 10) {
                    continue;
                }

                td = board.rows[rowI - 1 + i].cells[cellI - 1 + j]

                if (elementShape[i][j]) {
                    td.setAttribute("class", elementType)
                }
            }
        }
        passTime(actualElement.time);
        updateSeason();
        rerollActualElement();
        clearTable(actElementBoard);
        drawActualElement(actualElement, actElementBoard);
        setActualElementTime(actualElement.time, actElementTimeSpan);
        runChallengeCheck();
    }
}

function canPlaceElement(cIndex, rIndex) {
    let placable = true;
    elementShape = actualElement.shape

    let hoverArray = []                 //for 3x3 tds to draw out placable element

    for (let i = 0; i < elementSize; ++i) {
        for (let j = 0; j < elementSize; ++j) {

            if (rIndex - 1 + i < 0 || rIndex - 1 + i > 10 || cIndex - 1 + j < 0 || cIndex - 1 + j > 10) {
                //non-existant td-s
                if (elementShape[i][j]) {
                    placable = false;
                }

                continue;
            }

            td = board.rows[rIndex - 1 + i].cells[cIndex - 1 + j]

            if (td.getAttribute("class") != null && elementShape[i][j]) {
                // console.log("van classja ennek a td-nek:"+ (rIndex-1+i) +":"+ (cIndex-1+j))
                placable = false;
            }
        }
    }

    return placable;
}

function mouseHoverEnter(event) {

    elementShape = actualElement.shape

    cellI = this.cellIndex
    rowI = this.closest('tr').rowIndex

    if(!canPlaceElement(cellI, rowI)){
        color = "rgb(255,120,120)"
    }else{
        color = "rgb(120,255,120)"
    }

    let hoverArray = []                 //for 3x3 tds to draw out placable element

    for (let i = 0; i < elementSize; ++i) {
        for (let j = 0; j < elementSize; ++j) {

            if (rowI - 1 + i < 0 || rowI - 1 + i > 10 || cellI - 1 + j < 0 || cellI - 1 + j > 10) {
                continue;
            }

            td = board.rows[rowI - 1 + i].cells[cellI - 1 + j]

            if (elementShape[i][j]) {
                td.style.backgroundColor = color
            }
        }
    }
}

function mouseHoverLeave(event) {

    cellI = this.cellIndex
    rowI = this.closest('tr').rowIndex

    for (let i = 0; i < elementSize; ++i) {
        for (let j = 0; j < elementSize; ++j) {

            if (rowI - 1 + i < 0 || rowI - 1 + i > 10 || cellI - 1 + j < 0 || cellI - 1 + j > 10) {
                continue;
            }

            td = board.rows[rowI - 1 + i].cells[cellI - 1 + j]
            td.style.backgroundColor = null
        }
    }
}

//places predetermined constant mountains on gameboard
function placeMountains() {

    mountains.forEach(m => {
        td = board.rows[m.x].cells[m.y];
        td.setAttribute("class", "mountain");
    })
}

function getRandomInteger(max) {
    return Math.floor(Math.random() * max);
}

//picks random from elements
function getActualElement() {
    max = elements.length
    indexOfChosenOne = getRandomInteger(max)

    return elements[indexOfChosenOne]
}

function setActualElementTime(timeToSet, span) {
    if(gameOver){
        span.innerText = "";
        return;
    }
    // console.log(timeToSet)
    // console.log(typeof timeToSet)
    span.innerText = "🕗: " + timeToSet
}

//draws to act-element board (might rework for all purpose later)
function drawActualElement(elementToDraw, targetTable) {
    if(gameOver){
        return;
    }
    elementShape = elementToDraw.shape
    elementType = elementToDraw.type

    for (let i = 0; i < elementSize; ++i) {
        for (let j = 0; j < elementSize; ++j) {

            if (elementShape[i][j]) {

                td = targetTable.rows[i].cells[j]
                td.setAttribute("class", elementType)

            }
        }
    }
}

function clearTable(targetTable) {
    let rowCount = targetTable.rows.length;
    let colCount;

    for (let i = 0; i < rowCount; ++i) {

        colCount = targetTable.rows[i].cells.length;
        // console.log(colCount)

        for (let j = 0; j < colCount; ++j) {
            td = targetTable.rows[i].cells[j]
            td.setAttribute("class", null)
            // console.log("td set to null")
        }
    }
}

function generateTable(n, t) {

    for (let i = 0; i < n; ++i) {

        let tr = document.createElement("tr");

        for (let j = 0; j < n; ++j) {

            let td = document.createElement("td")
            tr.appendChild(td)

            // console.log("i: "+i+", j: "+j)
        }

        t.appendChild(tr)

    }
}

function delegate(parent, type, selector, handler) {
    parent.addEventListener(type, function (event) {
        const targetElement = event.target.closest(selector)
        if (this.contains(targetElement)) handler.call(targetElement, event)
    })
}