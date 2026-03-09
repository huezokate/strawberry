# Strawberry Solitaire — Redesign Brief for Claude Code

## Overview
Full visual overhaul of `StrawberrySolitaire.jsx` using custom illustrated assets. Game logic stays the same. UI is completely replaced with new illustrated components. Two bug fixes required.

---

## Asset Files
Copy all images into `/public/assets/` first.

| File | Usage |
|------|-------|
| `screen_header.png` | Top of screen — farm panorama with barn, windmill, trees, blue sky |
| `background-feild.png` | Card grid background — cracked orange soil with pebbles |
| `card_cover.png` | Face-down card — wooden frame with "Happy Strawberry Farm" text |
| `strawberry.png` | Revealed card — laughing strawberry character (transparent bg) |
| `bug.png` | Revealed card — cute green caterpillar with question mark (transparent bg) |
| `weed.png` | Revealed card — mean spiky weed plant (transparent bg) |
| `drop.png` | Revealed card — blue water drop character / Rain Boost (transparent bg) |
| `screen_footer.png` | Bottom decorative bar — grassy meadow with flowers and tree stumps |

---

## Layout Structure
Reference: `phone_screen_layput.png`

Single vertical column, full viewport height, NO scroll. Max width 430px centered.

```
┌─────────────────────────────┐
│      screen_header.png      │  18vh — full width, object-fit: cover, top-aligned
├─────────────────────────────┤
│       message bar           │  6vh — text only, dark semi-transparent bg
├─────────────────────────────┤
│                             │
│   card grid — 4 cols×5 rows │  58vh — background-feild.png as bg
│   cards fill the area       │
│                             │
├─────────────────────────────┤
│      screen_footer.png      │  18vh — decorative bg, stats + button overlaid on top
└─────────────────────────────┘
```

iPad (max-width 768px): same layout, scales up proportionally.

---

## Card Design

Card size: fills grid cell with ~8px gap. `border-radius: 16px`. No extra border needed.

### Face-down card
- `background-image: url('/assets/card_cover.png')`
- `background-size: cover`, `background-position: center`

### Face-up card
- Background: `#c8843a` (warm soil)
- Character image centered, `object-fit: contain`, padding 10%
- `box-shadow: 0 4px 12px rgba(0,0,0,0.35)`

### Card states
- **Selected**: `box-shadow: 0 0 0 3px #f5c842, 0 0 16px rgba(245,200,66,0.6)`
- **Matched**: `opacity: 0.15`, pointer-events none
- **Shake**: CSS keyframe shake animation 400ms (wrong match)
- **Sparkle**: scale-up + brightness flash 600ms (correct match)

### Character → asset mapping
```
strawberry  → /assets/strawberry.png
golden      → /assets/strawberry.png  + small ⭐ badge in corner
bug         → /assets/bug.png
weed        → /assets/weed.png
rain        → /assets/drop.png
```

---

## Footer Overlay

`screen_footer.png` is background only. Overlay these on top:

### Stats row (centered, ~30% from top of footer)
```
🌾 {harvested}    💰 {coins}    🃏 {flipsLeft}
HARVESTED         COINS         FLIPS LEFT
```
- Value: `font-family: 'Fredoka One'`, `font-size: 20px`, color `#f5c842`
- Label: `font-family: 'Nunito'`, `font-size: 10px`, color `#c8a87a`, letter-spacing 1px

### End Harvest button (~65% from top of footer, centered)
- Width: 70% of container
- `border-radius: 30px`
- `background: linear-gradient(135deg, #c84a1a, #8b2f0a)`
- `border: 2px solid #e86030`
- Text: `🌾 End Harvest`, `font-family: 'Fredoka One'`, `font-size: 16px`, color `#f5e6c8`

---

## Message Bar
- `background: rgba(0,0,0,0.4)`, `backdrop-filter: blur(4px)`
- Default text color: `#f5e6c8`, `font-family: 'Nunito'`, `font-size: 14px`, centered
- Idle state shows: `✨ Happy Strawberry Farm Solitaire ✨` in `#f5c842`, `font-family: 'Fredoka One'`
- Rain boost active: append `☔ 2x Active!` in `#7ec8e3`

---

## Bug Fix 1 — Match Locking (CRITICAL)

**Problem:** Non-matching cards flip back instantly, making intentional re-matching impossible.

**Fix:** Add `locked` state. Block clicks during flip-back window.

```js
const [locked, setLocked] = useState(false);

// Top of flipCard() — add locked to the guard:
if (locked || !card || card.flipped || card.matched || flipsLeft <= 0) return;

// In the no-match branch, replace immediate flip-back with:
setLocked(true);
setMessage("❌ No match! Look carefully...");
setTimeout(() => {
  setDeck(d => d.map(c =>
    (c.uid === uid || c.uid === selected.uid) ? { ...c, flipped: false } : c
  ));
  setLocked(false);
}, 900);
```

---

## Bug Fix 2 — Flip Counter

Remove the `setFlipsLeft(f => f + 1)` refund on wrong match. Every flip costs 1, no refunds.

---

## Sell & Shop Phases

Keep all existing logic. Visual update:
- Use `screen_header.png` as section background (cover, top-aligned)
- Overlay panel: `background: rgba(15, 8, 3, 0.78)`, `backdrop-filter: blur(10px)`, `border-radius: 16px`
- All buttons: same pill style as End Harvest button

---

## Typography

Add to `index.html` `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
```

- Headings, stats, buttons → `Fredoka One`
- Body, descriptions, messages → `Nunito`

---

## Do Not Change
- Card generation logic (`generateDeck`)
- Scoring values
- Upgrade system (shovel, scarecrow, greenhouse)
- Round/phase flow (FARM → SELL → SHOP → FARM)
- Coin accumulation
