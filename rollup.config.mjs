import initConfig from "@foxkit/rollup-config/ts.js";
const makeConfig = initConfig();

const config = [
  makeConfig({ input: "src/createApi.ts", key: "." }),
  makeConfig({
    input: "src/node-polyfill.js",
    key: "./node-polyfill",
    ts: false
  })
];

export default config;
