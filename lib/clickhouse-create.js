const ch = require('./clickhouse-client');

module.exports = table => ch.query(`
CREATE TABLE IF NOT EXISTS ${table} (
  timestamp UInt64,
  level UInt8,
  hostname String,
  module String,
  message String,
  detail String,
  time DateTime,
  INDEX message_index (lower(message), message) TYPE ngrambf_v1(3, 512, 3, 0) GRANULARITY 4,
  INDEX detail_index (lower(detail), detail) TYPE ngrambf_v1(3, 512, 3, 0) GRANULARITY 4
) ENGINE = MergeTree()
ORDER BY (timestamp, level)
TTL time + INTERVAL 6 MONTH
`);
