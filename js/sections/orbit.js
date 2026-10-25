import { projects } from "../../data/projects.js";
import { li, links } from "./projects.js";

// Project galaxy: each project is a body on one of three orbit rings. Buttons are real focusable controls;
// the full project list below the map is the accessible alternative.
const rings = [[24, 70, 1], [36, 95, -1], [48, 120, 1]]; // radius %, seconds per turn, direction
export function initOrbit() {
  const box = document.getElementById("orbit"), cap = document.getElementById("cap");
  box.insertAdjacentHTML("beforeend", rings.map(([r, dur, dir], ri) => {
    const bodies = projects.slice(ri * 2, ri * 2 + 2).map((p, k) => {
      const a = (k * 180 + ri * 55 + 20) * Math.PI / 180;
      return `<span class="pos" style="left:${50 + 50 * Math.cos(a)}%;top:${50 + 50 * Math.sin(a)}%"><button type="button" class="body" data-id="${p.id}" data-sum="${p.summary}" aria-label="${p.title}: open project" aria-pressed="false" style="--c1:${p.orb[0]};--c2:${p.orb[1]}"><i></i><span>${p.title}</span></button></span>`;
    }).join("");
    return `<div class="ring" style="--r:${r * 2}%;--dur:${dur}s;--dir:${dir > 0 ? "normal" : "reverse"};--odir:${dir > 0 ? "reverse" : "normal"}">${bodies}</div>`;
  }).join(""));
  const show = (b) => { cap.textContent = b ? `${b.getAttribute("aria-label").split(":")[0]}: ${b.dataset.sum}` : "Hover to pause the orbit. Select a world for details."; };
  box.addEventListener("pointerover", (e) => { const b = e.target.closest(".body"); if (b) show(b); });
  box.addEventListener("focusin", (e) => show(e.target.closest(".body")));
  const panel = document.getElementById("panel"); let openId = null, openBtn = null;
  const close = (refocus) => {
    panel.classList.remove("on"); box.querySelectorAll(".body").forEach((b) => b.setAttribute("aria-pressed", "false"));
    if (refocus && openBtn) openBtn.focus(); openId = null;
    // let the fade-out finish before removing the panel from the layout
    setTimeout(() => { if (!openId) panel.hidden = true; }, matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 400);
  };
  const open = (p, btn) => {
    const m = p.images[0], rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    panel.innerHTML = `<img src="assets/projects/${m.src}-800.webp" alt="${m.alt}" width="800" height="450" style="object-position:center ${m.pos || "center"}">
      <div class="pi"><p class="kind">${p.kind}</p><h3 tabindex="-1">${p.title}</h3><p>${p.summary}</p><ul class="tags">${li(p.stack)}</ul>${links(p)}
      <div class="pa"><button type="button" class="btn solid sm" data-act="case">Open full case study</button><button type="button" class="btn ghost glass sm" data-act="close">Close</button></div></div>`;
    panel.hidden = false; panel.classList.remove("on"); void panel.offsetWidth; panel.classList.add("on");
    box.querySelectorAll(".body").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    openId = p.id; openBtn = btn; panel.querySelector("h3").focus({ preventScroll: true });
    panel.scrollIntoView({ behavior: rm ? "auto" : "smooth", block: "nearest" });
  };
  box.addEventListener("click", (e) => { const b = e.target.closest(".body"); if (!b) return; openId === b.dataset.id ? close(false) : open(projects.find((x) => x.id === b.dataset.id), b); });
  panel.addEventListener("click", (e) => {
    const act = e.target.closest("[data-act]")?.dataset.act; if (!act) return;
    if (act === "close") return close(true);
    const art = document.getElementById(openId); art.querySelector("details")?.setAttribute("open", "");
    art.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && openId) close(true); });
}
