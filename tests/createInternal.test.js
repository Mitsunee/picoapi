import { suite } from "uvu";
import { equal } from "uvu/assert";
import { createInternal } from "../src/util/createInternal.js";
import { cleanupHook } from "./fixtures/fetch.js";

const test = suite("createInternal util");
const mockLib = async () => {};

test.before(() => {
  global.fetch = mockLib;
});

test("createInternal", () => {
  const mockUrl = "https://example.com";
  equal(createInternal(mockUrl), {
    hooks: {},
    fetch: mockLib,
    baseUrl: mockUrl
  });
});

test.after(cleanupHook);

test.run();
