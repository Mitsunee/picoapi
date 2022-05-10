import type {
  ErrorHookCallback,
  PrefetchHookCallback,
  SuccessHookCallback,
  HookAttacher
} from "../types/hook";
import { Internal } from "../types/internal";

export function attachHook(target: Internal): HookAttacher {
  return function (hook, callback) {
    target.hooks[hook] = callback as typeof hook extends "success"
      ? SuccessHookCallback
      : typeof hook extends "error"
      ? ErrorHookCallback
      : PrefetchHookCallback;
  };
}
