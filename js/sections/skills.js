import { skills } from "../../data/skills.js";
import { projects } from "../../data/projects.js";

// A skill is highlighted only when it appears in a project's stack, so the emphasis is verifiable.
const used = {};
projects.forEach((p) => p.stack.forEach((s) => (used[s.toLowerCase()] ||= []).push(p.title)));

export function renderSkills() {
  document.getElementById("skillGrid").innerHTML = skills.map((g, gi) => `<div class="sg rv${g.learning ? " learn" : ""}"><h3>${g.name}</h3><ul>${g.items.map((s, i) => {
    const u = used[s.toLowerCase()];
    return `<li class="${u ? "used" : ""}" style="--d:${(gi * 2 + i) * 40}ms"${u ? ` title="Used in: ${u.join(", ")}"` : ""}>${s}</li>`;
  }).join("")}</ul></div>`).join("");
}
