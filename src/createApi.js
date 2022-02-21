import { createInternal } from "./util/createInternal.js";
import { attachHook } from "./util/attachHook.js";
import { removeHook } from "./util/removeHook.js";
import { createMethod } from "./util/createMethod.js";

export const createApi = baseUrl => {
  const internal = createInternal(baseUrl);

  return new Proxy(internal, {
    get(target, method) {
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
