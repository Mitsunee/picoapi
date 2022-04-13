import { Internal, ApiMethod } from "./types";

export function createMethod<ApiResponse>(
  target: Internal,
  method: string
): ApiMethod<ApiResponse | string | void> {
  return async function (id = "", { expectJson = false, ...init } = {}) {
    const reqUrl = `${target.baseUrl}/${method}/${id}`;
    let out;

    // handle prefetch hook
    if (target.hooks.prefetch) {
      const res = await target.hooks.prefetch<ApiResponse>({
        url: reqUrl
      });
      if (res) return res;
    }

    // handle request
    // @ts-ignore
    const res = await target.fetch(reqUrl, init);

    // reject on error
    if (!res.ok) {
      const error = {
        statusMessage: res.statusText,
        status: res.status,
        url: reqUrl
      };

      if (target.hooks.error) {
        return target.hooks.error<ApiResponse>(error);
      }

      return Promise.reject(error);
    }

    // handle json data
    const contentTypeHeader = res.headers && res.headers.get("content-type");
    const responseIsJson =
      contentTypeHeader && contentTypeHeader.indexOf("application/json") > -1;
    if (expectJson || responseIsJson) {
      out = (await res.json()) as ApiResponse;
    } else {
      out = (await res.text()) as string;
    }

    // handle success hook
    if (target.hooks.success) {
      const hookRes = await target.hooks.success<ApiResponse>({
        url: reqUrl,
        data: out
      });

      if (hookRes) return hookRes;
    }

    return out;
  };
}
