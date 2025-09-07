# Purple — a tiny static site about the color purple

Explore purple: science, history, culture, psychology, curated shades, and an interactive Purple Lab.

## Quick start

- Open `index.html` directly in your browser, or serve locally:

```bash
cd /workspace/purple-site
python3 -m http.server 8000
# visit http://localhost:8000
```

## Structure

- `index.html` — content and sections
- `styles.css` — purple‑themed responsive styles
- `script.js` — interactive Purple Lab and shades gallery
- `assets/` — favicon and decorative gradients

## Accessibility

The Lab displays contrast ratios on light and dark backgrounds. Aim for WCAG AA (≥ 4.5:1 for body text).

## Customize

- Tweak base hues in `:root` within `styles.css`
- Adjust the curated shade list in `script.js` (`renderShades()`)

