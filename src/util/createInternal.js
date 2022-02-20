import { getFetchLib } from "./fetch.js";

export function createInternal(baseUrl) {
  const internal = new Object();
  internal.hooks = new Object();
  internal.fetch = getFetchLib();
  internal.baseUrl = baseUrl;

  return internal;
}
