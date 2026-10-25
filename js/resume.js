// Shows the "Download resume" button only when assets/resume.pdf really exists.
export async function initResume() {
  const btn = document.getElementById("resumeBtn");
  try {
    const r = await fetch(btn.getAttribute("href"), { method: "HEAD" });
    if (r.ok && (r.headers.get("content-type") || "").includes("pdf")) btn.hidden = false;
  } catch (e) { /* no resume yet: button stays hidden */ }
}
