# Anandhu Santhosh · Portfolio (cosmic edition)

Static site: HTML, CSS and native ES modules. No framework, no build step, so it deploys to Vercel exactly like the previous version (Framework Preset: **Other**, no build command, no output directory).

```
index.html            page structure
css/                  tokens.css, base.css, sections.css
js/main.js            entry point
js/cosmos.js          WebGL universe (stars, nebula, planet) as one fragment shader
js/sections/orbit.js  project galaxy (orbit map + detail panel)
js/motion.js          optional GSAP/ScrollTrigger heading reveals
scripts/check-links.mjs  checks every project URL (npm run check:links)
js/reveal.js          scroll reveal
js/sections/          nav, hero, projects, skills, education
data/                 projects.js, skills.js, education.js, site.js  <- edit content here
assets/img/           social preview image (generated artwork)
assets/projects/      project screenshots (webp)
favicon.svg
```

## Run locally
ES modules need a server (double-clicking `index.html` will not work). In PowerShell, from this folder:

    python -m http.server 8000
    # or: npm run dev

Open http://localhost:8000. In VS Code, the Live Server extension also works.

## Update content
- Projects: `data/projects.js`. Add a screenshot to `assets/projects/` (webp, about 1600px wide) and reference its name without extension. Add `challenges: ["problem -> solution"]` to show that block in a case study.
- Skills: `data/skills.js`. A skill is highlighted automatically when it appears in a project's `stack`.
- Education: `data/education.js` (check the TODO about the diploma details).
- Status text in the hero: `data/site.js`.
- Resume: drop your PDF at `assets/resume.pdf`. The "Download resume" button in the hero appears automatically only when that file exists (it is hidden until then).
- A project screenshot that is a design preview rather than the running app can carry a label: set `preview: "Intended interface"` on the project.

## Deploy to the existing Vercel URL
1. In your existing portfolio repo, delete the old files and copy this folder's contents into the repo root (so `index.html` is at the root).
2. `git add .`, `git commit -m "Redesign portfolio"`, `git push`.
3. Vercel redeploys the same project automatically; the URL does not change. Check Project Settings > Build and Development: Framework Preset **Other**, Build Command and Output Directory empty. If those are already set to something else, tell me.
4. Social preview: `og:image` is a relative path. After deploy, change it in `index.html` to the full URL, e.g. `https://<your-domain>/assets/img/og.jpg`.

---

## Manglish guide
**Run cheyyan:** PowerShell-il ee folder-il `python -m http.server 8000` adikkuka, browser-il `http://localhost:8000` open cheyyuka. (Double-click cheythal work aavilla, karanam ES modules.)

**Resume add cheyyan:** PDF `assets/resume.pdf` aayi idu. Aa file undenkil mathram hero-yil "Download resume" button varum.

**Content maattan:** `data/` folder-ile files mathram edit cheythal mathi. Puthiya project-inu screenshot `assets/projects/`-il idu, `data/projects.js`-il oru block add cheyyuka.

**Vercel-il update cheyyan:** Pazhaya repo-yile files delete cheythu ee folder-inte contents repo root-il idu. `git add .`, `git commit -m "Redesign"`, `git push`. Vercel thanne redeploy cheyyum, URL maarilla.

## Cosmic background notes
- `js/cosmos.js` is plain WebGL (no Three.js, no build step). It renders at reduced resolution on phones, lowers its own resolution if frames are slow, pauses when the tab is hidden, draws one static frame with `prefers-reduced-motion`, and falls back to a CSS gradient if WebGL or the shader fails.
- Colours live in `css/tokens.css`. The shader colours are in `js/cosmos.js` (search for `vec3(`).
- The orbit map is generated from `data/projects.js`; each project needs an `orb: [light, dark]` colour pair. The project list below the map is the keyboard and screen-reader friendly alternative.

## Camera, GSAP and link checks
- The shader camera follows the page: each section has a keyframe (planet position, size, nebula hue, brightness) in `keys` at the top of `js/cosmos.js`. Edit those numbers to change the mood of a section.
- GSAP 3.12.5 and ScrollTrigger load from cdnjs (`index.html`) and only animate section headings. If the CDN is blocked, the CSS reveals still work. For stricter security, self-host the two files in `assets/vendor/` and change the script paths.
- Before publishing, run `npm run check:links` (PowerShell, from this folder, needs Node 18+). It reports every project URL that does not answer.

## Manglish
**Links check cheyyan:** PowerShell-il ee folder-il `npm run check:links` adikkuka. FAIL varunna link `data/projects.js`-il thiruthuka. **GSAP:** internet illenkilum site work cheyyum, heading animation mathram povum.

## Content to verify before publishing
- Tick Tick, Campus Exchange and Agriculture project URLs, the PixelForge GitHub URL and the LinkedIn URL could not be opened automatically; run `npm run check:links` and open the LinkedIn link yourself.
- Diploma college name/location and all education years (see the comment at the top of `data/education.js`).
- No personal photograph is used anywhere; the social preview image (`assets/img/og.jpg`) is generated artwork.
