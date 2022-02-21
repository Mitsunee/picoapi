let globalFetchSupport = false;
const globalFetch = global.fetch;

export function beforeHook() {
  if (globalFetch) {
    globalFetchSupport = true;
    console.log("Tested on environment with built-in fetch");
  } else {
    console.log("Tested on environment without built-in fetch");
  }
}

export function cleanupHook() {
  if (globalFetchSupport) {
    global.fetch = globalFetch;
  } else {
    delete global.fetch;
  }
  delete global._picoapiFetch;
  delete global.window;
}

export function isGlobalFetchSupported() {
  return globalFetchSupport;
}
