// const {
//   inherits,
//   promisify,
// } = require('util');
const ClickHouse = require('@apla/clickhouse');
const sql = require('sql-bricks')._extension();

let client;
let query;

function then(resolve, reject) {
  const s = this.toString();
  console.info('sql', s);
  return query(s).then(resolve, reject);
}

function limit(l, offset) {
  if (l > 0) {
    this._limit = l;
    if (offset > 0) {
      this._limit = `${offset}, ${l}`;
    }
  }
  return this;
}

[
  'select',
  'insert',
  'update',
  'delete',
].forEach((method) => {
  const Method = exports[method] = sql[method];
  Method.prototype.then = then;
});

exports.select.prototype.limit = limit;
exports.select.defineClause('limit', '{{#ifNotNull _limit}}LIMIT {{_limit}}{{/ifNotNull}}', { after: 'orderBy' });

exports.connect = (options) => {
  client = new ClickHouse(options);
  query = exports.query = client.querying.bind(client); // promisify(client.query.bind(client));
};
