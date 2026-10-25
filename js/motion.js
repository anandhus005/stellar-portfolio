// Optional GSAP + ScrollTrigger layer. If the CDN scripts are missing, the CSS reveals in reveal.js are used instead.
import { reduced } from "./reveal.js";

export function initMotion() {
  const { gsap, ScrollTrigger } = window;
  if (reduced || !gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  document.querySelectorAll("main section h2").forEach((h) => {
    const words = h.textContent.trim().split(/\s+/);
    h.setAttribute("aria-label", words.join(" "));
    h.classList.remove("rv");
    h.innerHTML = words.map((w) => `<span class="w" aria-hidden="true"><span>${w}</span></span>`).join(" ");
    gsap.from(h.querySelectorAll(".w > span"), { yPercent: 115, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.07,
      scrollTrigger: { trigger: h, start: "top 88%", once: true } });
  });
}
