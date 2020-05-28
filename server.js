var express = require('express');
var app=express();
var server = require('http').Server(app)
var io=require('socket.io')(server);



app.use('/', express.static("./agario"));


let players = {};

let playerSockets=[];

let playerCount = 0;

let food=[];


for(let i=0; i<500; i++)
{
    food.push({
        x: Math.random()*4000-2000,
        y: Math.random()*4000-2000
    });
}

//key value 



function sendPlayersToEveryone()
{
    io.emit('players', {players: players,
    playerCount: playerCount});
}


setInterval(()=>{
    if(food.length<500)
    {
        for(let i=0; i<10, food.length<=500; i++)
        {
            food.push({
                x: Math.random()*4000-2000,
                y: Math.random()*4000-2000
            })
        }

        io.emit("food", {food: food})
    }


}, 2000)

//secure client side

io.on('connection', (socket)=>{

    
    socket.emit('players', {players: players,
        playerCount: playerCount
    });

    socket.emit("food", {food: food});
    socket.on('newplayer', (data)=>{

    

        
        players[data.key]=data.value;
        console.log(players);
        playerSockets[socket.id]=data.key;
        io.emit('players', {
            players: players,
            playerCount: playerCount
        })


    })

    socket.on('update', (data)=>{

        
        if(players[data.key])
        {
            players[data.key].x=data.value.x;
            players[data.key].y=data.value.y;
            players[data.key].radius=data.value.radius;
            players[data.key].realx=data.value.realx;
            players[data.key].realy=data.value.realy;
            players[data.key].life= data.value.life;

            io.emit('playerUpdated', data)
        }    
        

    })

    socket.on("eaten", (data)=>{
        food.splice(data.index,1);
        console.log(food[0]);
        io.emit("food", {
            food: food
        })
    })

    socket.on("respawn", data => {
        console.log("RESPAWN CALLED") 
        delete players[data.key]
         socket.emit("players", {
             players,
             playerCount
         })
    })

    socket.on('disconnect', ()=>{

       
        if(playerSockets[socket.id]!=undefined)
        {
            delete players[socket.id];
        }

       

        sendPlayersToEveryone();

        
        // playerCount--;
    })

    //add food update


})

server.listen(process.env.PORT || 4000);

