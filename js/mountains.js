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

//places predetermined constant mountains on gameboard
function placeMountains() {
    let td;

    mountains.forEach(m => {
        td = getTableElement(board, m.y, m.x)
        td.setAttribute("class", "mountain");
    })
}