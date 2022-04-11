import type { NodeFetch, Fetch } from "./types";

export function getFetchLib(): Fetch {
  // handle nodejs
  if (typeof window === "undefined") {
    // check for existing polyfill from next.js
    if (typeof global.fetch === "function") {
      return global.fetch;
    }

    // ignore typescript here because it doesn't really
    // understand our use of globals here.
    // @ts-ignore
    else if (typeof global._picoapiFetch === "function") {
      // @ts-ignore
      return global._picoapiFetch as NodeFetch;
    }

    // throw if fetch lib wasn't found at all
    throw new Error(
      "Could not find global fetch api, please use polyfill `import 'picoapi/node-polyfill'` at the top of your application"
    );
  }

  // handle browser
  return window.fetch;
}
