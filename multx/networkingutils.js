

var socket = io();


socket.on("players", data => {
  // console.log(players)
  players = {};
  for (let i in data.players) {
    if (data.players[i] != undefined) {
      players[i] = new Dot(
        data.players[i].x,
        data.players[i].y,
        data.players[i].radius,
        data.players[i].realx,
        data.players[i].realy,
        data.players[i].name,
        data.players[i].score,
      );
      players[i].life = data.players[i].life;
    }
  }
});

function createPlayer() {
  currentKey = socket.id;
  let dot = {};
  dot.realx = random(0, width / 2) + dot.x
  dot.realy = random(0, height / 2) + dot.y
  dot.name = currentName;
  sendPlayer(dot);
}
socket.on("food", (data) => {
  // console.log(food);
  for (let i = 0; i < data.food.length; i++) {
    food[i] = new Food();
    food[i].x = data.food[i].x;
    food[i].y = data.food[i].y;
  }
})

function sendPlayer(dot) {
  socket.emit("newplayer", {
    key: currentKey,
    value: {
      key: currentKey,
      // radius: dot.radius,
      realx: dot.realx,
      realy: dot.realy,
      // life: dot.life,
      name: dot.name
    }
  });
}

function respawnPlayer() {
  key = currentKey
  currentKey = undefined
  socket.emit("respawn", { key })
  createPlayer();
}

function updatePlayer(data) {
  data.key = currentKey
  socket.emit("update", data);
}

function sendFoodEaten(i) {
  socket.emit("eaten", {
    index: i
  })
}

//current gravity should be max

socket.on("playerUpdated", updatedPlayers => {
  // console.log(data)
  // players = data;
  for (let player in updatedPlayers) {
    // players[player] 
    let data = updatedPlayers[player];
    // console.log(player)
    // console.log(data)
    if (players[data.key]) {
      players[data.key].x = data.x;
      players[data.key].y = data.y;
      players[data.key].radius = data.radius;
      players[data.key].score = data.score;
      players[data.key].realx = data.realx;
      players[data.key].realy = data.realy;
      players[data.key].life = data.life;
      players[data.key].name = data.name;
    }


  }

  // if(data.key == currentKey){
  //   // console.log(data.key);
  //   socket.emit("ack", {key: currentKey});
  // }
});

