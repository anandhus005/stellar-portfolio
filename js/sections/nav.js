export function initNav() {
  const nav = document.getElementById("nav"), btn = document.getElementById("menuBtn");
  const links = [...nav.querySelectorAll(".links a")];
  const set = (o) => { nav.classList.toggle("open", o); btn.setAttribute("aria-expanded", o); };
  btn.addEventListener("click", () => set(!nav.classList.contains("open")));
  links.forEach((a) => a.addEventListener("click", () => set(false)));
  addEventListener("keydown", (e) => e.key === "Escape" && set(false));
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) links.forEach((a) => a.classList.toggle("active", a.hash === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  links.forEach((a) => { const s = document.querySelector(a.hash); if (s) io.observe(s); });
}
