import type fetch from "node-fetch";

import type {
  PrefetchHookCallback,
  ErrorHookCallback,
  SuccessHookCallback
} from "./hook";

// Fetch
export type NodeFetch = typeof fetch;
export type Fetch = NodeFetch | typeof global.fetch | typeof window.fetch;

// Internal
export interface Internal {
  hooks: {
    prefetch?: PrefetchHookCallback;
    error?: ErrorHookCallback;
    success?: SuccessHookCallback;
  };
  fetch: Fetch;
  baseUrl: string;
}
