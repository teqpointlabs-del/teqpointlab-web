# Web Module

Two-page responsive static web example.

## Pages
- `index.html` – Hero image, image carousel (accessible), three stacked feature images.
- `gallery.html` – Reuses header + drawer, responsive grid of placeholder images.

## Structure
```
web/
  index.html
  gallery.html
  styles/styles.css
  scripts/slider.js
  scripts/main.js
  assets/images/*.svg
```

## Features
- Accessible carousel with keyboard + swipe + auto-advance (respects reduced motion).
- Mobile-first layout; CSS variables for quick theming.
- Slide dots are ARIA `role=tab` for assistive tech clarity.
- Side drawer navigation with ESC, backdrop click to close.

## Running Locally
Static files only – you can open `index.html` directly in a browser. For proper relative path + future expansion, start a lightweight dev server:

### Python 3
```bash
python3 -m http.server 5173 --directory web
```
Then visit: http://localhost:5173/

### Node (npx http-server)
```bash
npx --yes http-server web -p 5173
```

## Customization Tips
- Replace SVG placeholders in `assets/images` with real content; keep aspect ratios similar for layout stability.
- Adjust auto-play interval in `scripts/slider.js` (search for `setInterval`).
- To disable auto-play entirely, remove or comment that block.

## Next Steps (Optional Enhancements)
- Add build tooling (Vite) + TypeScript for scalable development.
- Introduce linting (`eslint`, `stylelint`) & formatting (`prettier`).
- Add lazy-loading (`loading="lazy"`) to non-critical images.
- Convert drawer to a CSS `dialog` polyfill for improved semantics.

---
Generated scaffold – update as real requirements emerge.
