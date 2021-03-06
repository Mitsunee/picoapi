# PicoApi

PicoApi is a tiny REST API Client with hooks. Supported in both NodeJs and Browsers!

## Installation

Install the `picoapi` with the package manager used by your project, for example:

```sh
npm install picoapi
```

## Experimental Feature Notice

- Currently API Methods accept a `RequestInit` (either native or from node-fetch) as second argument. This will change in a future version and also affect what errors get passed to the error hook.
- TypeScript typings are still experimental and may not be 100% functional yet.

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

All hook callbacks receive a `req` argument that contains at least the full request url, method and id.

### Hook: prefetch

The `prefetch` hook runs before any fetch request is sent. Returning an object with a value in the `data` property will cancel the fetch request and return your value.

```js
myApi.on("prefetch", ({ method, id }) => {
  if (method == "users" && id == "0") {
    return { data: { name: "Admin" } };
  }
  // otherwise no return, fetch request continues as normal
});
```

### Hook: error

The `error` hook is ran to handle errors. Its req argument also contains the status (status Code) and statusMessage of the request.

```js
myApi.on("error", req => {
  console.error(`Could not fetch ${req.url}`);
  console.error(`[ERROR] ${req.status}: ${req.statusMessage}`);
});
```

Returning an object with a value in the data property will cancel the promise rejection and return your value. A value in the error property instead let's you customize the error.

### Hook: success

The `success` will be ran at the end of a successful fetch request. Its argument will contain the result in the `req.data` property. Where possible (or forced) this this data will already have gone through `JSON.parse()`.

```js
myApi.on("success", req => {
  console.log(`Successfully fetched ${req.url}`);
  return { data: { ...req.data, time: Date.now() } };
});
```

As with the `prefetch` hook returning an object with a value in the data property lets you replace the returned response.

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

To describe methods you can use the prebuilt `ApiMethod` type:

```ts
interface MyApi extends Picoapi {
  users: ApiMethod<string[]>;
}
```

**Note:** Typescript support is currently experimental. If you encounter any problems or would like to suggest improvements feel free to open an issue.

## Examples

See [docs/examples](./docs/examples)

## Planned features

- Better url resolving
  - ignore excess `/`s
  - add `https://` if no protocol is set
- Custom Init system
- `ApiBuilder` class to enable re-useable hooks
