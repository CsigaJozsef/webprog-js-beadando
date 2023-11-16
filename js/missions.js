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
		},
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
		}
	],
	"notcompleted": [
		
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

//DISCLAIMER: code not very clean lot of repeating

let missionsPoints = [0, 0, 0, 0]

function rollMissions() {
	let max = missions["completed"].length
	let chosen = []

	for (let i = 0; i < missionsCount; ++i) {

		let random;

		do {

			random = getRandomInteger(max);

		} while (chosen.includes(random))

		chosen.push(random)
	}

	for (let i = 0; i < missionsCount; ++i) {
		actualMissions.push(missions["completed"][chosen[i]]);
	}
}

function runMissionsCheck() {
	let count = 0;
	let toCheck = seasons[lastSeason];

	for (let i = 0; i < toCheck.length; ++i) {
		index = toCheck[i]
		switch (actualMissions[index]["title"]) {

			case "Az erdő széle":
				count += edgeOfTheForest();
				missionsPoints[index] = treesOnEdge;
				break;

			case "Álmos-völgy":
				count += sleepyValley();
				missionsPoints[index] = threeForestRows;
				break;

			case "Krumpliöntözés":
				count += potatoWatering();
				missionsPoints[index] = wateredPotatos;
				break;

			case "Határvidék":
				count += borderLand();
				missionsPoints[index] = fullRowsOrColumns;
				break;

			case "Fasor":
				count += countLongestWoods();
				missionsPoints[index] = longestWoodsPoints;
				break

			case "Gazdag város":
				count += countWealthyTowns();
				missionsPoints[index] = wealthyTownPoints;
				break;

			case "Öntözőcsatorna":
				count += countCanals();
				missionsPoints[index] = canalCountPoints;
				break;

			case "Mágusok völgye":
				count += countMageValleys();
				missionsPoints[index] = mageValleyPoints;
				break;

			default:
				break;
		}
	}

	console.log(missionsPoints)
	console.log(countEmptyPlots())
	console.log(emptyPlotPoints);

	count += countSurroundedMountains()

	displayMissions(missionsTable, missionsPoints)
	updatePoints(count)
}

function countExtraPoints(actualPoints, storedPoints) {
	let extraPoints = 0;

	if (actualPoints > storedPoints) {
		extraPoints = actualPoints - storedPoints
	}

	return extraPoints;
}

/**
 * @global Return a list of booleans 
 * 	(up, left, right, down) of surrounding elements, 
 * 	true if exists, false if doesn't
 * @param {number} x 
 * @param {number} y 
 */

function getRadarScan(x, y) {
	//ORDER: 
	let radar = [false, false, false, false]

	if (insideOfTableBounds(boardSize, x, y - 1)) {
		radar[0] = true;
	}
	if (insideOfTableBounds(boardSize, x - 1, y)) {
		radar[1] = true;
	}
	if (insideOfTableBounds(boardSize, x + 1, y)) {
		radar[2] = true;
	}
	if (insideOfTableBounds(boardSize, x, y + 1)) {
		radar[3] = true;
	}

	return radar
}

/**
 * @global Return a list of tds 
 * 	(up, left, right, down) of surrounding elements, 
 * 	null if there are no elements
 * @param {number} x 
 * @param {number} y
 * @returns {td[]}
 */

function getSurroundings(x, y) {
	let radarScan = getRadarScan(x, y)
	let surrounding = [null, null, null, null]

	if (radarScan[0]) {
		surrounding[0] = getTableElement(board, x, y - 1);
	}
	if (radarScan[1]) {
		surrounding[1] = getTableElement(board, x - 1, y);
	}
	if (radarScan[2]) {
		surrounding[2] = getTableElement(board, x + 1, y);
	}
	if (radarScan[3]) {
		surrounding[3] = getTableElement(board, x, y + 1);
	}

	return surrounding
}
//------------------- 

//------------------- empty plot ----------------------------------//
// can't do distinct
let emptyPlotPoints = 0;
let emptyPlotsSet = new Set();

function countEmptyPlotsAround(x, y){
	let tds = getSurroundings(x, y)
	let count = 0;

	tds = tds.filter((element) => {
		return element !== null && element !== undefined
	})

	tds.forEach((element) => {
		if(element.getAttribute("class") === null){
			console.log("empty plot found")
			emptyPlotsSet.add(""+x+", "+y)
		}
	})
}

function countEmptyPlots(){
	let count = 0;

	for(let i = 0; i < boardSize; ++i){
		for(let j = 0; j < boardSize; ++j){
			
			let td = getTableElement(board, j, i);

			if(td.getAttribute("class") === "town"){
				countEmptyPlotsAround(j, i);
			}
		}
	}

	count = emptyPlotsSet.size
	console.log(emptyPlotsSet)
	console.log(emptyPlotsSet.size)

	let finalPoints = countExtraPoints(count, emptyPlotPoints);
	emptyPlotPoints += finalPoints

	return finalPoints;
}

//------------------- mages valley --------------------------------//
let mageValleyPoints = 0;

function countValleysAroundMages(x, y) {
	let count = 0;

	let surroundings = getSurroundings(x, y)

	surroundings.forEach((element) =>{
		if(element !== null){
			if(element.getAttribute("class") === "water"){
				count += 3
			}
		}
	})

	return count;
}

function countMageValleys() {
	let count = 0;

	mountains.forEach((mountain) => {
		count += countValleysAroundMages(mountain["y"], mountain["x"])
	})

	let finalPoints = countExtraPoints(count, mageValleyPoints);
	mageValleyPoints += finalPoints

	return finalPoints;
}
//------------------- irrigation canal ----------------------------//
let canalCountPoints = 0;

function countCanals() {
	let count = 0;

	for (let col = 0; col < boardSize; ++col) {

		let farmCount = 0;
		let waterCount = 0;

		for (let row = 0; row < boardSize; ++row) {

			let td = getTableElement(board, col, row);

			if (td.getAttribute("class") === "farm") {
				++farmCount;
			}

			if (td.getAttribute("class") === "water") {
				++waterCount;
			}
		}

		if (farmCount == waterCount && farmCount > 0) {
			console.log("canal found: " + col)
			count += 4;
		}
	}

	let finalPoints = countExtraPoints(count, canalCountPoints);
	canalCountPoints += finalPoints

	return finalPoints;
}

//------------------- wealthy town --------------------------------//
let wealthyTownPoints = 0;

function checkIfTownIsWealthy(x, y) {
	let l = false;
	
	let tds = getSurroundings(x, y)
	
	let checkableArr = tds.map((element) => {
		if(element !== null){
			return element.getAttribute("class")
		}
	}).filter((element) => {
		return element !== null && element !== undefined
	})

	const classTypesSet = new Set(checkableArr)
	if (classTypesSet.size >= 3) {
		l = true;
	}

	console.log(checkableArr)
	console.log(classTypesSet)

	return l;
}

function countWealthyTowns() {

	let td;
	let wealthy;
	let count = 0;

	for (let i = 0; i < boardSize; ++i) {
		for (let j = 0; j < boardSize; ++j) {

			td = getTableElement(board, j, i)
			wealthy = false;

			if (td.getAttribute("class") === "town") {
				wealthy = checkIfTownIsWealthy(j, i);
			}

			if (wealthy) {
				count += 3;
			}

		}
	}

	let finalPoints = countExtraPoints(count, wealthyTownPoints);
	wealthyTownPoints += finalPoints

	return finalPoints;

}


//------------------ longest woods --------------------------------//
let longestWoodsPoints = 0;

function countLongestWoods() {

	let longest = 0;

	for (let row = 0; row < boardSize; ++row) {

		let count = 0;
		let inWoods = false;

		for (let col = 0; col < boardSize; ++col) {

			let td = getTableElement(board, col, row)

			if (td.getAttribute("class") === "forest") {

				count += 2;
				inWoods = true;

			} else if (td.getAttribute("class") !== "forest" && inWoods) {

				if (longest < count) {
					longest = count;
				}

				inWoods = false;
				count = 0;
			}
		}

		if (count > 0 && longest < count) {
			longest = count;
		}
	}

	let finalPoints = countExtraPoints(longest, longestWoodsPoints)
	longestWoodsPoints += finalPoints

	return finalPoints;
}

//------------------ surrounded mountains -------------------------//
let surroundedMountains = 0;

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

		if (insideOfTableBounds(boardSize, actX, actY)) {
			let td = getTableElement(board, actX, actY)
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
		if (isSurrounded(mountain["y"], mountain["x"])) {
			count += 1;
		}
	})

	let finalPoints = countExtraPoints(count, surroundedMountains)
	surroundedMountains += finalPoints

	return finalPoints;
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

			let td = getTableElement(board, j, i)
			edgetds += 1;

			if (td.getAttribute("class") === 'forest') {
				count += 1;
			}
		}
	}

	let finalPoints = countExtraPoints(count, treesOnEdge)
	treesOnEdge += finalPoints

	return finalPoints;
}

//------------------ borderland------------------------------------//
let fullRowsOrColumns = 0;

function borderLand() {
	count = 0;
	for (let row = 0; row < boardSize; ++row) {
		for (let col = 0; col < boardSize; ++col) {

			let td = getTableElement(board, col, row);

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

			let td = getTableElement(board, col, row);

			//skip to next col
			if (td.getAttribute("class") === null) {
				break;
			}

			if (row === boardSize - 1) {
				count += 6;
			}
		}
	}

	let finalPoints = countExtraPoints(count, fullRowsOrColumns)
	fullRowsOrColumns += finalPoints

	return finalPoints;
}

//------------------ potato watering ------------------------------//
let wateredPotatos = 0;

function potatoWatering() {
	let count = 0;

	for (let row = 0; row < boardSize; ++row) {
		for (let col = 0; col < boardSize; ++col) {

			let td = getTableElement(board, col, row)

			//skip to next row
			if (td.getAttribute("class") === 'farm') {
				count += (countNeighbours(row, col, 'water') * 2);
			}
		}
	}

	let finalPoints = countExtraPoints(count, wateredPotatos)
	wateredPotatos += finalPoints

	return finalPoints;
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
	let count = 0;
	let forestCount;
	let td;

	for (let row = 0; row < boardSize; ++row) {
		forestCount = 0;
		for (let col = 0; col < boardSize; ++col) {

			td = getTableElement(board, col, row)

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

	let finalPoints = countExtraPoints(count, threeForestRows)
	threeForestRows += finalPoints

	return finalPoints;
}
