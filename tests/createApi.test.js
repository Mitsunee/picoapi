import { suite } from "uvu";
import * as assert from "uvu/assert";
import { fetch, baseUrl } from "./mock/fetchLib.js";
import { cleanupHook } from "./fixtures/fetch.js";
import { createApi } from "../src/createApi.ts";

let api;
const test = suite("createApi");

test.before(() => {
  global.fetch = fetch;
  api = createApi(baseUrl);
});

test("test without hooks", async () => {
  assert.equal(await api.json(), { value: "hello world" });
  assert.equal(await api.json("1"), { value: "1" });
  assert.is(await api.text(), "Hello, world!");
  assert.is(await api.text("user"), "Hello, user!");
});

test("test with expectJson", async () => {
  // where supported
  assert.equal(
    await api.json("", { expectJson: true }),
    { value: "hello world" },
    "works where supported"
  );

  // where unsupported (non-json response)
  try {
    await api.text("", { expectJson: true });
    assert.unreachable("Did not throw on unsupported text-response");
  } catch (err) {
    assert.instance(err, SyntaxError, "threw syntax error");
    assert.match(
      err.message,
      /Unexpected token . in JSON/,
      "threw Unexpected token JSON error"
    );
  }
});

test("prefetch hook", async () => {
  api.on("prefetch", ({ url }) => {
    if (url.includes("prefetch.test"))
      return { data: { value: "test successful" } };
  });

  // hook catches
  assert.equal(
    await api.json("prefetch.test"),
    { value: "test successful" },
    "got response from hook instead of fetch"
  );

  // hook doesn't catch when not intended
  assert.not.equal(
    await api.json(),
    { value: "test successful" },
    "got regular response when hook not intended"
  );
});

test("error hook", async () => {
  api.on("error", ({ status }) => {
    return {
      data: status === 400 ? "Bad Request in Test" : "Server Error in Test"
    };
  });

  assert.is(
    await api.bad(),
    "Server Error in Test",
    "expect server error response"
  );
  assert.is(
    await api.unknown(),
    "Bad Request in Test",
    "expect bad request response"
  );
});

test("success hook", async () => {
  api.on("success", ({ data, url }) => {
    if (url.includes("/text/")) {
      return { data: data.replace("Hello", "Goodbye") };
    }
  });

  // got transformed response when intended
  assert.is(await api.text("tester"), "Goodbye, tester!");

  // got regular response where not intended
  assert.equal(await api.json("tester"), { value: "tester" });
});

test.after.each(() => {
  api.unbind(); // unbind all hooks
});

test.after(cleanupHook);

test.run();
