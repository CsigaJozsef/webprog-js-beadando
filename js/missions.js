const missions =
{
	"basic": [
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
	"extra": [
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

let treesOnEdge = 0;

//should rework so it only runs end of seasons
function runChallengeCheck() {
	let sum = 0;

	sum += edgeOfTheForest()

	updatePoints(sum)
}

function edgeOfTheForest() {
	let sum = 0;
	let edgetds = 0;
	for (let i = 0; i < boardSize; ++i) {
		for (let j = 0; j < boardSize; ++j) {
			// only checks edges of the table
			if (!(j === 0 || j === 10 || i === 0 || i === 10)) {
				continue;
			}

			td = board.rows[i].cells[j];
			edgetds+=1;
			if (td.getAttribute("class") === 'forest') {
				sum += 1;
			}
		}
	}
	console.log(edgetds)

	let extraPoints = 0;

	if(sum > treesOnEdge){
		extraPoints = sum - treesOnEdge
		treesOnEdge = sum
	}
	
	return extraPoints;
}