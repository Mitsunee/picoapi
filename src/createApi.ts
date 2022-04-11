import { createInternal } from "./util/createInternal";
import { attachHook } from "./util/attachHook";
import { removeHook } from "./util/removeHook";
import { createMethod } from "./util/createMethod";

export const createApi = (baseUrl: string) => {
  const internal = createInternal(baseUrl);

  return new Proxy(internal, {
    get(target, method: string) {
      switch (method) {
        case "on":
          return attachHook(target);
        case "unbind":
          return removeHook(target);
        default:
          return createMethod(target, method);
      }
    }
  });
};
