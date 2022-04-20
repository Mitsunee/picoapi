import { suite } from "uvu";
import { is, type } from "uvu/assert";
import { attachHook } from "../src/util/attachHook.ts";

const test = suite("attachHook util");

test("attachHook", () => {
  const mockTarget = new Object();
  mockTarget.hooks = new Object();
  const mockCallback = () => {};

  // create attacher
  const fn = attachHook(mockTarget);
  type(fn, "function", "returns a function");

  // use attacher to attach mockCallback
  fn("test-hook", mockCallback);
  is(
    mockTarget.hooks["test-hook"],
    mockCallback,
    "the function sets callback on object"
  );
});

test.run();
