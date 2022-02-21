import { suite } from "uvu";
import * as assert from "uvu/assert";
import { fetch, baseUrl } from "./mock/fetchLib.js";
import { createMethod } from "../src/util/createMethod.js";

const test = suite("createMethod util");

test("createMethod", async () => {
  const mockInternal = {
    hooks: {},
    fetch,
    baseUrl
  };

  // create the method
  const method = createMethod(mockInternal, "text");
  assert.type(method, "function");

  // test the method
  const res = await method();
  assert.is(res, "Hello, world!");
});

test.run();
