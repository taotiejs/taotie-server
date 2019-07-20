#!/usr/bin/env node
const cmd = require('commander');
const pkg = require('./package');

cmd
  .version(pkg.version)
  .usage('taotie [options]')
  .option('-d, --db-host <hostname>', 'Database host', '127.0.0.1')
  .option('-P, --db-port <port>', 'Database port', parseInt, 80)
  .option('-u, --db-user <username>', 'Database user')
  .option('-p, --db-password <password>', 'Database password')
  .option('-n, --db-name <database>', 'Database name', 'taotie')
  .option('-H, --http <port>', 'HTTP server port', parseInt, 80)
  .option('-U, --udp <port>', 'UDP log receiver port', parseInt, 514)
  .option('-i --interval <secode>', 'save logs interval')
  .option('-D, --dev', 'development mode')
  .parse(process.argv);

if (cmd.dev) {
  process.env.NODE_ENV = 'development';
}

const taotie = require('./index');

taotie({
  db: {
    host: cmd.dbHost,
    port: cmd.dbPort,
    user: cmd.dbUser,
    password: cmd.dbPassword,
    queryOptions: {
      database: cmd.dbName,
    },
  },
  http: cmd.http,
  udp: cmd.udp,
  interval: cmd.interval,
});
