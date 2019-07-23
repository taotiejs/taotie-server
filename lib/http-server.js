const { resolve } = require('path');
const snakeCase = require('lodash.snakecase');
const polka = require('polka');
const send = require('@polka/send-type');
const sirv = require('sirv');
const {
  and,
  or,
  like,
  gte,
  lte,
} = require('sql-bricks');

const dev = process.env.NODE_ENV === 'development';

function conditional(res, pathname, stats) {
  if (pathname === '/') {
    const etag = res.getHeader('etag') || `W/"${stats.size}-${stats.mtime.getTime()}"`;
    const ifNoneMatch = res.reqHeaders['if-none-match'];
    res.setHeader('Cache-Control', 'max-age=0');
    if (etag && ifNoneMatch && etag === ifNoneMatch) {
      res.statusCode = 304;
      res.end();
    }
  } else if (!dev) {
    res.setHeader('Cache-Control', 'public,max-age=31536000,immutable');
  }
}

module.exports = (port, ch) => {
  polka()
    .use((req, res, next) => {
      res.reqHeaders = req.headers;
      try {
        next();
      } catch (err) {
        err;
      }
    })
    .use(sirv(resolve(__dirname, '../public'), {
      dev,
      etag: true,
      setHeaders: conditional,
    }))
    .get('/logs', async (req, res) => {
      const { query } = req;
      if (!query.project) {
        send(res, 404);
        return;
      }
      const wheres = [];
      if (query.timestampStart && query.timestampStart !== '0') {
        wheres.push(gte('timestamp', parseInt(query.timestampStart, 10)));
      }
      if (query.timestampEnd && query.timestampEnd !== '0') {
        wheres.push(lte('timestamp', parseInt(query.timestampEnd, 10)));
      }
      if (query.level) {
        wheres.push(gte('level', parseInt(query.level, 10)));
      }
      if (query.msg) {
        wheres.push(or(like('message', `%${query.msg}%`), like('detail', `%${query.msg}%`)));
      }
      const dbQuery = ch
        .select('timestamp, level, hostname, module, message, detail')
        .from(snakeCase(query.project))
        .order('timestamp ASC, level ASC')
        .limit(50, parseInt(query.offset, 10));
      const logs = await (wheres.length ? dbQuery.where(and(...wheres)) : dbQuery);
      send(res, 200, logs);
    })
    .listen(port, (err) => {
      if (err) {
        console.error('http server error', err);
        return;
      }
      console.info('http server listening on', port);
    });
};
