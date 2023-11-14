const missions =
{
	"completed": [
		{
			"title": "Az erdő széle",
			"description": "A térképed szélével szomszédos erdőmezőidért egy-egy pontot kapsz."
		},
		{
			"title": "Álmos-völgy",
			"description": "Minden olyan sorért, amelyben három erdőmező van, négy-négy pontot kapsz."
		},
		{
			"title": "Krumpliöntözés",
			"description": "A farmmezőiddel szomszédos vízmezőidért két-két pontot kapsz."
		},
		{
			"title": "Határvidék",
			"description": "Minden teli sorért vagy oszlopért 6-6 pontot kapsz."
		}
	],
	"notcompleted": [
		{
			"title": "Fasor",
			"description": "A leghosszabb, függőlegesen megszakítás nélkül egybefüggő erdőmezők mindegyikéért kettő-kettő pontot kapsz. Két azonos hosszúságú esetén csak az egyikért."
		},
		{
			"title": "Gazdag város",
			"description": "A legalább három különböző tereptípussal szomszédos falurégióidért három-három pontot kapsz."
		},
		{
			"title": "Öntözőcsatorna",
			"description": "Minden olyan oszlopodért, amelyben a farm illetve a vízmezők száma megegyezik, négy-négy pontot kapsz. Mindkét tereptípusból legalább egy-egy mezőnek lennie kell az oszlopban ahhoz, hogy pontot kaphass érte."
		},
		{
			"title": "Mágusok völgye",
			"description": "A hegymezőiddel szomszédos vízmezőidért három-három pontot kapsz."
		},
		{
			"title": "Üres telek",
			"description": "A városmezőiddel szomszédos üres mezőkért 2-2 pontot kapsz."
		},
		{
			"title": "Sorház",
			"description": "A leghosszabb, vízszintesen megszakítás nélkül egybefüggő falumezők mindegyikéért kettő-kettő pontot kapsz."
		},
		{
			"title": "Páratlan silók",
			"description": "Minden páratlan sorszámú teli oszlopodért 10-10 pontot kapsz."
		},
		{
			"title": "Gazdag vidék",
			"description": "Minden legalább öt különböző tereptípust tartalmazó sorért négy-négy pontot kapsz."
		}
	],
}

let challengesPoints = [0, 0, 0, 0]

function runChallengeCheck() {
	let count = 0;
	let toCheck = seasons[lastSeason];

	console.log(toCheck)

	for (let i = 0; i < toCheck.length; ++i) {
		index = toCheck[i]
		switch (actualChallenges[index]["title"]) {
			case "Az erdő széle":
				count += edgeOfTheForest();
				challengesPoints[index] = treesOnEdge;
				console.log("Az erdő széle " + index + " " + treesOnEdge)
				break;
			case "Álmos-völgy":
				console.log("Álmos-völgy " + index)
				count += sleepyValley();
				challengesPoints[index] = threeForestRows;
				console.log("Álmos-völgy " + index + " " + threeForestRows)
				break;
			case "Krumpliöntözés":
				count += potatoWatering();
				challengesPoints[index] = wateredPotatos;
				console.log("Krumpliöntözés " + index + " " + wateredPotatos)
				break;
			case "Határvidék":
				count += borderLand();
				challengesPoints[index] = fullRowsOrColumns;
				console.log("Határvidék " + index + " " + fullRowsOrColumns)
				break;
			case "Fasor":
				count += countLongestWoods();
				challengesPoints[index] = longestWoodsPoints;
				console.log("Fasor " + index + " " + longestWoodsPoints)
			default:
				break;
		}
	}

	count += countSurroundedMountains()

	updateChallenges(challengesTable, challengesPoints)
	updatePoints(count)
}

//------------------ longest woods --------------------------------//
let longestWoodsPoints = 0;

function countLongestWoods() {

	let longest = 0;

	for (let row = 0; row < boardSize; ++row) {

		let count = 0;
		let inWoods = false;

		for (let col = 0; col < boardSize; ++col) {

			td = board.rows[row].cells[col];

			if (td.getAttribute("class") === "forest") {

				count += 1;
				inWoods = true;

			} else if (td.getAttribute("class") !== "forest" && inWoods) {

				console.log("Vége az erdőnek: " + count)

				if (longest < count) {
					longest = count;
				}

				inWoods = false;
				count = 0;
			}
		}

		console.log("Vége az erdőnek: " + count)

		if (count > 0 && longest < count) {
			longest = count;
		}
	}

	let points = longest * 2;

	let extraPoints = 0;

	if (points > longestWoodsPoints) {
		extraPoints = points - longestWoodsPoints
		longestWoodsPoints = points
	}

	return extraPoints;
}

//------------------ surrounded mountains -------------------------//
let surroundedMountains = 0;

function cellExists(x, y) {
	let l = true;
	if (x < 0 || x > 10 || y > 10 || y < 0) {
		l = false;
	}
	return l;
}

function isSurrounded(x, y) {
	let l = true;
	let actX;
	let actY;
	for (let i = 0; i < 8; ++i) {
		if (i < 3) {
			actX = x - 1
			actY = y + 1 - i
		} else if (i >= 3 && i <= 4) {
			actX = x
			i === 3 ? actY = y - 1 : actY = y + 1
		} else {
			actX = x + 1
			actY = y + 6 - i
		}

		if (cellExists(actX, actY)) {
			let td = board.rows[actX].cells[actY]
			if (td.getAttribute("class") === null) {
				l = false;
			}
		}
	}

	return l
}

function countSurroundedMountains() {
	let count = 0;

	mountains.forEach((mountain) => {
		if (isSurrounded(mountain["x"], mountain["y"])) {
			count += 1;
		}
	})

	let extraPoints = 0;

	if (count > surroundedMountains) {
		extraPoints = count - surroundedMountains
		surroundedMountains = count
	}

	return extraPoints;
}


//------------------ edge of the forest ---------------------------//
let treesOnEdge = 0;

function edgeOfTheForest() {
	let count = 0;
	let edgetds = 0;
	for (let i = 0; i < boardSize; ++i) {
		for (let j = 0; j < boardSize; ++j) {
			// only checks edges of the table
			if (!(j === 0 || j === 10 || i === 0 || i === 10)) {
				continue;
			}

			td = board.rows[i].cells[j];
			edgetds += 1;
			if (td.getAttribute("class") === 'forest') {
				count += 1;
			}
		}
	}

	let extraPoints = 0;

	if (count > treesOnEdge) {
		extraPoints = count - treesOnEdge
		treesOnEdge = count
	}

	return extraPoints;
}

//------------------ borderland------------------------------------//
let fullRowsOrColumns = 0;

function borderLand() {
	count = 0;
	for (let row = 0; row < boardSize; ++row) {
		for (let col = 0; col < boardSize; ++col) {

			td = board.rows[row].cells[col];

			//skip to next row
			if (td.getAttribute("class") === null) {
				break;
			}

			if (col === boardSize - 1) {
				count += 6;
			}
		}
	}

	for (let col = 0; col < boardSize; ++col) {
		for (let row = 0; row < boardSize; ++row) {

			td = board.rows[row].cells[col];

			//skip to next col
			if (td.getAttribute("class") === null) {
				break;
			}

			if (row === boardSize - 1) {
				count += 6;
			}
		}
	}

	let extraPoints = 0;

	if (count > fullRowsOrColumns) {
		extraPoints = count - fullRowsOrColumns
		fullRowsOrColumns = count
	}

	return extraPoints;
}

//------------------ potato watering ------------------------------//
let wateredPotatos = 0;

function potatoWatering() {
	let count = 0;

	for (let row = 0; row < boardSize; ++row) {
		for (let col = 0; col < boardSize; ++col) {

			td = board.rows[row].cells[col];

			//skip to next row
			if (td.getAttribute("class") === 'farm') {
				count += (countNeighbours(row, col, 'water') * 2);
			}
		}
	}

	let extraPoints = 0;

	if (count > wateredPotatos) {
		extraPoints = count - wateredPotatos
		wateredPotatos = count
	}

	return extraPoints;
}

function countNeighbours(row, col, type) {
	let count = 0;

	if (row - 1 > -1) {
		if (board.rows[row - 1].cells[col].getAttribute("class") === type) {
			++count;
		}
	}
	if (col - 1 > -1) {
		if (board.rows[row].cells[col - 1].getAttribute("class") === type) {
			++count;
		}
	}
	if (row + 1 < 11) {
		if (board.rows[row + 1].cells[col].getAttribute("class") === type) {
			++count;
		}
	}
	if (col + 1 < 11) {
		if (board.rows[row].cells[col + 1].getAttribute("class") === type) {
			++count;
		}
	}

	return count;
}

//------------------ sleepy valley --------------------------------//
let threeForestRows = 0;

function sleepyValley() {
	count = 0;
	let forestCount;
	for (let row = 0; row < boardSize; ++row) {
		forestCount = 0;
		for (let col = 0; col < boardSize; ++col) {

			td = board.rows[row].cells[col];

			if (td.getAttribute("class") === 'forest') {
				++forestCount;
				// console.log("found forest: "+row+":"+col)
			}
		}
		if (forestCount === 3) {
			count += 4;
			// console.log("found row: "+row)
		}
	}

	let extraPoints = 0;

	if (count > threeForestRows) {
		extraPoints = count - threeForestRows
		threeForestRows = count
	}

	return extraPoints;
}
