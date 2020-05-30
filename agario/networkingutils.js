

var socket = io();


socket.on("players", data => {

    // console.log(players)
    players={};
    for (let i in data.players) {


    if (data.players[i] != undefined) {
      players[i]=new Dot(
        data.players[i].x,
        data.players[i].y,
        data.players[i].radius,
        data.players[i].realx,
        data.players[i].realy,
        data.players[i].name
      );
      players[i].life=data.players[i].life;
    }
  }
  // console.log(currentKey)
  if (currentKey == undefined) {
    
}
});

function createPlayer(){
    currentKey = socket.id;
    dot.x = windowWidth/2;
    dot.y = windowHeight/2;
    dot.realx = random(0, width/2) + dot.x 
    dot.realy = random(0, height/2) +dot.y
    dot.name = currentName;
    // console.log(dot.name)
    sendPlayer(dot);
}
socket.on("food", (data)=>{
    // console.log(food);
    for(let i=0; i<data.food.length; i++)
    {
      
      food[i]=new Food();
      food[i].x=data.food[i].x;
      food[i].y=data.food[i].y;
      
    }

    



})

function sendPlayer(dot) {
  socket.emit("newplayer", {
    key: currentKey,
    value: {
      key: currentKey,
      x: dot.x,
      y: dot.y,
      radius: dot.radius,
      realx: dot.x - offsetx,
      realy: dot.y - offsety,
      life: dot.life,
      name: dot.name
    }
  });
}

function respawnPlayer(){
  key = currentKey
  currentKey = undefined
  socket.emit("respawn", {key})
  createPlayer();
  
}

function updatePlayer(player,key) {
  socket.emit("update", {
    key: key,
    value: player
  });
}

function sendFoodEaten(i)
{
    socket.emit("eaten", {
        index: i
    })
}

//current gravity should be max

socket.on("playerUpdated", data => {
  // console.log(data)
  players[data.key].x = data.x;
  players[data.key].y = data.y;
  players[data.key].radius = data.radius;
  players[data.key].realx = data.realx;
  players[data.key].realy = data.realy;
  players[data.key].life=data.life;
  players[data.key].name = data.name;
});

