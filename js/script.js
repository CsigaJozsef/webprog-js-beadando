//hegyek:
//(sor, oszlop) => (2,2), (4,9), (6,4), (9,10), (10,6)

//---------------------------main----------------------------------
const board = document.querySelector("#gameboard")
const actElement = document.querySelector("#act-element")
const elementSize = 3;

let actualElement;

generateTable(11, board);
placeMountains();
generateTable(3, actElement)
actualElement = getActualElement()
drawActualElement(actualElement, actElement)

delegate(board, "mouseover", "td", mouseHoverEnter)
delegate(board, "mouseout", "td", mouseHoverLeave)


//---------------------------functions--------------------------------

function mouseHoverEnter(event){
    console.log("HELO")
    console.log(event)
    console.log(this)
    this.style.backgroundColor = "gray"
}

function hello(){
    console.log('SUP')
}

function mouseHoverLeave(event){
    console.log("BYE")
    this.style.backgroundColor = "beige"
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

function generateTable(n, t){

    for(let i = 0; i < n; ++i){

        let tr = document.createElement("tr");

        for(let j = 0; j < n; ++j){

            let td = document.createElement("td")
            tr.appendChild(td)

            console.log("i: "+i+", j: "+j)
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