export function getFetchLib() {
  // handle nodejs
  if (typeof window === "undefined") {
    // check for existing polyfill from next.js
    if (typeof global.fetch === "function") {
      return global.fetch;
    } else if (typeof global._picoapiFetch === "function") {
      return global._picoapiFetch;
    }

    // throw if fetch lib wasn't found at all
    throw new Error(
      "Could not find global fetch api, please use polyfill `import 'picoapi/node-polyfill'` at the top of your application"
    );
  }

  // handle browser
  return window.fetch;
}
