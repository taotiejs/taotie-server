const dgram = require('dgram');
const snakeCase = require('lodash.snakecase');
const createTable = require('./clickhouse-create');

const receiver = (port, msgHandler) => new Promise((resolve) => {
  const socket = dgram.createSocket('udp4');
  socket.on('message', msg => msgHandler(msg.toString()));
  socket.on('error', err => console.error('log receiver error', err.message));
  socket.on('listening', () => console.info('log receiver listening on', port));
  socket.bind(port, () => resolve(socket));
});

module.exports = (port, db, interval, dataSkippingIndices) => {
  const projects = {};
  receiver(port, (data) => {
    try {
      const log = JSON.parse(data);
      const {
        time = Date.now(),
        level = 0,
        hostname = '',
        project,
        module: mod,
        msg,
      } = log;
      if (!project) {
        console.error('project not specific', data);
        return;
      }

      delete log.project;
      delete log.module;
      delete log.time;
      delete log.level;
      delete log.hostname;
      delete log.msg;
      delete log.pid;
      delete log.v;

      const tableName = snakeCase(project);
      const logs = projects[tableName];
      const record = {
        timestamp: time,
        level,
        time: Math.round(time / 1000),
        hostname,
        module: mod,
        message: msg,
        detail: Object.keys(log).length ? JSON.stringify(log) : '',
      };
      if (!logs) {
        projects[tableName] = [record];
        createTable(tableName, dataSkippingIndices)
          .then(() => {}, err => console.error('create table failed', err));
      } else {
        logs.push(record);
      }
    } catch (err) {
      console.error('receive log failed', err);
    }
  });
  setInterval(() => {
    Promise.all(Object.keys(projects).map(async (mod) => {
      const logs = projects[mod];
      const { length } = logs;
      if (length) {
        try {
          await db.insert(mod, logs.slice(0, length));
        } catch (err) {
          console.error('save log failed', err, logs.slice(0, length));
        }
        logs.splice(0, length);
      }
    }))
      .catch(err => console.error('save log failed', err));
  }, interval * 1000);
};
