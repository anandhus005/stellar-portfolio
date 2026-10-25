import { projects } from "../../data/projects.js";

const img = (n, s = "") => `assets/projects/${n}${s}.webp`;
const srcset = (n) => `${img(n, "-800")} 800w, ${img(n)} 1600w`;
export const li = (a) => a.map((x) => `<li>${x}</li>`).join("");
export const links = (p) => !p.live && !p.github ? "" : `<div class="plinks">${p.live ? `<a href="${p.live}" target="_blank" rel="noopener">Live demo <span aria-hidden="true">↗</span></a>` : ""}${p.github ? `<a href="${p.github}" target="_blank" rel="noopener">GitHub <span aria-hidden="true">↗</span></a>` : ""}</div>`;
const caseStudy = (p) => `<details class="case"><summary>Case study</summary><div class="cs">
  <div><h4>Purpose</h4><p>${p.purpose}</p></div>
  <div><h4>Key features</h4><ul>${li(p.features)}</ul></div>
  <div><h4>Stack</h4><p>${p.stack.join(", ")}</p></div>
  ${p.decisions ? `<div><h4>Implementation notes</h4><ul>${li(p.decisions)}</ul></div>` : ""}
  ${p.challenges ? `<div><h4>Challenges and solutions</h4><ul>${li(p.challenges)}</ul></div>` : ""}</div></details>`;
const pic = (m, sz) => `<img src="${img(m.src)}" srcset="${srcset(m.src)}" sizes="${sz}" alt="${m.alt}" loading="lazy" width="1600" height="900" style="object-position:center ${m.pos || "center"}">`;

function featured(p, i) {
  const thumbs = p.images.length > 1 ? `<div class="thumbs" role="group" aria-label="${p.title} screenshots">${p.images.map((m, k) =>
    `<button type="button" class="${k ? "" : "on"}" data-src="${m.src}" data-alt="${m.alt}" data-pos="${m.pos || "center"}" aria-label="Show screenshot ${k + 1}"><img src="${img(m.src, "-thumb")}" alt="" loading="lazy" width="320" height="180"></button>`).join("")}</div>` : "";
  return `<article class="feat rv" id="${p.id}"><div class="media"><div class="frame"><i></i><i></i><i></i>${pic(p.images[0], "(max-width:1000px) 100vw, 56vw")}</div>${thumbs}</div>
  <div class="info"><p class="kind">${p.kind}</p><h3>${p.title}</h3><p class="sum">${p.summary}</p><ul class="tags">${li(p.stack)}</ul>${links(p)}${caseStudy(p)}</div></article>`;
}
const card = (p) => `<article class="card rv" id="${p.id}"><div class="frame small"><i></i><i></i><i></i>${pic(p.images[0], "(max-width:620px) 100vw, (max-width:1000px) 50vw, 30vw")}${p.preview ? `<span class="badge">${p.preview}</span>` : ""}</div>
  <p class="kind">${p.kind}</p><h3>${p.title}</h3><p class="sum">${p.summary}</p><ul class="tags">${li(p.stack)}</ul>${links(p)}${caseStudy(p)}</article>`;

export function renderProjects() {
  document.getElementById("featured").innerHTML = projects.filter((p) => p.featured).map(featured).join("");
  document.getElementById("more").innerHTML = projects.filter((p) => !p.featured).map(card).join("");
  document.getElementById("featured").addEventListener("click", (e) => {
    const b = e.target.closest(".thumbs button"); if (!b) return;
    const main = b.closest(".media").querySelector(".frame img");
    main.src = img(b.dataset.src); main.srcset = srcset(b.dataset.src); main.alt = b.dataset.alt; main.style.objectPosition = "center " + b.dataset.pos;
    b.parentElement.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
  });
}
