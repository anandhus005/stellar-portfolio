export const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
export function initReveal() {
  const els = [...document.querySelectorAll(".rv")];
  if (reduced || !("IntersectionObserver" in window)) return els.forEach((e) => e.classList.add("in"));
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  els.forEach((e) => io.observe(e));
}
