import {
  HookErrorCallback,
  HookPrefetchCallback,
  HookSuccessCallback,
  Internal
} from "./types";

interface HookAttacher<T, M> {
  (hook: "prefetch", callback: HookPrefetchCallback<T>): void;
  (hook: "error", callback: HookErrorCallback<T>): void;
  (hook: "success", callback: HookSuccessCallback<T, M>): void;
}

export function attachHook<T, M>(target: Internal): HookAttacher<T, M> {
  return function (hook, callback) {
    target.hooks[hook] = callback as typeof hook extends "success"
      ? HookSuccessCallback<T, M>
      : typeof hook extends "error"
      ? HookErrorCallback<T>
      : HookPrefetchCallback<T>;
  };
}
