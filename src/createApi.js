import { createInternal } from "./util/createInternal.js";
import { attachHook } from "./util/attachHook.js";
import { createMethod } from "./util/createMethod.js";

export const createApi = baseUrl => {
  const internal = createInternal(baseUrl);

  return new Proxy(internal, {
    get(target, method) {
      if (method === "on") {
        return attachHook(target);
      }

      return createMethod(target, method);
    }
  });
};
