//hegyek:
//(sor, oszlop) => (2,2), (4,9), (6,4), (9,10), (10,6)
const seasons = {
    "spring": [0, 1],
    "summer": [1, 2],
    "autumn": [2, 3],
    "winter": [0, 3],
    "gamestop": [0, 0]
}

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
const springTD = document.querySelector("#spring-td")
const summerTD = document.querySelector("#summer-td")
const autumnTD = document.querySelector("#autumn-td")
const winterTD = document.querySelector("#winter-td")
const newGameBUtton = document.querySelector("#new-game-button")

const elementSize = 3;
const boardSize = 11;
const challengesCount = 4;
const yearLength = 28;
const seasonLength = 7;

let gameOver = false;

let actualElement;
let actualDate = 1;
let actualSeason = "spring";
let lastSeason = "";

let actualChallenges = []
let elementOrder = []
let elementIndex = 0;

let springPoints = 0;
let summerPoints = 0;
let autumnPoints = 0;
let winterPoints = 0;

generateTable(boardSize, board);
placeMountains();
generateTable(elementSize, actElementBoard)
rollElementOrder();
drawActualElement(actualElement, actElementBoard)
setActualElementTime(actualElement.time, actElementTimeSpan)
displayActualTime()
generateTable(2, challengesTable)
rollChallenges()
displayChallenges(challengesTable)

delegate(board, "mouseover", "td", mouseHoverEnterEventHandler)
delegate(board, "mouseout", "td", mouseHoverLeaveEventHandler)

delegate(board, "click", "td", placeElement)

delegate(rotateButton, "click", "button", rotateActualElementShape)
delegate(mirrorButton, "click", "button", mirrorActualElementShape)


//---------------------------functions--------------------------------

function iterateActualElement() {
    elementIndex += 1;
    actualElement = elements[elementOrder[elementIndex]]
}

function updateGame() {
    passTime(actualElement.time);
    updateSeason();
    if (actualSeason !== "gamestop") {
        iterateActualElement();
        clearTable(actElementBoard);
        drawActualElement(actualElement, actElementBoard);
        setActualElementTime(actualElement.time, actElementTimeSpan);
    }
}

function seasonChange() {
    runChallengeCheck();
}

function gameOverEvent() {
    let elementDiv = document.querySelector("#element-div")
    let challengesDiv = document.querySelector("#challenges-div")
    let firstColDiv = document.querySelector(".first-col-div")
    let secondColDiv = document.querySelector(".second-col-div")

    newGameBUtton.style.display = "block"
    actualSeasonParagraph.style.display = "none"
    challengesDiv.style.display = "none"
    elementDiv.style.display = "none"
    firstColDiv.style.display = "none"
    secondColDiv.style.width = "100%"
}

function rollChallenges() {
    let max = missions["completed"].length
    let chosen = []

    for (let i = 0; i < challengesCount; ++i) {
        
        let random;
        
        do {
        
            random = getRandomInteger(max);
        
        } while (chosen.includes(random))
        
        chosen.push(random)
    }

    for (let i = 0; i < challengesCount; ++i) {
        actualChallenges.push(missions["completed"][chosen[i]]);
    }
}

function setBackgroundColorOfArray(list, color) {
    list.forEach((element) => element.style.backgroundColor = color)
}

function setColorOfHr(color) {
    let allHr = document.querySelectorAll("hr")
    allHr.forEach((element) => element.style.borderColor = color)
}

function setPageBackground(alphaTop, alphaBot, picture) {
    let cssText = 'linear-gradient(rgba(255, 255, 255, ' + alphaTop + '), '
    cssText += 'rgba(255, 255, 255, ' + alphaBot + ')), '
    cssText += 'url(' + picture + ')'
    document.body.style.backgroundImage = cssText
}

function displayActualSeason() {
    let allParagraphs = document.querySelectorAll("p")

    switch (actualSeason) {
        case "spring":
            let springColor = "rgba(255, 214, 252, 0.8)";
            actualSeasonParagraph.innerText = "Jelenlegi évszak: Tavasz (A B)";

            setPageBackground(0, 0, "img/spring3.jpg")
            setBackgroundColorOfArray([springTD, board], springColor)
            setBackgroundColorOfArray(allParagraphs, springColor)
            setColorOfHr(springColor)

            break;
        case "summer":
            let summerColor = "rgba(186, 237, 152, 0.8)";
            actualSeasonParagraph.innerText = "Jelenlegi évszak: Nyár (B C)";

            setPageBackground(0.1, 0.1, "img/summer2.png")
            setBackgroundColorOfArray([summerTD, board], summerColor)
            setBackgroundColorOfArray(allParagraphs, summerColor)
            setColorOfHr(summerColor)

            break;
        case "autumn":
            let autumnColor = "rgba(255, 119, 0, 0.8)"
            actualSeasonParagraph.innerText = "Jelenlegi évszak: Ősz (C D)";

            setPageBackground(0.1, 0.1, "img/autumn6.png")
            setBackgroundColorOfArray([autumnTD, board], autumnColor)
            setBackgroundColorOfArray(allParagraphs, autumnColor)
            setColorOfHr(autumnColor)

            break;
        case "winter":
            let winterColor = "rgba(0, 123, 255, 0.8)"
            actualSeasonParagraph.innerText = "Jelenlegi évszak: Tél (A D)";

            setPageBackground(0.1, 0.1, "img/winter.avif")
            setBackgroundColorOfArray([winterTD, board], winterColor)
            setBackgroundColorOfArray(allParagraphs, winterColor)
            setColorOfHr(winterColor)

            break;
        default:
            setPageBackground(0.1, 0.1, "img/burgony.jpg")
            setBackgroundColorOfArray(allParagraphs, "rgba(250, 250, 250, 0.8)")
            break;
    }
}

function updateSeason() {
    let actSeasonNumber = Math.floor(actualDate / seasonLength);
    let prevSeason = actualSeason;
    switch (actSeasonNumber) {
        case 0:
            actualSeason = "spring";
            break;
        case 1:
            actualSeason = "summer";
            break;
        case 2:
            actualSeason = "autumn";
            break;
        case 3:
            actualSeason = "winter";
            break;
        default:
            actualSeason = "gamestop"
            break;
    }

    if (prevSeason !== actualSeason) {
        lastSeason = prevSeason
        seasonChange()
    }

    displayActualSeason()
}

function updatePoints(pointsToAdd) {
    switch (actualSeason) {
        case "summer":
            springPoints += pointsToAdd;
            break;
        case "autumn":
            summerPoints += pointsToAdd;
            break;
        case "winter":
            autumnPoints += pointsToAdd;
            break;
        case "spring":
            winterPoints += pointsToAdd;
            break;
        default:
            break;
    }
    springPointsSpan.innerText = "" + springPoints + " pont";
    summerPointsSpan.innerText = "" + summerPoints + " pont";
    autumnPointsSpan.innerText = "" + autumnPoints + " pont";
    winterPointsSpan.innerText = "" + winterPoints + " pont";
    let sum = springPoints + summerPoints + autumnPoints + winterPoints;
    summedPointsParagraph.innerText = "Összpontszám: " + sum + " pont";

}

function updateChallenges(table, points) {
    let toHighlight = seasons[actualSeason];

    // console.log(toHighlight)
    console.log(points)

    for (let i = 0; i < challengesCount; ++i) {

        actMission = actualChallenges[i];

        td = table.rows[Math.floor(i / 2)].cells[i % 2];
        td.style.backgroundColor = null;

        td.innerHTML = "<h3>" + actMission["title"] + "</h3>" + actMission["description"];
        td.innerHTML += "<br><br>Küldetés: " + String.fromCharCode(65 + i) + " <span>(" + points[i] + " pont)</span>";

        if (i === toHighlight[0] || i === toHighlight[1]) {
            td.style.backgroundColor = "rgb(120,255,120)";
        }
    }
}

function displayChallenges(table) {
    let toHighlight = seasons[actualSeason];

    for (let i = 0; i < challengesCount; ++i) {

        actMission = actualChallenges[i];

        td = table.rows[Math.floor(i / 2)].cells[i % 2];

        td.innerHTML = "<h3>" + actMission["title"] + "</h3>" + actMission["description"];
        td.innerHTML += "<br><br>Küldetés: " + String.fromCharCode(65 + i) + " <span>(0 pont)</span>";

        if (i === toHighlight[0] || i === toHighlight[1]) {
            td.style.backgroundColor = "rgb(120,255,120)";
        }
    }
}

function displayActualTime() {

    let msg = "Évszakból hátralévő idő: ";
    let time = actualDate % seasonLength;
    
    timeLeftText.innerText = (msg + time + "/7");
}

function passTime(timeToPass) {
    
    actualDate += timeToPass;
    displayActualTime();
    
    if (actualDate >= yearLength) {
        gameOver = true;
        gameOverEvent();
    }
}

function mirrorActualElementShape() {

    let shape = actualElement.shape;
    let mirroredShape = [];

    for (let i = 0; i < elementSize; ++i) {
        mirroredShape.push(shape[i].reverse())
    }

    actualElement.shape = mirroredShape;

    clearTable(actElementBoard);
    drawActualElement(actualElement, actElementBoard);
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

function rollElementOrder() {
    actualElement = getElementOrder()
}

function wrongPlacement() {
    for (let i = 0; i < boardSize; ++i) {
        for (let j = 0; j < boardSize; ++j) {
            td = board.rows[i].cells[j]

            td.style.backgroundColor = "#a83131"
        }
    }

    setTimeout(function () {
        for (let i = 0; i < boardSize; ++i) {
            for (let j = 0; j < boardSize; ++j) {
                td = board.rows[i].cells[j]

                td.style.backgroundColor = null
            }
        }
    }, 125); // for 1s = 1000ms
}

function placeElement(event) {
    cellI = this.cellIndex
    rowI = this.closest('tr').rowIndex
    let alignmentGood = canPlaceElement(cellI, rowI);
    let elementType = actualElement.type;

    if (!alignmentGood || gameOver) {
        wrongPlacement()
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
        updateGame();
        mouseHoverLeave(cellI, rowI)
        mouseHoverEnter(cellI, rowI)
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

            if (td.getAttribute("class") !== null && elementShape[i][j]) {
                // console.log("van classja ennek a td-nek:"+ (rIndex-1+i) +":"+ (cIndex-1+j))
                placable = false;
            }
        }
    }

    return placable;
}

function mouseHoverEnterEventHandler(event) {
    if(actualElement === undefined){
        return;
    }
    cellI = this.cellIndex
    rowI = this.closest('tr').rowIndex
    mouseHoverEnter(cellI, rowI);
}

function mouseHoverEnter(cellI, rowI) {

    if(actualSeason === "gamestop"){
        return;
    }

    elementShape = actualElement.shape

    if (!canPlaceElement(cellI, rowI)) {
        color = "rgb(255,120,120)"
    } else {
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

function mouseHoverLeaveEventHandler(event) {
    if(actualElement === undefined){
        return;
    }
    cellI = this.cellIndex
    rowI = this.closest('tr').rowIndex
    mouseHoverLeave(cellI, rowI);
}

function mouseHoverLeave(cellI, rowI) {

    if(actualSeason === "gamestop"){
        return;
    }

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

//picks random order of elements
function getElementOrder() {
    for (let i = 0; i < elements.length; ++i) {
        let chosen = 0;
        do {
            chosen = getRandomInteger(elements.length)
        } while (elementOrder.includes(chosen))
        elementOrder.push(chosen)
    }

    return elements[elementOrder[elementIndex]]
}

function setActualElementTime(timeToSet, span) {
    if (gameOver) {
        span.innerText = "";
        return;
    }
    span.innerText = "🕗: " + timeToSet
}

//draws to act-element board (might rework for all purpose later)
function drawActualElement(elementToDraw, targetTable) {
    if (gameOver) {
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