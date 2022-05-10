import type { Internal } from "../types/internal";
import { ApiMethod } from "../types/method";

export function createMethod(target: Internal, method: string): ApiMethod<any> {
  return async function (id = "", { expectJson = false, ...init } = {}) {
    let url = `${target.baseUrl}/${method}/${id}`;
    let out;

    // handle prefetch hook
    if (target.hooks.prefetch) {
      const hookRes = await target.hooks.prefetch({ url, method, id });
      if (hookRes && Object.keys(hookRes).includes("data")) return hookRes.data;
      if (hookRes?.url) url = hookRes.url;
    }

    // handle request
    // @ts-ignore
    const res = await target.fetch(url, init);

    // reject on error
    if (!res.ok) {
      const error = {
        statusMessage: res.statusText,
        status: res.status,
        url,
        method,
        id
      };

      if (target.hooks.error) {
        const hookRes = await target.hooks.error(error);
        if (hookRes && Object.keys(hookRes).includes("data")) return hookRes.data;
        if (hookRes?.error) return Promise.reject(hookRes?.error);
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
        url,
        method,
        id,
        data: out
      });

      if (hookRes) return hookRes.data;
    }

    return out;
  };
}
