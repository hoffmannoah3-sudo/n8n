document.addEventListener("DOMContentLoaded", () => {
  const hueInput = document.getElementById("hue");
  const satInput = document.getElementById("sat");
  const lightInput = document.getElementById("light");
  const hVal = document.getElementById("hVal");
  const sVal = document.getElementById("sVal");
  const lVal = document.getElementById("lVal");

  const swatch = document.getElementById("swatch");
  const hslText = document.getElementById("hslText");
  const hexText = document.getElementById("hexText");
  const copyHexBtn = document.getElementById("copyHex");
  const contrastWhite = document.getElementById("contrastWhite");
  const contrastBlack = document.getElementById("contrastBlack");

  function hslToRgb(h, s, l) {
    const sNorm = s / 100;
    const lNorm = l / 100;
    const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
    const hp = h / 60;
    const x = c * (1 - Math.abs((hp % 2) - 1));
    let r1 = 0, g1 = 0, b1 = 0;
    if (hp >= 0 && hp < 1) { r1 = c; g1 = x; }
    else if (hp >= 1 && hp < 2) { r1 = x; g1 = c; }
    else if (hp >= 2 && hp < 3) { g1 = c; b1 = x; }
    else if (hp >= 3 && hp < 4) { g1 = x; b1 = c; }
    else if (hp >= 4 && hp < 5) { r1 = x; b1 = c; }
    else if (hp >= 5 && hp <= 6) { r1 = c; b1 = x; }
    const m = lNorm - c / 2;
    const r = Math.round((r1 + m) * 255);
    const g = Math.round((g1 + m) * 255);
    const b = Math.round((b1 + m) * 255);
    return { r, g, b };
  }

  function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("");
  }

  function relativeLuminance(r, g, b) {
    function channel(c) {
      const cs = c / 255;
      return cs <= 0.03928 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4);
    }
    const R = channel(r);
    const G = channel(g);
    const B = channel(b);
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  }

  function contrastRatio(rgb1, rgb2) {
    const L1 = relativeLuminance(rgb1.r, rgb1.g, rgb1.b);
    const L2 = relativeLuminance(rgb2.r, rgb2.g, rgb2.b);
    const lighter = Math.max(L1, L2);
    const darker = Math.min(L1, L2);
    return ((lighter + 0.05) / (darker + 0.05)).toFixed(2);
  }

  function update() {
    const h = Number(hueInput.value);
    const s = Number(satInput.value);
    const l = Number(lightInput.value);
    hVal.textContent = `${h}°`;
    sVal.textContent = `${s}%`;
    lVal.textContent = `${l}%`;
    const { r, g, b } = hslToRgb(h, s, l);
    const hex = rgbToHex(r, g, b);
    const hslString = `hsl(${h}, ${s}%, ${l}%)`;
    swatch.style.background = hslString;
    hslText.textContent = hslString;
    hexText.textContent = hex;

    const white = { r: 255, g: 255, b: 255 };
    const black = { r: 11, g: 11, b: 15 };
    contrastWhite.textContent = `Contrast on white: ${contrastRatio({ r, g, b }, white)}:1`;
    contrastBlack.textContent = `Contrast on dark: ${contrastRatio({ r, g, b }, black)}:1`;
  }

  hueInput.addEventListener("input", update);
  satInput.addEventListener("input", update);
  lightInput.addEventListener("input", update);

  copyHexBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(hexText.textContent);
      const previous = copyHexBtn.textContent;
      copyHexBtn.textContent = "Copied!";
      setTimeout(() => { copyHexBtn.textContent = previous; }, 900);
    } catch (e) {
      console.error("Clipboard error", e);
    }
  });

  function createShadeCard(name, h, s, l) {
    const { r, g, b } = hslToRgb(h, s, l);
    const hex = rgbToHex(r, g, b);
    const card = document.createElement("div");
    card.className = "shade-card";
    const sw = document.createElement("div");
    sw.className = "shade-swatch";
    sw.style.background = `hsl(${h}, ${s}%, ${l}%)`;
    const meta = document.createElement("div");
    meta.className = "shade-meta";
    const title = document.createElement("div");
    title.className = "shade-name";
    title.textContent = name;
    const code = document.createElement("div");
    code.className = "shade-hex";
    code.textContent = hex;
    meta.appendChild(title);
    meta.appendChild(code);
    card.appendChild(sw);
    card.appendChild(meta);
    return card;
  }

  function renderShades() {
    const shades = [
      { name: "Lavender", h: 265, s: 35, l: 78 },
      { name: "Lilac", h: 275, s: 45, l: 72 },
      { name: "Amethyst", h: 270, s: 45, l: 55 },
      { name: "Violet", h: 275, s: 60, l: 50 },
      { name: "Orchid", h: 290, s: 47, l: 58 },
      { name: "Plum", h: 290, s: 38, l: 35 },
      { name: "Grape", h: 275, s: 55, l: 32 },
      { name: "Royal", h: 265, s: 65, l: 40 }
    ];
    const grid = document.getElementById("shadesGrid");
    grid.innerHTML = "";
    for (const s of shades) {
      grid.appendChild(createShadeCard(s.name, s.h, s.s, s.l));
    }
  }

  renderShades();
  update();
});

