import type { HookName } from "../types/hook";
import { Internal } from "../types/internal";

export function removeHook(target: Internal) {
  return function (hook?: HookName) {
    if (!hook) {
      for (const key in target.hooks) {
        target.hooks[key as HookName] = undefined;
      }
      return;
    }

    target.hooks[hook] = undefined;
  };
}
