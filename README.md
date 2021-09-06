<div align="center">
    <br />
    <p>
    <a href="https://www.npmjs.com/package/snowflake-uuid">
        <img src="https://nodei.co/npm/snowflake-uuid.png" alt="NPM Repository">
    </p>
    <p>
        <a href="https://github.com/rakheyl/snowflake-uuid/issues">
            <img src="https://img.shields.io/github/issues/rakheyl/snowflake-uuid?style=flat-square" alt="GitHub issues" />
        </a>
        <a href="https://github.com/rakheyl/snowflake-uuid/blob/main/LICENSE">
            <img src="https://img.shields.io/github/license/rakheyl/snowflake-uuid?style=flat-square" alt="GitHub license" />
        </a>
        <a href="https://github.com/rakheyl/snowflake-uuid/blob/main/package.json">
            <img alt="node-current" src="https://img.shields.io/node/v/snowflake-uuid">
        </a>
        <a href="https://www.npmjs.com/package/snowflake-uuid">
            <img src="https://img.shields.io/npm/v/snowflake-uuid" alt="NPM version" />
        </a>
    </p>
</div>

# Snowflake-UUID

[Twitter's Snowflake](https://github.com/twitter-archive/snowflake/tree/snowflake-2010) generator for NodeJS.

-   Speedy
-   Lightweight
-   Zero dependencies

Snowflake-UUID can generate unique Id numbers at high scale with some simple guarantees.

## Installing

```
npm install snowflake-uuid
// or
yarn add snowflake-uuid
// or
pnpm add snowflake-uuid
```

## Example

```js
import { Worker } from 'snowflake-uuid';
// const { Worker } = require('snowflake-uuid');

const generator = new Worker(0, 1, {
	workerIdBits: 5,
	datacenterIdBits: 5,
	sequenceBits: 12,
});

generator.nextId(); // 87559690812260352n
generator.nextId().toString(); // 87559690833231872

generator.getCurrentSequence(); // 0n
generator.getDatacenterId(); // 1n
generator.getLastTimestamp(); // 1630335057075n
generator.getWorkerId(); // 0n
```

Generated IDs are [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) and can be easily converted into strings.

## Constructor Options

| Property                 | Description                                                                                                                   | Optional? | Type             | Default Value |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | --------- | ---------------- | ------------- |
| workerId                 | Id for the worker                                                                                                             | Yes       | Number or BigInt | 0             |
| datacenterId             | Identifier of the datacenter to which the worker belongs                                                                      | Yes       | Number or BigInt | 0             |
| options                  | Custom options for the worker                                                                                                 | Yes       | Object           | undefined     |
| options.epoch            | Custom epoch for timestamp generation. By default, the number of milliseconds since the first second of 2021                  | Yes       | Number or BigInt | 1609459200000 |
| options.workerIdBits     | Number of usable bits for Worker Id. 5 by default, allows up to 31 Workers                                                    | Yes       | Number or BigInt | 5             |
| options.datacenterIdBits | Number of usable bits for Datacenter Id. 5 by default, allows up to 31 Datacenters                                            | Yes       | Number or BigInt | 5             |
| options.sequence         | For every Id that is generated on that process, this number is incremented                                                    | Yes       | Number or BigInt | 0             |
| options.sequenceBits     | Number of usable bits for Sequence Id. 12 by default, allows up to 4095 generations per millisecond per Worker per Datacenter | Yes       | Number or BigInt | 12            |

## Useful Links

-   [Twitter's Snowflake repository](https://github.com/twitter-archive/snowflake/tree/snowflake-2010)
-   [Announcing Snowflake](https://blog.twitter.com/engineering/en_us/a/2010/announcing-snowflake.html)
-   [Twitter Ids](https://developer.twitter.com/en/docs/twitter-ids)
-   [The GitHub repo](https://github.com/rakheyl/snowflake-uuid)
-   [The NPM package](https://www.npmjs.com/package/snowflake-uuid)

## License

Refer to the [LICENSE](LICENSE) file.
