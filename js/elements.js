const elements = [
    {
        time: 2,
        type: 'water',
        shape: [[1,1,1],
                [0,0,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false
    },
    {
        time: 2,
        type: 'town',
        shape: [[1,1,1],
                [0,0,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false        
    },
    {
        time: 1,
        type: 'forest',
        shape: [[1,1,0],
                [0,1,1],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'farm',
        shape: [[1,1,1],
                [0,0,1],
                [0,0,0]],
            rotation: 0,
            mirrored: false  
        },
    {
        time: 2,
        type: 'forest',
        shape: [[1,1,1],
                [0,0,1],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'town',
        shape: [[1,1,1],
                [0,1,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'farm',
        shape: [[1,1,1],
                [0,1,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 1,
        type: 'town',
        shape: [[1,1,0],
                [1,0,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 1,
        type: 'town',
        shape: [[1,1,1],
                [1,1,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 1,
        type: 'farm',
        shape: [[1,1,0],
                [0,1,1],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 1,
        type: 'farm',
        shape: [[0,1,0],
                [1,1,1],
                [0,1,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'water',
        shape: [[1,1,1],
                [1,0,0],
                [1,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'water',
        shape: [[1,0,0],
                [1,1,1],
                [1,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'forest',
        shape: [[1,1,0],
                [0,1,1],
                [0,0,1]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'forest',
        shape: [[1,1,0],
                [0,1,1],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'water',
        shape: [[1,1,0],
                [1,1,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
]

function iterateActualElement() {
    elementIndex += 1;
    actualElement = elements[elementOrder[elementIndex]]
}

function mirrorActualElementShape() {

    let shape = actualElement.shape;
    let mirroredShape = [];

    for (let i = 0; i < elementSize; ++i) {
        mirroredShape.push(shape[i].reverse())
    }

    actualElement.shape = mirroredShape;

    clearTable(actElementBoard, true);
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

    clearTable(actElementBoard, true)
    drawActualElement(actualElement, actElementBoard)
}

function rollElementOrder() {
    actualElement = getElementOrder()
}

function placeElement(event) {
    cellI = this.cellIndex
    rowI = this.closest('tr').rowIndex
    let alignmentGood = canPlaceElement(cellI, rowI);
    let elementType = actualElement.type;

    if (!alignmentGood) {
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
    let elementShape = actualElement.shape

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