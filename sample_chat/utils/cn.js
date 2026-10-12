// cn: class-name composer. Joins truthy values + resolves Tailwind conflicts via tailwind-merge.
// Uses a tiny truthy filter so we don't pull in clsx.
import { twMerge } from "tailwind-merge";

function truthy(...inputs) {
  const out = [];
  for (const i of inputs) {
    if (!i) continue;
    if (typeof i === "string" || typeof i === "number") {
      out.push(i);
    } else if (Array.isArray(i)) {
      const nested = truthy(...i);
      if (nested) out.push(nested);
    } else if (typeof i === "object") {
      for (const k of Object.keys(i)) if (i[k]) out.push(k);
    }
  }
  return out.join(" ");
}

export default function cn(...inputs) {
  return twMerge(truthy(...inputs));
}
