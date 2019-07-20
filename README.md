# Taotie Server

[![npm][badge-version]][npm]
[![npm downloads][badge-downloads]][npm]
[![license][badge-license]][license]


[![github][badge-issues]][github]

Log collecting and querying based on pinojs and clickhouse.

## Installation

```sh
npm install @taotie/server -g
```

## Usage

```sh
taotie [options]

Options:
  -V, --version                 output the version number
  -d, --db-host <hostname>      Database host (default: "127.0.0.1")
  -P, --db-port <port>          Database port (default: 80)
  -u, --db-user <username>      Database user
  -p, --db-password <password>  Database password
  -n, --db-name <database>      Database name (default: "taotie")
  -H, --http <port>             HTTP server port (default: 80)
  -U, --udp <port>              UDP log receiver port (default: 514)
  -i --interval <secode>        save logs interval
  -D, --dev                     development mode
  -h, --help                    output usage information
```

## Logger

You may use [`@taotie/logger`](https://github.com/taotiejs/taotie-logger) for logging.

[badge-version]: https://img.shields.io/npm/v/@taotie%2Fserver.svg
[badge-downloads]: https://img.shields.io/npm/dt/@taotie%2Fserver.svg
[npm]: https://www.npmjs.com/package/@taotie%2Fserver

[badge-size]: https://img.shields.io/bundlephobia/minzip/@taotie%2Fserver.svg
[bundlephobia]: https://bundlephobia.com/result?p=@taotie%2Fserver

[badge-license]: https://img.shields.io/npm/l/@taotie%2Fserver.svg
[license]: https://github.com/taotiejs/taotie-server/blob/master/LICENSE

[badge-issues]: https://img.shields.io/github/issues/taotiejs/taotie-server.svg
[github]: https://github.com/taotiejs/taotie-server

[badge-build]: https://img.shields.io/travis/com/taotiejs/taotie-server/master.svg
[travis]: https://travis-ci.com/taotiejs/taotie-server

[badge-coverage]: https://img.shields.io/coveralls/github/taotiejs/taotie-server/master.svg
[coveralls]: https://coveralls.io/github/taotiejs/taotie-server?branch=master
