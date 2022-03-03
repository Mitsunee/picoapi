# PicoApi

PicoApi is a tiny REST API Client with hooks. Supported in both NodeJs and Browsers!

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

const exampleUser = await myApi.users("example-user");
// => fetches 'https://myapi.example.com/users/example-user';
```

## Hooks

Use the `on` and `unbind` methods to manage hooks:

```js
myApi.on("success", myFunction); // attach success hook
myApi.unbind("success"); // unbinds success hook
myApi.unbind(); // unbinds all hooks
```

### Hook: prefetch

The `prefetch` hook runs before any fetch request is sent. It receives an object with the full request url. Returning a truthy value from your prefetch hook will cancel the fetch request and return your value!

```js
myApi.on("prefetch", req => {
  if (req.url.endsWith("users/0")) {
    return { name: "Admin" };
  }
  // otherwise no return, fetch request continues as normal
});
```

### Hook: error

The `error` hook is ran to handle errors. It receives an object with the request url, status and statusMessage of the request.

```js
myApi.on("error", req => {
  console.error(`Could not fetch ${req.url}`);
  console.error(`[ERROR] ${req.status}: ${req.statusMessage}`);
});
```

Note that using running the error hook will prevent any errors from being thrown as simply passes the return value of your hook as the response. Use `Promise.reject` or `throw` if you would like to catch the error yourself!

### Hook: success

The `success` will be ran at the end of a successful fetch request. It receives an object with the request url and data. Where possible (or forced) this this data will already have gone through `JSON.parse()`.

```js
myApi.on("success", (req) => {
  console.log(`Successfully fetched ${req.url}`);
  return {
    ...req.data,
    time: Date.now();
  };
})
```

As with the `prefetch` hook returning a truthy value from this hook lets you replace the returned response.

## Browser & NodeJS Support

PicoApi automatically checks `window` and `global` for an existing fetch API. This means Browser and NodeJS17.x (with experimental Fetch API enabled) are supported by default.

For NodeJS until the (currently experimental) fetch API is fully supported you can install `node-fetch` and use this import as a polyfill:

```js
import "picoapi/node-polyfill";
```

This sets a global variable that will be checked after `window.fetch` and `global.fetch`.

## Typescript Support (experimental)

Types for this library require the `@types/node-fetch` package to be installed. You can use Generics to attach a type to your API like:

```ts
createApi<MyInterfaceHere>(urlGoesHere);
```

To describe methods you can use the prebuilt `PicoRequest` type:

```ts
interface MyInterfaceHere {
  users: PicoRequest<string>;
}
```

These and further interfaces for Hooks and Fetch Inits can be found in [index.d.ts](index.d.ts).

**NOTE:** Typescript support is currently experimental. If you encounter any problems or would like to suggest improvements feel free to open an issue.

## Planned features

- Better url resolving
  - ignore excess `/`s
  - add `https://` if no protocol is set
- (breaking) allow for prefetch hook to transform url
- (likely breaking) better error handling
- (breaking) allow for success hook to return falsey data
- `ApiBuilder` class to enable re-useable hooks
