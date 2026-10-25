import { education } from "../../data/education.js";
import { reduced } from "../reveal.js";

export function renderEducation() {
  const tl = document.getElementById("timeline");
  tl.innerHTML = `<span class="rail"><i id="fill"></i></span>` + education.map((e) =>
    `<li class="rv${e.current ? " current" : ""}"><span class="mk"></span><p class="yr">${e.years}</p><h3>${e.title}</h3><p class="pl">${e.place}</p></li>`).join("");
  const fill = document.getElementById("fill");
  const upd = () => {
    const r = tl.getBoundingClientRect();
    fill.style.transform = `scaleY(${reduced ? 1 : Math.min(1, Math.max(0, (innerHeight * 0.65 - r.top) / r.height))})`;
  };
  addEventListener("scroll", upd, { passive: true }); addEventListener("resize", upd); upd();
}
