//hegyek:
//(sor, oszlop) => (2,2), (4,9), (6,4), (9,10), (10,6)
const mountains = [
    {
        "x":1,
        "y":1
    },
    {
        "x":3,
        "y":8
    },
    {
        "x":5,
        "y":3
    },
    {
        "x":8,
        "y":9
    },
    {
        "x":9,
        "y":5
    }
]

const board = document.querySelector("#gameboard")

generateTable(11);
placeMountains();

function placeMountains(){

    mountains.forEach(m => {
        td = board.rows[m.x].cells[m.y];
        td.setAttribute("class", "mountain");
    })
}

function generateTable(n){

    for(let i = 0; i < n; ++i){

        let tr = document.createElement("tr");

        for(let j = 0; j < n; ++j){

            let td = document.createElement("td")
            tr.appendChild(td)

            console.log("i: "+i+", j: "+j)
        }

        board.appendChild(tr)

    }
}

function delegate(parent, type, selector, handler) {
    parent.addEventListener(type, function (event) {
        const targetElement = event.target.closest(selector)
        if (this.contains(targetElement)) handler.call(targetElement, event)
    })
}