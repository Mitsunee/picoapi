// Fetch
import fetch, { RequestInit as NodeFetchInit } from "node-fetch";
export type NodeFetch = typeof fetch;
export type Fetch = NodeFetch | typeof global.fetch | typeof window.fetch;

// Hooks
export type HookName = "prefetch" | "error" | "success";

// BUG: these generics are not useable
export type HookCallbackPrefetch = <T>(req: { url: string }) => void | T;
export type HookCallbackError = <T>(req: {
  url: string;
  status: number;
  statusMessage: string;
}) => void | T;
export type HookCallbackSuccess = <T>(req: {
  url: string;
  data: T | string;
}) => void | T;

export interface HookAttacher {
  (hook: "prefetch", callback: HookCallbackPrefetch): void;
  (hook: "error", callback: HookCallbackError): void;
  (hook: "success", callback: HookCallbackSuccess): void;
}

export interface HookRemover {
  (hook?: HookName): void;
}

// Methods
// eslint-disable-next-line no-undef
interface MethodInit extends RequestInit {
  expectJson?: boolean;
}
interface MethodInitNodeFetch extends NodeFetchInit {
  expectJson?: boolean;
}
export type ApiMethodInit = MethodInit | MethodInitNodeFetch;
export interface ApiMethod<ApiResponse> {
  (arg?: string, init?: ApiMethodInit): Promise<ApiResponse>;
}

// Internal
export interface Internal {
  hooks: {
    prefetch?: HookCallbackPrefetch;
    error?: HookCallbackError;
    success?: HookCallbackSuccess;
  };
  fetch: Fetch;
  baseUrl: string;
}
