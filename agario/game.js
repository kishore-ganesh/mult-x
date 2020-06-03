const BOUND = 5;
class Dot {
	constructor(x, y, radius, realx, realy, name) {
		this.x = x;
		this.y = y;
		this.life = 1;
		this.score = 0;
		this.name = name;

		if (realx == undefined) {
			this.realx = this.x - offsetx;
			this.realy = this.y - offsety;
		}

		else {
			this.realx = realx;
			this.realy = realy;
		}


		if (radius == undefined) {
			this.radius = 50;
		}

		else {
			this.radius = radius;
		}

	}




	drawName(drawx, drawy) {
		fill(0, 0, 0);
		textSize(15);
		text(this.name, drawx - this.radius / 2, drawy - this.radius / 2);
	}

	drawReal(player) {
		if (this.life == 1) {

			// console.log(this.name)
			// this.drawName(this.realx+offsetx, this.realy+offsety);
			fill(255, 0, 0);
			let cx = player.realx - width / 2 - player.x;
			let cy = player.realy - height / 2 - player.y;
			let nx = this.realx - cx;
			let ny = this.realy - cy;
			this.drawName(nx, ny);
			ellipse(nx, ny, this.radius, this.radius);
		}

		// else{
		// 	fill(255);
		// }


	}


	draw() {

		// background(255)
		// this.drawName(this.x, this.y);
		let cx = width / 2 + this.x;
		let cy = height / 2 + this.y;
		this.drawName(cx, cy);
		if (this.life == 1)
			fill(255, 0, 0)
		else
			fill(255);

		ellipse(cx, cy, this.radius, this.radius);
	}


	//Add reconnection feature
	//offset not workign
	//collide not working

	//buffer array
	//speed buffer
}

class LeaderBoard {
	constructor(players) {
		this.players = players;
		this.sortedPlayers = [];
	}
	updatePlayer(players) {
		this.players = players;
	}
	sortPlayers() {
		// console.log(Object.entries(this.players).sort());
		this.sortedPlayers = Object.entries(this.players).sort(function (a, b) {
			// print(a);
			// console.log(a[1]['radius']);
			return b[1]['radius'] - a[1]['radius'];
		});
		// console.log(this.sortedPlayers);
		// console.log(this.sortedPlayers);
	}
	fillLeaderBoard(x, y) {
		// console.log(this.sortedPlayers[0][1])
		y = y + 50;
		x = x + 25;
		var i;
		for (i = 0; i < this.sortedPlayers.length; i++) {
			let player = this.sortedPlayers[i][1]
			// console.log(player);
			textSize(20);
			fill(200, 200, 200);

			textAlign(LEFT, CENTER);
			text(player['name'], x, y);
			textAlign(RIGHT, CENTER);
			text(player['radius'], x - 50 + (width / 5), y);
			y = y + 25;
		}
	}
	draw() {
		let cx = width - (width / 5) - 50;
		let cy = 20;
		fill(0, 200)
		rect(cx, cy, width / 5, height / 2);
		textSize(25);
		fill(255, 255, 255)
		textAlign(CENTER, CENTER)
		text('Leader Board', cx + (width / 10), cy + 20);
		this.fillLeaderBoard(cx, cy)
	}
}
var offsetx = 0;
var offsety = 0;
var dot = new Dot(600, 600)
let players = {};
let food = [];
var currentKey;
var currentName;
const START = 1, ALIVE = 2, DEAD = 3;
var gameState = START;

function preload() {
	txtFont = loadFont('assets/inconsolata.ttf')
}

function takeName() {
	currentName = nameBox.value();
	console.log(currentName);
	gameState = 2;
	// removeElements();
	createPlayer();
	nameBox.remove();
	button.remove();
	label.remove();
}
function setup() {
	createCanvas(windowWidth, windowHeight);
	// console.log(txtFont);
	textFont(txtFont)
	textSize(width / 3);
	textAlign(CENTER, CENTER)
	nameBox = createInput();
	nameBox.position(width / 2, height / 2);
	button = createButton('Play')
	button.position(nameBox.x + nameBox.width, height / 2)
	button.mousePressed(takeName);
	label = createElement('h2', 'Enter name');
	label.position(width / 3, height / 3);


}

function drawGameOver() {
	textSize(100)
	fill(0, 255, 255)
	textAlign(CENTER, CENTER);
	text('Game Over - Press R ', windowWidth / 2, windowHeight / 2);
	// textSize()
}

function keyPressed() {
	if (gameState == DEAD && (key == 'r' || key == 'R')) {
		// currentKey = undefined;
		respawnPlayer();
		gameState = ALIVE;
	}
}

setInterval(() => {
	// console.log("Y");
	if (currentKey && players[currentKey]) {
		updatePlayer({
			mouseX,
			mouseY,
			x: width / 2 + players[currentKey].x,
			y: height / 2 + players[currentKey].y
		});
	}

}, 30);


function draw() {
	background(255);

	// gameState = 2;
	// console.log(height)
	// console.log(windowHeight)


	leaderBoard = new LeaderBoard(players)
	// frameRate(1);
	if (gameState != START) {

		for (let i = 0; i < food.length; i++) {
			if (players[currentKey] != undefined) {
				food[i].draw(players[currentKey]);
			}

		}

		for (let i in players) {
			if (players[i] != undefined && i != currentKey && players[currentKey] != undefined) {


				players[i].drawReal(players[currentKey]);


			}

		}
		if (gameState == ALIVE) {

			if (players[currentKey] != undefined) {


				if (players[currentKey].life != 1) {
					gameState = DEAD;
				}
				// console.log(players[currentKey].realx);
				players[currentKey].draw();
				// players[currentKey].update();
			}



			//add offset boundary 

			//we have to coordinate offsets for all

			leaderBoard.updatePlayer(players);
			leaderBoard.sortPlayers();

			leaderBoard.draw();

		}
		else {
			drawGameOver();
		}

	}


	// dot.draw();



}

//shoot projecticle
class Food {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	draw(player) {
		fill(0, 255, 0);
		let cx = player.realx - width / 2 - player.x;
		let cy = player.realy - height / 2 - player.y;
		let nx = this.x - cx;
		let ny = this.y - cy;
		rect(nx, ny, 12, 12);
	}

}


//If life over, show game over screen -> Have to restart
//Show state
