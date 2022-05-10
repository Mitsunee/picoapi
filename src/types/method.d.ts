import { RequestInit as NodeFetchInit } from "node-fetch";

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
