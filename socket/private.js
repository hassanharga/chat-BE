module.exports = function (io) {
    io.on('connection', socket => {
        socket.on('join chat', (params) => {
            socket.join(params.room1);
            socket.join(params.room2);
            // console.log(params);
        });
        socket.on('start_typing', (data) => {
           socket.to(data.receiver).emit('is_typing', data);
        });
        socket.on('stop_typing', (data) => {
           socket.to(data.receiver).emit('has_stopped_typing', data);
        });
        
    });

}