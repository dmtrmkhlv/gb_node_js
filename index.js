const colors = require("colors/safe");

const initColor = {
	0: "green",
	1: "yellow",
	2: "red"
};

let currentColor = 0;

const setColor = (i) => {
	if (i != 2) {
		i++;
	} else {
		i = 0;
	}
	currentColor = i;
}

const from = process.argv[2];
const to = process.argv[3];
let hasPrime = false;

const renderNumbers = (from, to) => {
	if (isNaN(from) || isNaN(to)) {
		console.log(colors.red("Error! \nArgument is not a Number"));
		return;
	} else {
		if(from == 1){
			from++;
		}
		nextPrime: for (let i = from; i <= to; i++) {
			for (let j = 2; j < i; j++) {
				if (i % j == 0) {
					continue nextPrime;
				}
			}
			hasPrime = true;
			console.log(colors[initColor[currentColor]](i))
			setColor(currentColor);
		}
		if(!hasPrime){
			console.log(colors.red("Primes are not in this range"));
		}
	}
}

renderNumbers(from, to);