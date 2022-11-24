const express = require('express');
const cors = require('cors');
const io = require('socket.io')({
  path: '/webrtc'
});
const app = express();
const port = 3000;
const Turn = require('node-turn');

const turn = new Turn({
 // set options
 authMech: 'long-term',
 credentials: {
   username: "password",    
 },
  debugLevel: 'ALL',
});

app.use(cors());
app.use(express.static('public'));

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.use(cors('*'));

app.get('/', (req, res) => res.send('Hello World!'));

io.listen(server, {
  cors: {
    origin: '*',
  }
});

turn.start(()=>{
  console.log("TURN server is running");
});
// turn.logger.info('TURN server is running on port ' + turn.options.port);

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