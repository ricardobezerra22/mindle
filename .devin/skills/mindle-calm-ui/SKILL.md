---
name: mindle-calm-ui
description: Turn a visual mockup (HTML or Figma export, "design reference" README) into production Nuxt/Vue code in the Mindle repo. Use for auth or onboarding screens, animated hero sections, split layouts, page transitions, and for adding a new opt-in color palette or typography theme (like Classic vs Contrastful). Enforces tokens, i18n, accessibility, reduced motion and per-user theme preferences.
---

# Mindle calm UI

Implements mockups the way the login, register, forgot-password and welcome screens were built.

## Reference implementations (read before starting)

- `app/layouts/auth.vue`: split dark hero + light card, shared form styles through `.card :deep(...)`, page transition classes
- `app/pages/auth/login.vue`, `register.vue`, `forgot-password.vue`
- `app/pages/auth/welcome.vue`: 2-step mobile onboarding, `layout: false`, gated by `app/middleware/onboarding.ts`
- `app/components/auth/`: `Logo`, `Backdrop`, `Field`, `Button`, `GoogleButton`
- `app/assets/css/main.css`: `.auth-theme` tokens, `.auth-theme.palette-classic`, `[data-palette="contrastful"]`
- `app/composables/usePalette.ts`, `usePreferences.ts`, palette selector in `app/pages/settings.vue`

## Design language (what makes it "calm")

The look is a calm, high-contrast space for people with ADHD: one idea per screen, one primary action, slow ambient motion, short reassuring copy. Reproduce these specifics; do not improvise new ones.

### Color roles (Contrastful values)

| Role | Value | Use |
|---|---|---|
| Canvas | `#10201C` | dark ambient background (auth, onboarding) |
| Card | `#F7FAF8` | the one light surface where the task happens |
| Ink / muted | `#14251F` / `#4F625A` | text on light |
| Line / line hover | `#D2E0D8` / `#A8C4B5` | 2px field and ghost-button borders |
| Soft / light / pale | `#EAF3EE` / `#F4F7F4` / `#B5CCC1` | text on dark (body, headline, secondary) |
| Mint | `#A8D5BA` | emphasis text and orbit dots on dark |
| Green / green dark | `#2F6B52` / `#265A45` | primary button, links, focus ring fill on light |
| Sand | `#F4A261` (hover `#F7B07A`) | the single attention accent: dots, CTA on dark, focus ring on light |
| Error | `#B91C1C` on `#FEF2F2`, border `#FECACA` | validation and alerts |

Rules: one accent per screen (sand). Green is for actions on light surfaces, mint for emphasis on dark. Never use mint as a button fill under white text.

### Typography (Lexend 300/400/500/600; Classic uses Inter)

- Headline: `clamp(34px, 5.2vw, 58px)`, 600, line-height 1.08, letter-spacing -0.025em. Two lines: neutral first line, accent-colored second line (`display: block`).
- Hero body: 18px, weight 300, line-height 1.65, max-width 440px.
- Card title 26px/600/-0.02em; subtitle 16px muted; field label 15px/500; input 16px; main button 17px/600; small notes 14px.
- Mobile onboarding: title 38px (step 1) or 32px (step 2); body 17px/300.

### Shape, spacing, elevation

- Fields, ghost and main buttons: height 56px, radius 16px, 2px border. Onboarding CTA: height 60px, radius 20px. Card radius 32px, padding 40px (28px on mobile). Logo tile `rx 28` on a 96 viewBox. Pills inside illustrations use radius 28.
- Gaps: 8px label to field, 20px between fields, 28px hero blocks, 56px between hero and card on desktop.
- Shadows: card `0 30px 80px rgba(0,0,0,.38)`; primary button `0 8px 20px` of green at 28%; sand CTA `0 12px 28px rgba(244,162,97,.28)`.
- Hover lifts 1px (`translateY(-1px)`), press drops 1px. Focus ring is 3px sand with 3px offset on light, and `#EAF3EE` on dark.

### Motion

- Ambient and slow: gradient blobs drift 24-38s alternating; the orb "breathes" over 8s; ripples 8s with a 4s offset; motes rise over 13-18s; hero phrases rotate over 12s in 4s steps.
- Entrances: `rise` (fade + 14px up, 0.9s) staggered at 0.5s, 0.8s and 1.1s. SVG strokes draw on (`pathLength=1`, `stroke-dashoffset`). Page changes: 0.2s out, 0.45s in.
- One focal animation at a time, only `transform` and `opacity`, nothing flashing or fast. Always provide the reduced-motion fallback with a sensible static state.

### Layout patterns

- **Desktop auth:** dark canvas, hero left (logo, headline, body, rotating phrase, breathing illustration), light card right, wraps below 760px with the illustration hidden.
- **Mobile onboarding:** full-height dark screen (max-width 430px, centered), logo top, illustration, copy, then the CTA pinned to the bottom with `margin-top: auto`, step dots (8px, active 28px sand) and a text escape link.
- **Illustration rule:** one illustration per screen that teaches the product idea (breathing circle = calm, big task splitting into steps = how Mindle works). Captions rotate in sync with the animation.

### Voice

Short, warm, no urgency, no exclamation chains. Examples: "Uma coisa de cada vez.", "Sem pressa. Seu ritmo é o certo.", "Seu progresso fica salvo. Nada se perde." Write pt-BR first, then a natural English version, not a literal translation.

## When to use

- The user supplies a mockup folder (HTML, README saying "design reference") and asks to update or create pages.
- A new screen needs animated illustration, hero, or onboarding steps.
- A new color palette or font must be offered without changing existing users' look.

## Workflow

1. **Mockup is a reference, not code.** Read the HTML and README. Extract exact values (colors, sizes, spacing, radii, shadows, breakpoints, keyframes) from inline styles and the `<style>` block. Never copy the mockup runtime (React, `support.js`) or inline styles wholesale.
2. **Inventory current behavior first.** List every feature of the page being replaced (validation, status-code error mapping, remember-me, Google sign-in, loading states, redirects). Nothing may be lost. Report bugs found (for example a missing `ref`) instead of working around them silently.
3. **Tokens first.** New values become CSS custom properties on a theme class or attribute. Components read `var(--token)` only. Hard-coded colors are allowed only for status colors and SVG artwork.
4. **Extract components after 2 repeats** (field, button, logo, backdrop) into `app/components/{feature}/`.
5. **Share page styles through the layout.** Put form, alert, link, divider styles in the layout under a wrapper class with `:deep()`, so pages don't duplicate CSS.
6. **Animate with CSS only** (transform and opacity). Every animation must be disabled under `prefers-reduced-motion: reduce`.
7. **Mobile-first.** Use the mockup breakpoints in `@media`. Hide purely decorative scenes on small screens.
8. **i18n for every string**, both locales, pt-BR as source.
9. **Verify** (see Verification) and state what could not be checked visually.

## Tokens

Scope new values; never overwrite global tokens for everyone.

```css
.auth-theme {
  --auth-font: "Lexend", system-ui, sans-serif;
  --auth-bg: #10201c;
  --auth-card: #f7faf8;
  --auth-ink: #14251f;
  --auth-green: #2f6b52;
  --auth-card-shadow: 0 30px 80px rgba(0, 0, 0, 0.38);
}

.auth-theme.palette-classic {
  --auth-font: var(--font-body);
  --auth-bg: color-mix(in srgb, var(--color-background) 94%, var(--color-primary) 6%);
  --auth-green: var(--color-primary-dark);
}
```

Derive shadows and rings from tokens: `color-mix(in srgb, var(--auth-green) 18%, transparent)`.

## Component conventions

```vue
<script setup lang="ts">
interface Props {
  id: string;
  label: string;
  modelValue: string;
  error?: string;
}
withDefaults(defineProps<Props>(), { error: "" });
const emit = defineEmits<{ "update:modelValue": [value: string]; "blur": [] }>();
</script>
```

- `<style scoped>`, no comments, `<button>` or `<a>` for interactive elements.
- Field: label tied by `for`/`id`, `aria-invalid`, `aria-describedby` to an error with `role="alert"`, optional password toggle with i18n `aria-label`.

## Page transitions

On each page:

```ts
definePageMeta({
  layout: "auth",
  pageTransition: { name: "auth-page", mode: "out-in" },
});
```

Define `.auth-page-enter-active/leave-active/enter-from/leave-to` in the layout via `.card :deep(...)`. Enter: fade + `translateY(14px)` over 0.45s. Leave: fade + `translateY(-8px)` over 0.2s. Set `transition: none` under reduced motion. Pages need a single root element.

## Accessibility checklist

- Semantic HTML, visible `:focus-visible` outlines.
- Decorative SVG: `aria-hidden`. Meaningful SVG illustration: `role="img"` plus i18n `aria-label`. For non-SVG elements use visually hidden text (`.sr-only`) instead of `role="img"`.
- WCAG AA contrast. White text on `#6faf8e` fails; use the darker primary for buttons and links.
- Keyboard order matches visual order; touch targets at least 44px.

## i18n pitfalls

- Keys in `i18n/locales/pt.json` and `en.json`; code identifiers stay English.
- A literal `@` must be written `{'@'}`. `&#64;` is not decoded.
- Avoid `|`, `{`, `}` in message text.
- Arrays and objects: `tm(key)` returns compiled messages; map each through `rt()`.

## Unstylable third-party widgets (Google Identity button)

Render a styled visual layer, then overlay the real widget at `opacity: 0.01`, sized to the container (width up to 400px, scale vertically if taller). Style hover and focus on the wrapper with `:hover` and `:focus-within`. See `components/auth/GoogleButton.vue`.

## Opt-in theme variants (palette, typography)

Never change the default look for existing users.

1. Add an optional field to `UserPreferences` in `prisma/schema.prisma` (for example `palette String?`) and run `pnpm exec prisma generate`. Treat `null` as the old default.
2. Server: GET returns the old default when null and creates new records with the new default. PUT validates against an allowlist.
3. Client: add to the `Preferences` interface in `usePreferences.ts`; initialise from a cookie so SSR renders the right variant without a flash.
4. `usePalette()` (called in `app.vue`) writes the cookie and sets `data-palette` on `<html>` through `useHead`. Load web fonts only when that variant is active.
5. Variant tokens live in `main.css` under `[data-palette="name"]`, with a `[data-theme="dark"]` combination. Body font goes through `--font-body`.
6. Expose a selector in Settings, Appearance, with i18n labels.
7. Note remaining hard-coded colors that will not follow the variant.

## Onboarding or first-run screens

- Gate with a cookie (`useCookie`, one year). Make the gate client-only (`import.meta.server` return) and viewport-aware if it is mobile-only.
- Always include an "I already have an account" link to login.
- Set the cookie when the user leaves the flow, not when it loads.

## Applying the language to a new screen

1. **Classify the surface.**
   - Pre-login or first-run: dark canvas + one light card, as in `layouts/auth.vue`.
   - Mobile story or onboarding: full-height dark screen with a bottom CTA, as in `pages/auth/welcome.vue`.
   - Inside the app (dashboard, tasks, settings): do not use the dark hero. Use the global tokens (`--color-*`, `--font-body`) so the screen follows the active palette.
2. **Map the mockup to roles**, not hexes: canvas, card, ink, muted, line, accent, primary. If a mockup color has no role, ask whether it is a new role before adding it.
3. **Reuse before building**: `AuthField`, `AuthButton`, `AuthGoogleButton`, `AuthLogo`, `AuthBackdrop`, the layout's `:deep` form styles. If a non-auth screen needs them, move the component out of `components/auth/` into `components/ui/` first.
4. **Keep the one-action rule.** Exactly one primary action per screen, secondary actions as text links, and an escape route (back or "already have an account").
5. **Copy and i18n**: write the headline as neutral line + accent line, keep sentences short, add both locales.

## Rebranding (new palette, font or shape)

Change tokens, not components.

1. Palette: edit the role table values in `main.css` (`.auth-theme`, and `[data-palette="..."]` for the app). Keep role names stable.
2. Typography: change `--font-body` and `--auth-font`, then adjust only the type scale if the new font's width requires it. Load the font only when its variant is active.
3. Shape: radii (16/20/32) and control heights (56/60) are the shape language; change them together, and keep touch targets at least 44px.
4. Accent: keep a single accent role; update the focus-ring and CTA shadow derivations (they use `color-mix` from tokens).
5. Re-check contrast for every role pair (ink on card, muted on card, pale on canvas, white on green, accent on canvas) against WCAG AA.
6. Keep the old variant selectable (see Opt-in theme variants) and test both, light and dark.
7. Grep for hard-coded old brand hexes (`#6faf8e`, `#4e8a6d`, `#2f6b52`) and move them to tokens or list them as known leftovers.

## Verification

- `pnpm exec eslint --fix <touched files>`. Never run `--fix` on whole directories.
- `pnpm run typecheck`, filtered to touched files. State clearly which errors already existed.
- `curl` each route for 200 and grep the SSR HTML for expected text and `data-palette`.
- Check both locales, reduced motion, keyboard flow, and mobile plus desktop widths.
- Say plainly what was not verified visually.

## Common mistakes

- Copying mockup inline styles instead of tokens.
- Forgetting the English locale or the reduced-motion rule.
- Using `tm()` output directly in templates.
- Dropping an existing feature while restyling.
- Changing global tokens and altering the look for everyone.
- Committing or pushing without being asked.

## Project rules to restate

No SCSS, no extra UI libraries, no `any`, no code comments, no `<div>` for interactive elements. Server routes use `sendSuccess` / `sendError` and `serverT`. Nuxt auto-imports apply. Do not commit or push unless the user asks.
