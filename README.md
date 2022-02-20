# picoapi

PicoApi is a tiny API Proxy with hooks. Supported in both NodeJs and Browsers!

## Installation

Install the `picoapi` with the package manager used by your project, for example:

```sh
npm install picoapi
```

## Usage

Import `createApi` to create your api proxy and use methods to access api routes:

```js
import { createApi } from "picoapi";

const myApi = createApi("https://myapi.example.com");

const users = await myApi.users();
// => fetches 'https://myapi.example.com/users/'

const aUser = await myApi.users("example-user");
// => fetches 'https://myapi.example.com/users/example-user';
```

## Browser & NodeJS Support

Until the (currently experimental) fetch API is fully supported you can install `node-fetch` and use this import as a polyfill:

```js
import "picoapi/node-polyfill";
```

This sets a global variable that will be checked after `window.fetch` and `global.fetch`.

## Typescript Support (experimental)

Types for this library require the `@types/node-fetch` package to be installed.

## Planned features

- Better url resolving
  - ignore excess `/`s
  - add `https://` if no protocol is set
- Documentation on hooks (prefetch, error, success)
- Tests
