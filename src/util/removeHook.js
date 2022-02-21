export function removeHook(target) {
  return function (hook) {
    target.hooks[hook] = undefined;
  };
}
