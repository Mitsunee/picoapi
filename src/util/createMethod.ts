import { Internal, ApiMethod } from "./types";

export function createMethod(target: Internal, method: string): ApiMethod<any> {
  return async function (id = "", { expectJson = false, ...init } = {}) {
    const reqUrl = `${target.baseUrl}/${method}/${id}`;
    let out;

    // handle prefetch hook
    if (target.hooks.prefetch) {
      const res = await target.hooks.prefetch({
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
        return target.hooks.error(error);
      }

      return Promise.reject(error);
    }

    // handle json data
    const contentTypeHeader = res.headers && res.headers.get("content-type");
    const responseIsJson =
      contentTypeHeader && contentTypeHeader.indexOf("application/json") > -1;
    if (expectJson || responseIsJson) {
      out = (await res.json()) as any;
    } else {
      out = (await res.text()) as string;
    }

    // handle success hook
    if (target.hooks.success) {
      const hookRes = await target.hooks.success({
        url: reqUrl,
        data: out
      });

      if (hookRes) return hookRes;
    }

    return out;
  };
}
