import { suite } from "uvu";
import { is, throws } from "uvu/assert";
import { getFetchLib } from "../src/util/fetch.js";
import {
  beforeHook,
  cleanupHook,
  isGlobalFetchSupported
} from "./fixtures/fetch.js";

const test = suite("getFetchLib util");

test.before(beforeHook);

test("getFetchLib with global.fetch", () => {
  if (!isGlobalFetchSupported()) {
    throws(() => getFetchLib());
    global.fetch = async () => {}; // mock a global fetch for test below
  }

  is(getFetchLib(), global.fetch);
});

test("getFetchLib with polyfill", () => {
  if (isGlobalFetchSupported()) {
    delete global.fetch;
  }

  const mockLib = async () => {};
  global._picoapiFetch = mockLib;
  is(getFetchLib(), mockLib);
});

test("getFetchLib in browser", () => {
  const mockLib = async () => {};
  global.window = { fetch: mockLib };
  is(getFetchLib(), mockLib);
});

test.after.each(cleanupHook);

test.run();
