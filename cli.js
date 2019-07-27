#!/usr/bin/env node
const cmd = require('commander');
const pkg = require('./package');

const toInt = str => parseInt(str, 10);

cmd
  .version(pkg.version)
  .usage('[options]')
  .option('-d, --db-host <hostname>', 'clickhouse host', '127.0.0.1')
  .option('-P, --db-port <port>', 'clickhouse port', toInt, 80)
  .option('-a, --db-auth <username:password>', 'clickhouse username and password')
  .option('-n, --db-name <database>', 'clickhouse database name', 'taotie')
  .option('-H, --http <port>', 'HTTP server port', toInt, 80)
  .option('-U, --udp <port>', 'UDP log receiver port', toInt, 514)
  .option('-i --interval <second>', 'save logs interval', toInt, 5)
  .option('-I --data-skipping-indices', 'enable clickhouse data skipping indices')
  .option('-D, --dev', 'development mode')
  .parse(process.argv);

if (cmd.dev) {
  process.env.NODE_ENV = 'development';
}

const taotie = require('./index');

console.log(cmd);

taotie({
  db: {
    host: cmd.dbHost,
    port: cmd.dbPort,
    auth: cmd.dbAuth,
    queryOptions: {
      database: cmd.dbName,
    },
  },
  http: cmd.http,
  udp: cmd.udp,
  interval: cmd.interval,
  dataSkippingIndices: cmd.dataSkippingIndices,
});
