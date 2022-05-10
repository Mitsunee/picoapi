import fetch from "node-fetch";

if (!global.fetch) global._picoapiFetch = fetch;
