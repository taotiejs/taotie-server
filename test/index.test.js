// const dgram = require('dgram');
const taotie = require('../index');

const udp = 43210;
// const socket = dgram.createSocket('udp4');

taotie({
  db: {
  },
  udp,
});

// setInterval(() => {
//   const msg = (new Date()).toISOString();
//   const data = JSON.stringify({
//     level: 30,
//     time: Date.now(),
//     project: 'abacus-console-system',
//     module: '',
//     msg,
//     pid: 657,
//     hostname: 'Davids-MBP-3.fritz.box',
//     v: 1,
//   });
//   socket.send(data, 0, data.length, udp, '127.0.0.1');
// }, 1000);
