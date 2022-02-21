import { Response, Headers } from "node-fetch";

/* use the following routes:
https://mock.lib/json/ - Returns a application/json response: { value: "hello world" }
https://mock.lib/json/$val - Returns a application/json response: { value: $val }
https://mock.lib/text/ - Returns a text response: Hello, world!
https://mock.lib/text/$val - Returns a text response: Hello, $val!
https://mock.lib/bad/ - Returns an error 500

any other url should resolve with a status 400

inits (second argument) are not currently supported
*/

export const baseUrl = "https://mock.lib";

const headersJson = new Headers();
headersJson.append("Content-Type", "application/json");

const headersText = new Headers();
headersText.append("Content-Type", "text/plain");

export function fetch(url) {
  return new Promise(resolve => {
    let tmp;

    if (url.startsWith("https://mock.lib/json/")) {
      let value = "hello world";
      if ((tmp = url.substring(22))) value = tmp;
      return resolve(
        new Response(JSON.stringify({ value }), {
          status: 200,
          headers: headersJson
        })
      );
    }

    if (url.startsWith("https://mock.lib/text/")) {
      let value = "world";
      if ((tmp = url.substring(22))) value = tmp;
      return resolve(
        new Response(`Hello, ${value}!`, {
          status: 200,
          headers: headersText
        })
      );
    }

    if (url === "https://mock.lib/bad/") {
      return resolve(new Response("", { status: 500 }));
    }

    return resolve(new Response("", { status: 400 }));
  });
}
