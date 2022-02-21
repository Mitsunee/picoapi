export function removeHook(target) {
  return function (hook = false) {
    if (!hook) {
      for (const key in target.hooks) {
        target.hooks[key] = undefined;
      }
      return;
    }

    target.hooks[hook] = undefined;
  };
}
