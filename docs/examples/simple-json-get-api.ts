import "picoapi/node-polyfill";
import { createApi, PicoApi, ApiMethod } from "picoapi";

interface Servant {
  id: number;
  name: string;
  className: string;
}
interface Quest {
  id: number;
  name: string;
  flag: string;
}

interface AtlasApi extends PicoApi {
  servant: ApiMethod<Servant>;
  quest: ApiMethod<Quest>;
}

const atlasNa = createApi<AtlasApi>("https://api.atlasacademy.io/nice/NA");

async function main(): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const Suzuka = await atlasNa.servant("165");
  const { name, className } = Suzuka;
  console.log(`The className of "${name}" is "${className}"`);
}

main();
