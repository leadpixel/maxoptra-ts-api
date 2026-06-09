import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const pkgPath = join(process.cwd(), "package.json");
const denoPath = join(process.cwd(), "deno.json");

const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
const deno = JSON.parse(readFileSync(denoPath, "utf-8"));

deno.version = pkg.version;

writeFileSync(denoPath, `${JSON.stringify(deno, null, "\t")}\n`);
console.log(`✅ Synchronised deno.json version to ${pkg.version}`);
