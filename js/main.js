//-----------------------Document elements---------------//
//gameboard
const board = document.querySelector("#gameboard")

//act element related
const actElementBoard = document.querySelector("#act-element-board")
const actElementTimeSpan = document.querySelector("#act-element-time")
const rotateButton = document.querySelector("#rotate-element")
const mirrorButton = document.querySelector("#mirror-element")

//gametime related
const timeLeftText = document.querySelector("#time-left-paragraph")
const springPointsSpan = document.querySelector("#spring-points-span")
const summerPointsSpan = document.querySelector("#summer-points-span")
const autumnPointsSpan = document.querySelector("#autumn-points-span")
const winterPointsSpan = document.querySelector("#winter-points-span")
const actualSeasonParagraph = document.querySelector("#actual-season-paragraph")

//missions related
const missionsTable = document.querySelector("#missions")
const summedPointsParagraph = document.querySelector("#summed-points-paragraph")
const springTD = document.querySelector("#spring-td")
const summerTD = document.querySelector("#summer-td")
const autumnTD = document.querySelector("#autumn-td")
const winterTD = document.querySelector("#winter-td")

//the only new game element
const newGameBUtton = document.querySelector("#new-game-button")

//-----------------------Variables-----------------------//

//gameboard, elementboard sizes
const elementSize = 3;
const boardSize = 11;

//mission related variables
const missionsCount = 4;
let actualMissions = []

//game time related variables
const seasons = {
    "spring": [0, 1],
    "summer": [1, 2],
    "autumn": [2, 3],
    "winter": [0, 3],
    "gamestop": [0, 0]
}
const yearLength = 28;
const seasonLength = 7;
let actualDate = 1;
let actualSeason = "spring";
let lastSeason = "";

//element related variables
let actualElement;
let elementOrder = []
let elementIndex = 0;

//point related variables
let springPoints = 0;
let summerPoints = 0;
let autumnPoints = 0;
let winterPoints = 0;

//-----------------------Setup---------------------------//


//main board setup
generateTable(boardSize, board);
placeMountains();

//actual element setup
generateTable(elementSize, actElementBoard)
rollElementOrder();
drawActualElement(actualElement, actElementBoard)
setActualElementTime(actualElement.time, actElementTimeSpan)
displayActualTime()

//missions setup
generateTable(2, missionsTable)
rollMissions()
displayMissions(missionsTable, missionsPoints)

//event handlers
    //mouse movement on board
delegate(board, "mouseover", "td", mouseHoverEventHandler)
delegate(board, "mouseout", "td", mouseHoverEventHandler)
    //mouse click on board
delegate(board, "click", "td", placeElement)
    //rotate- / mirrorbuttons click 
delegate(rotateButton, "click", "button", rotateActualElementShape)
delegate(mirrorButton, "click", "button", mirrorActualElementShape)


//---------------------------Functions--------------------------------

//--------------game updates-----------//
function updateGame() {

    passTime(actualElement.time);
    updateSeason();

    if (actualSeason !== "gamestop") {
        iterateActualElement();
        clearTable(actElementBoard, true);
        drawActualElement(actualElement, actElementBoard);
        setActualElementTime(actualElement.time, actElementTimeSpan);
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
            springPointsSpan.innerText = "" + springPoints + " pont";
            break;
        case "autumn":
            summerPoints += pointsToAdd;
            summerPointsSpan.innerText = "" + summerPoints + " pont";
            break;
        case "winter":
            autumnPoints += pointsToAdd;
            autumnPointsSpan.innerText = "" + autumnPoints + " pont";
            break;
        case "gamestop":
            winterPoints += pointsToAdd;
            winterPointsSpan.innerText = "" + winterPoints + " pont";
            break;
        default:
            break;
    }

    let sum = springPoints + summerPoints + autumnPoints + winterPoints;
    summedPointsParagraph.innerText = "Összpontszám: " + sum + " pont";

}

//-------draw/display functions--------//

function displayMissions(table, points) {
    let toHighlight = seasons[actualSeason];

    for (let i = 0; i < missionsCount; ++i) {
        
        let x = i % 2;
        let y = Math.floor(i / 2);
        let td = getTableElement(table, x, y)
        let actMission = actualMissions[i];

        setBackgroundColor(td, null)

        setMissionText(td, actMission, i, points[i])

        if (i === toHighlight[0] || i === toHighlight[1]) {
            setBackgroundColor(td, "rgb(120,255,120)")
        }
    }
}

function displayActualSeason() {
    let allParagraphs = document.querySelectorAll("p")
    let springColor = "rgba(255, 214, 252, 0.8)";
    let summerColor = "rgba(186, 237, 152, 0.8)";
    let autumnColor = "rgba(255, 119, 0, 0.8)"
    let winterColor = "rgba(0, 123, 255, 0.8)"
    let defaultColor = "rgba(250, 250, 250, 0.8)"

    switch (actualSeason) {
        case "spring":
            actualSeasonParagraph.innerText = "Jelenlegi évszak: Tavasz (A B)";

            setPageBackground(0, 0, "img/spring3.jpg")
            setBackgroundColorOfArray([springTD, board], springColor)
            setBackgroundColorOfArray(allParagraphs, springColor)
            setColorOfHr(springColor)

            break;
        case "summer":
            actualSeasonParagraph.innerText = "Jelenlegi évszak: Nyár (B C)";

            setPageBackground(0.1, 0.1, "img/summer2.png")
            setBackgroundColorOfArray([summerTD, board], summerColor)
            setBackgroundColorOfArray(allParagraphs, summerColor)
            setColorOfHr(summerColor)

            break;
        case "autumn":
            actualSeasonParagraph.innerText = "Jelenlegi évszak: Ősz (C D)";

            setPageBackground(0.1, 0.1, "img/autumn6.png")
            setBackgroundColorOfArray([autumnTD, board], autumnColor)
            setBackgroundColorOfArray(allParagraphs, autumnColor)
            setColorOfHr(autumnColor)

            break;
        case "winter":
            actualSeasonParagraph.innerText = "Jelenlegi évszak: Tél (A D)";

            setPageBackground(0.1, 0.1, "img/winter.avif")
            setBackgroundColorOfArray([winterTD, board], winterColor)
            setBackgroundColorOfArray(allParagraphs, winterColor)
            setColorOfHr(winterColor)

            break;
        default:
            gameOverEvent();
            setPageBackground(0.1, 0.1, "img/burgony.jpg")
            setBackgroundColorOfArray(allParagraphs, defaultColor)
            break;
    }
}

function displayActualTime() {

    let msg = "Évszakból hátralévő idő: ";
    let time = actualDate % seasonLength;

    timeLeftText.innerText = (msg + time + "/7");
}

//draws to act-element board (might rework for all purpose later)
function drawActualElement(elementToDraw, targetTable) {

    let elementShape = elementToDraw.shape
    let elementType = elementToDraw.type
    let td;

    for (let i = 0; i < elementSize; ++i) {
        for (let j = 0; j < elementSize; ++j) {

            if (elementShape[i][j]) {

                td = getTableElement(targetTable, j, i)
                td.setAttribute("class", elementType)

            }
        }
    }
}

function clearTable(targetTable, isClass) {
    let rowCount = targetTable.rows.length;
    let colCount;
    let td;

    for (let i = 0; i < rowCount; ++i) {

        colCount = targetTable.rows[i].cells.length;

        for (let j = 0; j < colCount; ++j) {

            td = getTableElement(targetTable, j, i)

            if (isClass) {
                td.setAttribute("class", null)
            } else {
                setBackgroundColor(td, null)
            }
        }
    }
}

//------mouse event/eventhandlers------//

function gameOverEvent() {

    let elementDiv = document.querySelector("#element-div")
    let missionsDiv = document.querySelector("#missions-div")
    let firstColDiv = document.querySelector(".first-col-div")
    let secondColDiv = document.querySelector(".second-col-div")

    newGameBUtton.style.display = "block"
    actualSeasonParagraph.style.display = "none"
    missionsDiv.style.display = "none"
    elementDiv.style.display = "none"
    firstColDiv.style.display = "none"
    secondColDiv.style.width = "100%"

}

function wrongPlacement() {

    let color = "#a83131"
    let td;

    for (let i = 0; i < boardSize; ++i) {
        for (let j = 0; j < boardSize; ++j) {

            td = getTableElement(board, j, i)
            setBackgroundColor(td, color)
        }
    }

    setTimeout(() => clearTable(board, false), 125);
}

function mouseHoverEventHandler(event) {

    let cellI = this.cellIndex
    let rowI = this.closest('tr').rowIndex

    if (event.type === "mouseout") {

        mouseHoverLeave(cellI, rowI);

    } else if (event.type === "mouseover") {

        mouseHoverEnter(cellI, rowI);

    }
}

function mouseHoverEnter(cellI, rowI) {

    let elementShape = actualElement.shape
    let td;
    let color;

    if (!canPlaceElement(cellI, rowI)) {
        color = "rgb(255,120,120)"
    } else {
        color = "rgb(120,255,120)"
    }

    for (let i = 0; i < elementSize; ++i) {
        for (let j = 0; j < elementSize; ++j) {

            let y = rowI - 1 + i
            let x = cellI - 1 + j

            if (!insideOfTableBounds(boardSize, x, y)) {
                continue;
            }

            td = getTableElement(board, x, y)

            if (elementShape[i][j]) {
                setBackgroundColor(td, color)
            }
        }
    }
}

function mouseHoverLeave(cellI, rowI) {

    let td;

    for (let i = 0; i < elementSize; ++i) {
        for (let j = 0; j < elementSize; ++j) {
            
            let y = rowI - 1 + i
            let x = cellI - 1 + j

            if (!insideOfTableBounds(boardSize, x, y)) {
                continue;
            }

            td = getTableElement(board, x, y)
            setBackgroundColor(td, null)
        }
    }
}

function delegate(parent, type, selector, handler) {
    parent.addEventListener(type, function (event) {
        const targetElement = event.target.closest(selector)
        if (this.contains(targetElement)) handler.call(targetElement, event)
    })
}

//------------time handlers------------//

function seasonChange() {
    runMissionsCheck();
}

function passTime(timeToPass) {

    actualDate += timeToPass;
    displayActualTime();
}

//-------setters/getters (mostly)-------//

function setBackgroundColorOfArray(list, color) {
    list.forEach((element) => element.style.backgroundColor = color)
}

function setBackgroundColor(element, color){
    element.style.backgroundColor = color
}

function setColorOfHr(color) {
    let allHr = document.querySelectorAll("hr")
    allHr.forEach((element) => element.style.borderColor = color)
}

function setActualElementTime(timeToSet, span) {
    span.innerText = "🕗: " + timeToSet
}

function setPageBackground(alphaTop, alphaBot, picture) {

    let linearGradientOpen = 'linear-gradient('
    let rgbaTop = 'rgba(255, 255, 255, ' + alphaTop + '), '
    let rgbaBot = 'rgba(255, 255, 255, ' + alphaBot + ')'
    let linearGradientClose = '), '
    let imageUrl = 'url(' + picture + ')'

    let cssToSet = linearGradientOpen + rgbaTop + rgbaBot + linearGradientClose + imageUrl

    document.body.style.backgroundImage = cssToSet
}

function getRandomInteger(max) {
    return Math.floor(Math.random() * max);
}

function generateTable(n, t) {
    let tr;
    let td;

    for (let i = 0; i < n; ++i) {

        tr = createDocuElement("tr");

        for (let j = 0; j < n; ++j) {

            td = createDocuElement("td")
            tr.appendChild(td)

        }

        t.appendChild(tr)

    }
}

function getTableElement(table, x, y) {
    return table.rows[y].cells[x]
}

function insideOfTableBounds(tableSize, x, y) {
    return (x > -1 && x < tableSize && y > -1 && y < tableSize)
}

function createDocuElement(elementString) {
    return document.createElement(elementString)
}

function setMissionText(td, actMission, missionNum, points){
    
    let title = "<h3>" + actMission["title"] + "</h3>"
    let description = actMission["description"];
    let breakLine = "<br><br>"
    let challChar = "Küldetés: " + String.fromCharCode(65 + missionNum) 
    let pointsSpan = " <span>("+points+" pont)</span>";

    let htmlToSet = title + description + breakLine + challChar + pointsSpan
    
    td.innerHTML = htmlToSet
}