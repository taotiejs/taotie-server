const ch = require('./lib/clickhouse-client');
const receiver = require('./lib/log-receiver');
const httpServer = require('./lib/http-server');

module.exports = ({
  db = {},
  http = 80,
  udp = 514,
  interval = 5,
} = {}) => {
  ch.connect(db);
  receiver(udp, ch, interval);
  httpServer(http, ch);
};
