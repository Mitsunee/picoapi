import { readFileSync, rmdirSync, existsSync } from "fs";
import { join } from "path";
import { builtinModules } from "module";
import pluginTypescript from "rollup-plugin-typescript2";
import typescript from "typescript";

// clean dist dir
const distPath = join(process.cwd(), "dist");
if (existsSync(distPath)) {
  rmdirSync(join(process.cwd(), "dist"), { recursive: true, force: true });
}

const pkg = JSON.parse(
  readFileSync(join(process.cwd(), "package.json"), "utf8")
);

const external = [
  ...builtinModules,
  //...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.peerDependencies)
];

const plugins = [
  pluginTypescript({
    exclude: "node_modules/**",
    typescript,
    tsconfig: "tsconfig.json",
    useTsconfigDeclarationsDir: true
  })
];

function makeConfig({ input, key, ts = true }) {
  const output = new Array();

  if (pkg.exports[key].import) {
    output.push({
      file: pkg.exports[key].import,
      format: "esm"
    });
  }

  if (pkg.exports[key].require) {
    output.push({
      file: pkg.exports[key].require,
      format: "cjs"
    });
  }

  const config = { input, output, external };

  if (ts) config.plugins = plugins;

  return config;
}

const config = [
  makeConfig({ input: "src/createApi.ts", key: "." }),
  makeConfig({
    input: "src/node-polyfill.js",
    key: "./node-polyfill",
    ts: false
  })
];

export default config;
