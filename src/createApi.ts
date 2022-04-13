import { createInternal } from "./util/createInternal";
import { attachHook } from "./util/attachHook";
import { removeHook } from "./util/removeHook";
import { createMethod } from "./util/createMethod";
import type { HookRemover, HookAttacher, ApiMethod } from "./util/types";

export { ApiMethod };
export interface PicoApi {
  on: HookAttacher;
  unbind: HookRemover;
  [key: string]: typeof key extends "on"
    ? HookAttacher
    : typeof key extends "unbind"
    ? HookRemover
    : ApiMethod<any>;
}

export function createApi<Api extends PicoApi>(baseUrl: string): Api {
  const internal = createInternal(baseUrl);
  const on = (() => attachHook(internal))();
  const unbind = (() => removeHook(internal))();
  const api: PicoApi = { on, unbind };

  return new Proxy(api, {
    get(target: PicoApi, method: string) {
      switch (method) {
        case "on":
        case "unbind":
          return target[method];
        default:
          return createMethod(internal, method);
      }
    }
  }) as Api;
}
