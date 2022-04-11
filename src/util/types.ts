
// Fetch
import fetch from "node-fetch";
export type Fetch = typeof fetch | typeof global.fetch | typeof window.fetch;
export type NodeFetch = typeof fetch;

// Hook Callbacks
export interface HookPrefetchCallback<ModifiedResponse> {
    (req: { url: string }): void | ModifiedResponse;
}

export interface HookErrorCallback<ModifiedResponse> {
    (req: { url: string, status: number, statusMessage: string }): void | ModifiedResponse
}

export interface HookSuccessCallback<ApiResponse, ModifiedResponse> {
    (req: { url: string, data: ApiResponse}): void | ApiResponse | ModifiedResponse
}

// Hooks
export type HookName = "prefetch" | "error" | "success";

// Internal Object
export interface Internal {
    baseUrl: string;
    fetch: Fetch;
    hooks: { 
      "prefetch"?: HookPrefetchCallback<any>,
      "error"?: HookErrorCallback<any>,
      "success"?: HookSuccessCallback<any,any>
    }
  }
