import { getFetchLib } from "./fetch";
import type { Internal } from "./types";

export function createInternal(baseUrl: string): Internal {
  const internal: Internal = {
    hooks: new Object(),
    fetch: getFetchLib(),
    baseUrl
  };

  return internal;
}
