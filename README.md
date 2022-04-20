# PicoApi

PicoApi is a tiny REST API Client with hooks. Supported in both NodeJs and Browsers!

## Installation

Install the `picoapi` with the package manager used by your project, for example:

```sh
npm install picoapi
```

## Experimental Feature Notice

- Currently API Methods accept a `RequestInit` (either native or from node-fetch) as second argument. This will change in a future version and also affect what errors get passed to the error hook.
- Hooks are currently still unstable and the API will very likely change in a future version.
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

## Hooks (unstable)

The Hooks API is not yet finalized. A currently somewhat functional implementation is documented here with notes as to changes planned in future releases. It is recommended to not rely on this feature yet.

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

**Note:** The return type of this will change in the future to allow falsey returns or overriding of urls.

### Hook: error

The `error` hook is ran to handle errors. It receives an object with the request url, status and statusMessage of the request.

```js
myApi.on("error", req => {
  console.error(`Could not fetch ${req.url}`);
  console.error(`[ERROR] ${req.status}: ${req.statusMessage}`);
});
```

Note that using running the error hook will prevent any errors from being thrown as it simply passes the return value of your hook as the response. Use `Promise.reject` or `throw` if you would like to throw a custom Error!

**Note:** The return type of this hook will possibly change in the future to allow returning default data or custom Errors without needing to use `throw` yourself.

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

**Note:** The return type of this hook will change in a future version similar to prefetch as well as allowing to cause an error despite seemingly successful response!

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
- (breaking) better API for hooks that allows for greater flexibility with error handling, as well as data transformation
- (likely breaking) better error handling
- Custom Init system
- `ApiBuilder` class to enable re-useable hooks
