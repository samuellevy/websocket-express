const express = require('express');
const cors = require('cors');
const io = require('socket.io')({
  path: '/webrtc'
});
const app = express();
const port = 3000;

app.use(cors('*'));

app.get('/', (req, res) => res.send('Hello World!'));

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

io.listen(server, {
  cors: {
    origin: '*',
  }
});

const webRTCNamespace = io.of('/webRTCPeers');
webRTCNamespace.on('connection', socket => {
  console.log(socket.id); 

  socket.emit('connection-success', {
    status: 'success',
    socketId: socket.id
  })

  socket.on('disconnect', () => {
    console.log(`disconnect ${socket.id}`);
  });

  socket.on('sdp', data => {
    console.log(data);
    socket.broadcast.emit('sdp', data);
  });

  socket.on('candidate', data => {
    console.log(data);
    socket.broadcast.emit('candidate', data);
  });
})