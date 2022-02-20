import { RequestInit } from "@types/node-fetch";

// Note: These types are currently untested. If you find any problems or have
//       improvements for typings feel free to open an issue on github.
//
//       I tried to export any interfaces that may be needed to use this library
//       effectively and use Generics where possible to allow as much freedom as
//       possible in regards to return types.

// Prefetch hook types
export interface PrefetchArgs {
  url: string;
}
export type PrefetchHook<TransformedResponse> = (
  args: PrefetchArgs
) => TransformedResponse | void;
type OnPrefetch = (hook: "prefetch", callback: PrefetchHook) => void;

// Error hook types
export interface ErrorArgs {
  status: number;
  statusText: string;
  url: string;
}
export type ErrorHook = (args: ErrorArgs) => void;
type OnError = (hook: "error", callback: ErrorHook) => void;

// Success hook types
export interface SuccessArgs<ApiResponse> {
  url: string;
  data: ApiResponse;
}
export type SuccessHook<ApiResponse, TransformedResponse> = (
  args: SuccessArgs<ApiResponse>
) => TransformedResponse | void;
type OnSuccess<ApiResponse, TransformedResponse> = (
  hook: "success",
  callback: SuccessHook<ApiResponse, TransformedResponse>
) => void;

// Api base type
export interface PicoApi {
  on: OnPrefetch | OnError | OnSuccess;
}

// feel free to use `as PicoRequestInit` if your fetch lib uses different typing
export interface PicoRequestInit extends RequestInit {
  expectJson?: boolean;
}

// use this type to define your methods
export interface PicoRequest<Response> {
  (id?: string | number, init?: PicoRequestInit): Promise<Response>;
}

export function createApi<ApiInterface extends PicoApi>(
  baseUrl: string
): ApiInterface;

/* EXAMPLE:

interface MyApi {
  people: PicoRequest<Person>
}

const myApi = createApi<MyApi>("https://my-api.example.com");
const user = await myApi.people(42);

*/
