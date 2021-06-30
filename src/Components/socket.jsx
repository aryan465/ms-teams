import socket from 'socket.io';


const users = {};

io.on("connection", socket => {
    if(!users[socket.id]){
        users[socket.id] = socket.id;
    }

    socket.emit("userID: ", socket.id);
    io.sockets.emit("allusers: ", users);
    socket.on("disconnect", ()=>{
        delete users[socket.id];
    })

    socket.on("callUser", (data) =>{
        io.to(data.userToCall).emit('hi', {signal: data.signalData, from: data.from});

    })

    socket.on("acceptCall", (data) => {
        io.to(data.to).emit('callAccepted', data.signal);
    })
});