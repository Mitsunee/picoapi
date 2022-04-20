import { suite } from "uvu";
import * as assert from "uvu/assert";
import { removeHook } from "../src/util/removeHook.ts";

const test = suite("removeHook util");

test("removeHook", () => {
  const mockTarget = new Object();
  mockTarget.hooks = new Object();
  const mockCallback = () => {};
  mockTarget.hooks["success"] = mockCallback;
  mockTarget.hooks["error"] = mockCallback;
  mockTarget.hooks["prefetch"] = mockCallback;

  // create remover
  const fn = removeHook(mockTarget);
  assert.type(fn, "function", "returns a function");

  // use remover to undefine success hook
  fn("success");
  assert.not(
    mockTarget.hooks["success"],
    "the function removed callback on object"
  );
  assert.is(
    mockTarget.hooks["error"],
    mockCallback,
    "the function did not remove other callbacks"
  );
  assert.is(
    mockTarget.hooks["prefetch"],
    mockCallback,
    "the function did not remove other callbacks"
  );

  // use remover to remove all callbacks
  fn();
  for (const key in mockTarget.hooks) {
    assert.not(mockTarget.hooks[key], `${key} is now undefined`);
  }
  assert.is(Object.keys(mockTarget.hooks).length, 3, "keys are still there");
});

test.run();
