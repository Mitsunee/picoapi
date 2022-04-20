import {
  HookCallbackError,
  HookCallbackPrefetch,
  HookCallbackSuccess,
  HookAttacher,
  Internal
} from "./types";

export function attachHook(target: Internal): HookAttacher {
  return function (hook, callback) {
    target.hooks[hook] = callback as typeof hook extends "success"
      ? HookCallbackSuccess
      : typeof hook extends "error"
      ? HookCallbackError
      : HookCallbackPrefetch;
  };
}
