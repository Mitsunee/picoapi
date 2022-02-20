export function attachHook(target) {
  return function (hook, callback) {
    target.hooks[hook] = callback;
  };
}
