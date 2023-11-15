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

    mountains.forEach(m => {
        td = board.rows[m.x].cells[m.y];
        td.setAttribute("class", "mountain");
    })
}