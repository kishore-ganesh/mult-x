var socket = io();


socket.on("players", data => {


    players={};
    for (let i in data.players) {


    if (data.players[i] != undefined) {
      players[i]=new Dot(
        data.players[i].x,
        data.players[i].y,
        data.players[i].radius,
        data.players[i].realx,
        data.players[i].realy
      );
      players[i].life=data.players[i].life;
    }
  }
  if (currentKey == undefined) {
    currentKey = socket.id;
    sendPlayer(dot);
}
});


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
      x: dot.x,
      y: dot.y,
      radius: dot.radius,
      realx: dot.x - offsetx,
      realy: dot.y - offsety,
      life: dot.life
    }
  });
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
  players[data.key].x = data.value.x;
  players[data.key].y = data.value.y;
  players[data.key].radius = data.value.radius;
  players[data.key].realx = data.value.realx;
  players[data.key].realy = data.value.realy;
  players[data.key].life=data.value.life;
});
