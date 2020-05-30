const BOUND = 5;
class Dot {
	constructor(x, y, radius, realx, realy, name) {
		this.x = x;
		this.y = y;
		this.life = 1;
		this.score = 0;
		this.name = name;
		this.dx = 0;
		this.dy = 0;

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
	isPlayerColliding(otherPlayer, i) {
		if (otherPlayer.life == 1 && this.life == 1) {
			let d = dist(otherPlayer.realx + offsetx, otherPlayer.realy + offsety, this.x, this.y)
			if (d <= this.radius / 2 && otherPlayer.radius < this.radius - 10) {
				console.log("collided")
				this.radius += otherPlayer.radius * 0.3;
				otherPlayer.life = 0;
				updatePlayer(otherPlayer, i)

			}

			// else if(d<=this.radius/2&&otherPlayer.radius>this.radius-10){

			// 	this.life=0;
			// 	otherPlayer.radius+=this.radius*0.3;
			// 	updatePlayer(this, currentKey);


		}

	}
	isColliding(prey) {
		if (this.life == 1) {
			let d = dist(prey.x + offsetx, prey.y + offsety, this.x, this.y)
			if (d <= this.radius / 2) {
				// this.radius += 10;
				let t = Object.assign({}, this)
				t.radius += 10
				console.log("collided")
				let i = food.indexOf(prey);
				food.splice(i, 1);
				this.score += 1;
				console.log(currentKey)
				updatePlayer(t, currentKey)
				sendFoodEaten(i);
				// food.splice(i,1)

			}
		}
	}


	update() {
		let t = Object.assign({}, this)
		let mx = mouseX - this.x;
		let my = mouseY - this.y;
		
		if(mx!=0) mx = (mx>0?-1:1)
		if(my!=0) my = (my>0?-1:1)
		// s

		// this.dx = mx;
		// this.dy = my;
		offsetx += mx*5;
		offsety += my*5;
		t.x += mx;
		t.y += mx;
		
		
		t.x = max(width/2-BOUND, t.x);
		t.x = min(width/2+BOUND, t.x);
		t.y = min(height/2+BOUND, t.y);
		t.y = max(height/2-BOUND, t.y);
		t.realx = t.x + offsetx;
		t.realy = t.y + offsety;
		updatePlayer(t, currentKey);
	}

	drawName(drawx, drawy){
			fill(0,0,0);
			textSize(15);
			text(this.name, drawx- this.radius/2, drawy - this.radius/2);
	}

	drawReal() {
		if (this.life == 1) {
		
			// console.log(this.name)
			this.drawName(this.realx+offsetx, this.realy+offsety);
			fill(255, 0, 0);
			ellipse(this.realx + offsetx, this.realy + offsety, this.radius, this.radius);
		}

		// else{
		// 	fill(255);
		// }


	}


	draw() {

		// background(255)
		this.drawName(this.x, this.y);
		if (this.life == 1)
			fill(255, 0, 0)
		else
			fill(255);
		ellipse(this.x, this.y, this.radius, this.radius);
	}


	//Add reconnection feature
	//offset not workign
	//collide not working

	//buffer array
	//speed buffer
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
	txtFont = loadFont('inconsolata.ttf')
}

function takeName(){
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
	nameBox.position(width/2, height/2);
	button = createButton('Play')
	button.position(nameBox.x + nameBox.width, height/2)
	button.mousePressed(takeName);
	label = createElement('h2', 'Enter name');
	label.position(width/3, height/3);
	//console.log(windowWidth)
	// food = [];
	// for(let i=0;i<500;i++){
	// 	food.push(new Food());
	// }

	// console.log(dot);

	// sendPlayer(dot);
	// console.log(currentKey);

}

function drawGameOver() {
	textSize(100)
	fill(0, 255, 255)
	text('Game Over - Press R ', windowWidth / 2, windowHeight / 2);
	// textSize()
}

function keyPressed() {
	if (key == 'r' || key == 'R') {
		// currentKey = undefined;
		respawnPlayer();
		gameState = ALIVE;
	}
}



function draw() {
	background(255);
	
	// gameState = 2;
	// console.log(height)
	// console.log(windowHeight)


	// frameRate(1);
	
	if (gameState!=START) {
		// background(255)
		for (let i = 0; i < food.length; i++) {
			food[i].draw();
			if (players[currentKey]) {
				players[currentKey].isColliding(food[i]);
			}

		}




		for (let i in players) {
			if (players[i] != undefined && i != currentKey && players[currentKey] != undefined) {

				// console.log(players[i].name);
				players[i].drawReal();
				players[currentKey].isPlayerColliding(players[i], i);

			}

		}
		if (gameState == ALIVE) {
			if (players[currentKey] != undefined) {

				if (players[currentKey].life != 1) {
					gameState = DEAD;
				}
				console.log(players[currentKey].radius);
				players[currentKey].draw();
				players[currentKey].update();
			}



			//add offset boundary 

			//we have to coordinate offsets for all

			// if (players[currentKey]) {
			// 	if (players[currentKey].x + players[currentKey].radius / 2 >= windowWidth - 200) {
			// 		offsetx -= 5;
			// 	}
			// 	if (players[currentKey].x - players[currentKey].radius / 2 <= 200) {
			// 		offsetx += 5;
			// 	}
			// 	if (players[currentKey].y + players[currentKey].radius / 2 >= windowHeight - 200) {
			// 		offsety -= 5;
			// 	}
			// 	if (players[currentKey].y - players[currentKey].radius / 2 <= 200) {
			// 		offsety += 5;
			// 	}
			// }
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
	draw() {
		fill(0, 255, 0);
		rect(this.x + offsetx, this.y + offsety, 12, 12);
	}

}


//If life over, show game over screen -> Have to restart
//Show state
