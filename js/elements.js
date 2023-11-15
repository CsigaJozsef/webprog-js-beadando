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
    let cellI = this.cellIndex
    let rowI = this.closest('tr').rowIndex
    let alignmentGood = canPlaceElement(cellI, rowI);
    let elementType = actualElement.type;
    let elementShape = actualElement.shape
    let td;

    if (!alignmentGood) {
        wrongPlacement()
    } else {
        for (let i = 0; i < elementSize; ++i) {
            for (let j = 0; j < elementSize; ++j) {
                let y = rowI - 1 + i
                let x = cellI - 1 + j

                if (!insideOfTableBounds(boardSize, x, y)) {
                    continue;
                }

                td = getTableElement(board, x, y)

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
    let td;

    for (let i = 0; i < elementSize; ++i) {
        for (let j = 0; j < elementSize; ++j) {
            let y = rIndex - 1 + i
            let x = cIndex - 1 + j

            if (!insideOfTableBounds(boardSize, x, y)) {
                if (elementShape[i][j]) {
                    placable = false;
                }

                continue;
            }

            td = getTableElement(board, x, y)

            if (td.getAttribute("class") !== null && elementShape[i][j]) {
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