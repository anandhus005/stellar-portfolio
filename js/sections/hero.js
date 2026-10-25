import { status } from "../../data/site.js";
import { reduced } from "../reveal.js";

// Rotates the small status line in the hero.
export function initHero() {
  const st = document.getElementById("status");
  if (reduced) return;
  let i = 0;
  setInterval(() => {
    if (document.hidden) return;
    st.classList.add("swap");
    setTimeout(() => { st.textContent = status[++i % status.length]; st.classList.remove("swap"); }, 250);
  }, 3400);
}
