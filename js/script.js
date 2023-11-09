//hegyek:
//(sor, oszlop) => (2,2), (4,9), (6,4), (9,10), (10,6)

//---------------------------main----------------------------------
const board = document.querySelector("#gameboard")
const actElementBoard = document.querySelector("#act-element-board")
const actElementTimeSpan = document.querySelector("#act-element-time")
const elementSize = 3;

let actualElement;

generateTable(11, board);
placeMountains();
generateTable(3, actElementBoard)
rerollActualElement();
drawActualElement(actualElement, actElementBoard)
setActualElementTime(actualElement.time ,actElementTimeSpan)

delegate(board, "mouseover", "td", mouseHoverEnter)
delegate(board, "mouseout", "td", mouseHoverLeave)

delegate(board, "click", "td", placeElement)


//---------------------------functions--------------------------------

function rerollActualElement(){
    actualElement = getActualElement()
}

function placeElement(event){
    cellI = this.cellIndex
    rowI = this.closest('tr').rowIndex
    let alignmentGood = canPlaceElement(cellI, rowI);
    let elementType = actualElement.type;
    
    if(!alignmentGood){
        //Kell valahogy jelezni  faszparaszt
        console.log("Nope, wrong placement")
    }else{
        for(let i = 0; i < elementSize; ++i){
            for(let j = 0; j < elementSize; ++j){

                td = board.rows[rowI-1+i].cells[cellI-1+j]

                if(elementShape[i][j]){
                    td.setAttribute("class", elementType)
                    //console.log(elementType)
                    //console.log(typeof elementType)
                }
            }
        }
        rerollActualElement();
        clearTable(actElementBoard)
        drawActualElement(actualElement, actElementBoard)
        setActualElementTime(actualElement.time ,actElementTimeSpan)
    }
}

function canPlaceElement(cIndex, rIndex){
    let placable = true;
    elementShape = actualElement.shape

    let hoverArray = []                 //for 3x3 tds to draw out placable element

    for(let i = 0; i < elementSize; ++i){
        for(let j = 0; j < elementSize; ++j){

            if(rIndex-1+i < 0 || rIndex-1+i > 10 || cIndex-1+j < 0 || cIndex-1+j > 10){
                //non-existant td-s
                if(elementShape[i][j]){
                    placable = false; 
                }
                
                continue;
            }
            
            td = board.rows[rIndex-1+i].cells[cIndex-1+j]

            if(td.getAttribute("class") != null && elementShape[i][j]){
                // console.log("van classja ennek a td-nek:"+ (rIndex-1+i) +":"+ (cIndex-1+j))
                placable = false;
            }
        }
    }

    return placable;
}

function mouseHoverEnter(event){

    elementShape = actualElement.shape

    cellI = this.cellIndex
    rowI = this.closest('tr').rowIndex

    let hoverArray = []                 //for 3x3 tds to draw out placable element

    for(let i = 0; i < elementSize; ++i){
        for(let j = 0; j < elementSize; ++j){

            if(rowI-1+i < 0 || rowI-1+i > 10 || cellI-1+j < 0 || cellI-1+j > 10){
                continue;
            }

            td = board.rows[rowI-1+i].cells[cellI-1+j]

            if(elementShape[i][j]){
                td.style.backgroundColor = "grey"
            }
        }
    }
}

function mouseHoverLeave(event){

    cellI = this.cellIndex
    rowI = this.closest('tr').rowIndex

    for(let i = 0; i < elementSize; ++i){
        for(let j = 0; j < elementSize; ++j){

            if(rowI-1+i < 0 || rowI-1+i > 10 || cellI-1+j < 0 || cellI-1+j > 10){
                continue;
            }

            td = board.rows[rowI-1+i].cells[cellI-1+j]
            td.style.backgroundColor = ""
        }
    }
}

//places predetermined constant mountains on gameboard
function placeMountains(){

    mountains.forEach(m => {
        td = board.rows[m.x].cells[m.y];
        td.setAttribute("class", "mountain");
    })
}

function getRandomInteger(max){
    return Math.floor(Math.random() * max);
}

//picks random from elements
function getActualElement(){
    max = elements.length
    indexOfChosenOne = getRandomInteger(max)

    return elements[indexOfChosenOne]
}

function setActualElementTime(timeToSet, span){
    // console.log(timeToSet)
    // console.log(typeof timeToSet)
    span.innerText = "🕗: " + timeToSet
}

//draws to act-element board (might rework for all purpose later)
function drawActualElement(elementToDraw, targetTable){
    
    elementShape = elementToDraw.shape
    elementType = elementToDraw.type
    
    for(let i = 0; i < elementSize; ++i){
        for(let j = 0; j < elementSize; ++j){
            
            if(elementShape[i][j]){
                
                td = targetTable.rows[i].cells[j]
                td.setAttribute("class", elementType)

            }
        }
    }
}

function clearTable(targetTable){
    let rowCount = targetTable.rows.length;
    let colCount;

    for(let i = 0; i < rowCount; ++i){

        colCount = targetTable.rows[i].cells.length;
        // console.log(colCount)

        for(let j = 0; j < colCount; ++j){
            td = targetTable.rows[i].cells[j]
            td.setAttribute("class", null)
            // console.log("td set to null")
        }
    }
}

function generateTable(n, t){

    for(let i = 0; i < n; ++i){

        let tr = document.createElement("tr");

        for(let j = 0; j < n; ++j){

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