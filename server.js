var express = require('express');
var app = express();
var server = require('http').Server(app)
var io = require('socket.io')(server);

app.use('/', express.static("./agario"));


let players = {};
let playerSockets = [];
let playerCount = 0;
let food = [];
const BOUND = 5;


function makeArray(w, h, val) {
    var arr = [];
    for(let i = 0; i < h; i++) {
        arr[i] = [];
        for(let j = 0; j < w; j++) {
            arr[i][j] = val;
        }
    }
    return arr;
}

let needsCheck = makeArray(4000,4000,'0')

function getCheckIndex(x,y) {
    if (x > 2000) x = 2000
    if (x < -2000) x = -2000
    if (y > 2000) y = 2000
    if (y < -2000) y = -2000
    return [x+2000,y+2000]
}
function createRandomFood() {
    let x = Math.random() * 4000 - 2000 // -2000 to 2000
    let y = Math.random() * 4000 - 2000
    let checkIndices = getCheckIndex(x,y)
    needsCheck[checkIndices[0], checkIndices[1]] = '1'
    food.push({
        x: x,
        y: y
    });
}

for (let i = 0; i < 500; i++) {
    createRandomFood()
}

function sendPlayersToEveryone() {
    io.emit('players', {
        players: players,
        playerCount: playerCount
    });
}

setInterval(() => {
    if (food.length < 500) {
        // console.log("CHANGE");
        // console.log(food.length)
        for (let i = 0; i < 10, food.length <= 500; i++) {
            createRandomFood()
        }

        io.emit("food", { food: food })
    }


}, 2000)


function dist(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((y2 - y1), 2) + Math.pow((x2 - x1), 2));
}

function isPlayerColliding(key, otherPlayer, i) {
    console.log("COLL");
    if (otherPlayer.life == 1 && players[key].life == 1) {
        let player = players[key];
        let d = dist(otherPlayer.realx, otherPlayer.realy, players[key].realx, players[key].realy)
        if (d <= player.radius / 2 && otherPlayer.radius < player.radius - 10) {
            // console.log("collided")
            player.radius += otherPlayer.radius * 0.3;
            player.score += Math.ceil(otherPlayer.score * 0.3);
            otherPlayer.life = 0;
            return true;

        }

        return false;

        // else if(d<=this.radius/2&&otherPlayer.radius>this.radius-10){

        // 	this.life=0;
        // 	otherPlayer.radius+=this.radius*0.3;
        // 	updatePlayer(this, currentKey);


    }
}

function updatePlayer(io, key, data) {
    let player = players[key];
    let mx = data.mouseX - data.x;
    let my = data.mouseY - data.y;

    if (mx != 0) mx = (mx > 0 ? 1 : -1)
    if (my != 0) my = (my > 0 ? 1 : -1)
    // s
    // console.log(mx + " " + my);
    // this.dx = mx;
    // this.dy = my;
    player.realx += mx * 5;
    player.realy += my * 5;
    let prevx = player.x;
    let prevy = player.y;
    player.x += mx * 0.5;
    player.y += mx * 0.5;


    player.x = Math.max(-BOUND, player.x);
    player.x = Math.min(BOUND, player.x);
    player.y = Math.min(BOUND, player.y);
    player.y = Math.max(-BOUND, player.y);
    // player.realx = player.x - offsetx;
    // player.realy = player.y - offsety;
    player.realx += player.x - prevx;
    player.realy += player.y - prevy;
    // updatePlayer(t, currentKey);
    // io.emit('playerUpdate', player);
}

function checkPlayers(io, key) {
    for (let i in players) {

        if (players[i] != undefined && i != key && players[key] != undefined) {

            // console.log(players[i].name);
            // players[i].drawReal();
            if (isPlayerColliding(key, players[i], i)) {
                // io.emit('playerUpdate', players[key]);
                // io.emit('playerUpdate', players[i]);
            }

        }


    }
}

function isColliding(key, prey) {
    let player = players[key];
    if (player.life == 1) {
        let d = dist(prey.x, prey.y, player.realx, player.realy)
        // console.log(d);
        // console.log(player.radius);
        if (d <= player.radius / 2) {
            return true;

        }
    }
    return false;
}

function runCheck(xCenter, yCenter, r) {
    for (x = xCenter - r ; x <= xCenter; x++) {
        for (y = yCenter - r ; y <= yCenter; y++)
        {
            // we don't have to take the square root, it's slow
            if ((x - xCenter)*(x - xCenter) + (y - yCenter)*(y - yCenter) <= r*r) 
            {
                let xSym = Math.floor(xCenter - (x - xCenter));
                let ySym = Math.floor(yCenter - (y - yCenter));
                let _x = Math.floor(x)
                let _y = Math.floor(y)
                // console.log(_x, _y, xSym, ySym)
                let p1 = getCheckIndex(_x,_y)
                let p2 = getCheckIndex(_x,ySym)
                let p3 = getCheckIndex(xSym,_y)
                let p4 = getCheckIndex(xSym,ySym)
                if (needsCheck[p1[0]][p1[1]] === '1') return true;
                if (needsCheck[p2[0]][p2[1]] === '1') return true;
                if (needsCheck[p3[0]][p3[1]] === '1') return true;
                if (needsCheck[p4[0]][p4[1]] === '1') return true;
                // (x, y), (x, ySym), (xSym , y), (xSym, ySym) are in the circle
            }
        }
    }
    return false;
}
function checkFood(io, key) {
    let marked = new Array(food.length);
    marked.fill(0);
    let player = players[key]
    cI = getCheckIndex(player.realx, player.realy)
    console.log(runCheck(player.realx, player.realy, player.radius))
    // console.log()
    // if (!) {
    //     console.log("No check")
    //     return
    // }
    // console.log("CHECK")
    for (let i = 0; i < food.length; i++) {
        if (player) {

            if (isColliding(key, food[i])) {
                // food.splice(data.index,1);
                // console.log("EATEN");
                chkIdx = getCheckIndex(food[1].x, food[i].y)
                needsCheck[chkIdx[0], chkIdx[1]] = '0'
                marked[i] = 1;
            };
        }
    }
    nfood = [];
    for (let i = 0; i < food.length; i++) {
        if (!marked[i]) {
            nfood.push(food[i])
        }
        else {
            players[key].score += 1;
            players[key].radius += 9.5*(Math.pow((7/10), players[key].score)) + 0.5;
        }
    }
    food = nfood;
    // io.emit("food", {
    //     food: food
    // })

    // io.emit("playerUpdated", players[key])
}

//secure client side

io.on('connection', (socket) => {


    socket.emit('players', {
        players: players,
        playerCount: playerCount
    });

    socket.emit("food", { food: food });
    socket.on('newplayer', (data) => {


        // console.log(data)
        let player = data.value;
        player.x = 0;
        player.y = 0;
        player.radius = 50;
        player.life = 1;
        player.score = 0;
        player.key = data.key;
        // console.log(player.key)
        players[data.key] = player;
        // console.log(players);
        playerSockets[socket.id] = data.key;
        // playerCount.ack =
        io.emit('players', {
            players: players,
            playerCount: playerCount
        })


    })

    socket.on('update', (data) => {


        if (players[data.key]) {
            // players[data.key].life= data.value.life;
            // if(players[data.key].ack==1){
            //     players[data.key].x=data.value.x;
            //     players[data.key].y=data.value.y;
            //     players[data.key].radius=data.value.radius;
            //     players[data.key].realx=data.value.realx;
            //     players[data.key].realy=data.value.realy;
            // }
            // players[data.key].ack = 0;

            // data.name = players[data.key].name 
            // console.log(players[data.key]);
            // console.log(data)
            updatePlayer(io, data.key, data);
            checkFood(io, data.key);
            checkPlayers(io, data.key);

            // console.log(players);
            io.emit('playerUpdated', players)
            io.emit('food', { food });
        }


    })

    socket.on("eaten", (data) => {
        food.splice(data.index, 1);
        // console.log(food[0]);
        io.emit("food", {
            food: food
        })
    })

    socket.on("ack", (data) => {
        players[data.key].ack = 1;
    })

    socket.on("respawn", data => {
        // console.log("RESPAWN CALLED")
        delete players[data.key]
        socket.emit("players", {
            players,
            playerCount
        })
    })

    socket.on('disconnect', () => {


        if (playerSockets[socket.id] != undefined) {
            delete players[socket.id];
        }
        sendPlayersToEveryone();
        // playerCount--;
    })

    //add food update


})

server.listen(process.env.PORT || 4000);

