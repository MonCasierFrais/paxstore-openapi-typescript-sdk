<img src="./mcf-logo.png" height="28" align="left" style="margin-right:8px"/> [![npm version](https://img.shields.io/npm/v/@moncasierfrais.fr/paxstore-openapi-sdk)](https://www.npmjs.com/package/@moncasierfrais.fr/paxstore-openapi-sdk)

# paxstore-openapi-typescript-sdk

Unofficial TypeScript SDK for the PAXSTORE Cloud OpenAPI, allowing customer systems to synchronize related data.
> For the original Java SDK documentation, refer to the [official PAXSTORE OpenAPI Java SDK README](https://github.com/PAXSTORE/paxstore-openapi-java-sdk/blob/master/README.md).

Developed and made public by [MonCasierFrais](https://www.moncasierfrais.fr/).

## Installation

```bash
npm install @moncasierfrais.fr/paxstore-openapi-sdk
```

## Example Usage

This example lists terminals from PAXSTORE using the `TerminalApi`.

### Setup

Create a `.env` file at the project root:

```env
PAXSTORE_BASE_URL=https://your-paxstore-instance.com
PAXSTORE_API_KEY=your_api_key
PAXSTORE_API_SECRET=your_api_secret
```

### Code

```ts
import 'dotenv/config';
import { TerminalApi, TerminalSearchOrderBy } from '@moncasierfrais.fr/paxstore-openapi-sdk';

const api = new TerminalApi(
  process.env.PAXSTORE_BASE_URL!,
  process.env.PAXSTORE_API_KEY!,
  process.env.PAXSTORE_API_SECRET!
);

const result = await api.searchTerminal(1, 20, TerminalSearchOrderBy.Name);

if (result.businessCode !== 0) {
  console.error(result.message);
  process.exit(1);
}

const terminals = result.pageInfo?.dataSet ?? [];
console.log(`Total terminals: ${result.pageInfo?.totalCount ?? 0}`);

for (const terminal of terminals) {
  console.log(`[${terminal.tid}] ${terminal.name} — SN: ${terminal.serialNo} — Status: ${terminal.status}`);
}
```

### Expected output

```
Total terminals: 42
---
[TID001] Terminal A — SN: SN123456 — Status: A
[TID002] Terminal B — SN: SN789012 — Status: A
```

## Requirements

- Node.js >= 18.0.0

## License

[Apache-2.0](./LICENSE)