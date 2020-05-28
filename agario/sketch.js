class Dot {
	constructor(x, y, radius, realx, realy) {
		this.x = x;
		this.y = y;
		this.life = 1;
		this.score = 0;

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
				this.radius += 10;
				console.log("collided")
				let i = food.indexOf(prey);
				this.score += 1;
				sendFoodEaten(i);
				// food.splice(i,1)

			}
		}
	}


	update() {
		let t = Object.assign({}, this)
		t.x = mouseX;
		t.y = mouseY;
		t.realx = this.x - offsetx;
		t.realy = this.y - offsety;
		
		updatePlayer(t, currentKey);
	}

	drawReal() {
		if (this.life == 1) {
			fill(255, 0, 0);
			ellipse(this.realx + offsetx, this.realy + offsety, this.radius, this.radius);
		}

		// else{
		// 	fill(255);
		// }


	}


	draw() {

		// background(255)
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
var gameState = 1; //1 = Alive, 2 = Dead
function preload(){
	txtFont = loadFont('inconsolata.ttf')
}
function setup() {
	createCanvas(windowWidth, windowHeight);
	// console.log(txtFont);
	textFont(txtFont)
	textSize(width/3);
	textAlign(CENTER, CENTER)
	//console.log(windowWidth)
	// food = [];
	// for(let i=0;i<500;i++){
	// 	food.push(new Food());
	// }

	// console.log(dot);

	// sendPlayer(dot);
	// console.log(currentKey);

}

function drawGameOver(){
	textSize(100)
	fill(0,255,255)
	text('Game Over - Press R ', windowWidth/2,windowHeight/2);
	// textSize()
}

function keyPressed(){
	if(key=='r'||key=='R'){
		// currentKey = undefined;
		respawnPlayer();
		gameState = 1;
	}
}


function draw() {
	background(255);
	// gameState = 2;
	// console.log(height)
	// console.log(windowHeight)
	
	
	// frameRate(1);
	for (let i = 0; i < food.length; i++) {
		food[i].draw();
		if (players[currentKey]) {
			players[currentKey].isColliding(food[i]);
		}

	}




	for (let i in players) {
		if (players[i] != undefined && i != currentKey && players[currentKey] != undefined) {

			players[i].drawReal();
			players[currentKey].isPlayerColliding(players[i], i);

		}

	}
	if (gameState == 1) {
		if (players[currentKey] != undefined) {
			
			if(players[currentKey].life!=1){
				gameState = 2;
			}
			players[currentKey].draw();
			players[currentKey].update();
		}



		//add offset boundary 

		//we have to coordinate offsets for all

		if (players[currentKey]) {
			if (players[currentKey].x + players[currentKey].radius / 2 >= windowWidth - 200) {
				offsetx-=5;
			}
			if (players[currentKey].x - players[currentKey].radius / 2 <= 200) {
				offsetx+=5;
			}
			if (players[currentKey].y + players[currentKey].radius / 2 >= windowHeight - 200) {
				offsety-=5;
			}
			if (players[currentKey].y - players[currentKey].radius / 2 <= 200) {
				offsety+=5;
			}
		}
	}
	else{
		drawGameOver();
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
