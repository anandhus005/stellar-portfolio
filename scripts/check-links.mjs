// Usage: npm run check:links  (needs Node 18+ and internet). Checks every project URL in data/projects.js.
import { projects } from "../data/projects.js";
const urls = [...new Set(projects.flatMap((p) => [p.live, p.github]).filter(Boolean))];
let bad = 0;
for (const u of urls) {
  try { const r = await fetch(u, { method: "HEAD", redirect: "follow" }); console.log(r.ok ? "OK   " : "FAIL ", r.status, u); if (!r.ok) bad++; }
  catch (e) { console.log("FAIL ", e.cause?.code || e.message, u); bad++; }
}
process.exit(bad ? 1 : 0);
