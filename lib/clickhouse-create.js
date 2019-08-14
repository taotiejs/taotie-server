const ch = require('./clickhouse-client');

module.exports = (table, dataSkippingIndices) => ch.query(`
CREATE TABLE IF NOT EXISTS ${table} (
  timestamp UInt64,
  level UInt8,
  hostname String,
  module String,
  message String,
  detail String,
  time DateTime,
  date Date DEFAULT toDate(timestamp/1000)${dataSkippingIndices ? `,
  INDEX message_index (lower(message), message) TYPE ngrambf_v1(3, 512, 3, 0) GRANULARITY 4,
  INDEX detail_index (lower(detail), detail) TYPE ngrambf_v1(3, 512, 3, 0) GRANULARITY 4` : ''}
) ENGINE = MergeTree()
ORDER BY (date, timestamp, level)
PARTITION BY toYYYYMM(date)
TTL time + INTERVAL 6 MONTH
`);
