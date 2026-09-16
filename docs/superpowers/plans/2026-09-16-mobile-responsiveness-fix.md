# Mobile Responsiveness Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix two mobile-layout bugs in the Invoice Template Studio — a critical one where real settings content is silently clipped with no scroll access on ordinary phone viewports, and a minor one where the invoice preview's auto-fit zoom doesn't engage exactly at the 768px breakpoint.

**Architecture:** Both fixes are surgical, isolated changes to existing components — no new components, no new dependencies. Bug 1 adds a missing flex height constraint (`flex-1 overflow-hidden`) to one wrapper `<div>`, mirroring a sibling wrapper that already has it. Bug 2 replaces a `window.innerWidth` proxy check with a direct measurement of the actual preview container's width via a ref, so the auto-fit logic responds to the real available space instead of a hardcoded breakpoint guess.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript 5.7 strict, Tailwind CSS 3, Jotai 2.20.3, Vitest + React Testing Library (jsdom).

## Global Constraints

- No `any`, `@ts-ignore`, `as unknown as` anywhere.
- No new dependencies — do not add anything to `package.json`. Manual browser verification uses Playwright as an ad-hoc, throwaway tool outside the repo (see Task 3), never installed into the project.
- Comments explain "why," not "what."
- `pnpm typecheck && pnpm lint && pnpm test && pnpm build` must all stay clean after every task.
- jsdom (this project's test environment) does not load the compiled Tailwind stylesheet, so `getComputedStyle(...).paddingLeft/paddingRight` always resolve to `"0px"` in tests regardless of the element's actual `p-4`/`md:p-8` classes. Task 2's test expectations are computed accounting for this — do not be surprised the padding subtraction is a no-op under test.

---

### Task 1: Bound the settings pane's height on mobile so it can actually scroll

**Files:**
- Modify: `components/studio/StudioBody.tsx:31`
- Test: `components/studio/StudioBody.test.tsx` (new)

**Interfaces:**
- Consumes: nothing new — `StudioBody` already imports `mobileViewAtom` from `@/lib/atoms/ui` and renders `SettingsWorkspace`/`PreviewCanvas`.
- Produces: nothing new — this is a pure CSS-class fix on an existing element, no new exports.

**Context:** `StudioBody.tsx`'s root is `flex flex-1 flex-col overflow-hidden md:flex-row` (line 19). Its two direct children below the mobile toggle bar are the settings-pane wrapper (line 31) and the preview-pane wrapper (line 36). The preview wrapper already has `flex-1 overflow-hidden`, which bounds its height so `PreviewCanvas`'s own internal `overflow-auto` pane can actually scroll. The settings wrapper does not have this, so `SettingsPanel`'s existing `overflow-y-auto` (`components/studio/SettingsPanel.tsx:10`) never gets a height ceiling — the pane just grows to its content's natural height, which on the Content/Layout tabs exceeds a normal phone viewport, and the excess gets silently clipped by `StudioBody`'s own `overflow-hidden` root with no scrollbar anywhere in the chain.

- [ ] **Step 1: Write the failing test**

Create `components/studio/StudioBody.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StudioBody } from './StudioBody';

describe('StudioBody', () => {
  it('bounds the settings pane to a scrollable height, matching the preview pane', () => {
    render(<StudioBody />);

    const tablist = screen.getByRole('tablist', { name: 'Settings sections' });
    // DOM chain: SectionRail (role=tablist) -> Tabs.Root (SettingsWorkspace) ->
    // StudioBody's settings-pane wrapper div (the element under test).
    const settingsWrapper = tablist.parentElement?.parentElement;

    expect(settingsWrapper).toHaveClass('flex-1');
    expect(settingsWrapper).toHaveClass('overflow-hidden');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run components/studio/StudioBody.test.tsx`
Expected: FAIL — `settingsWrapper` has classes `flex md:flex` (or `hidden md:flex`), missing both `flex-1` and `overflow-hidden`.

- [ ] **Step 3: Write the minimal fix**

In `components/studio/StudioBody.tsx`, change line 31 from:

```tsx
      <div className={mobileView === 'preview' ? 'hidden md:flex' : 'flex md:flex'}>
        <SettingsWorkspace />
      </div>
```

to:

```tsx
      <div
        className={`flex-1 overflow-hidden ${mobileView === 'preview' ? 'hidden md:flex' : 'flex md:flex'}`}
      >
        <SettingsWorkspace />
      </div>
```

This exactly mirrors the preview wrapper's own pattern two lines below it (`flex-1 overflow-hidden` prefix + the same conditional visibility suffix).

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run components/studio/StudioBody.test.tsx`
Expected: PASS

- [ ] **Step 5: Run the full test suite to confirm no regression**

Run: `pnpm test`
Expected: all existing tests still pass (this change only adds classes to an element visibility-toggled by breakpoint/state that already existed — it does not change what's rendered or when).

- [ ] **Step 6: Commit**

```bash
git add components/studio/StudioBody.tsx components/studio/StudioBody.test.tsx
git commit -m "fix: bound the settings pane's height so it can scroll on mobile"
```

---

### Task 2: Fit the preview zoom to the real container width, not a window-width guess

**Files:**
- Modify: `components/studio/PreviewCanvas.tsx`
- Test: `components/studio/PreviewCanvas.test.tsx` (new)

**Interfaces:**
- Consumes: `zoomAtom` from `@/lib/atoms/ui` (unchanged, plain `atom<number>(1)`), `clampZoom`/`ZOOM_STEP` from `./CanvasToolbar` (unchanged).
- Produces: nothing new is exported — `computeFitZoom` changes its signature (now takes `availableWidth: number` instead of reading `window.innerWidth` internally) but stays a private, unexported function local to this file; no other file imports it today (verify with `grep -rn "computeFitZoom" --include="*.tsx" --include="*.ts" .` before starting — if this turns up an import elsewhere, stop and report NEEDS_CONTEXT instead of proceeding).

**Context:** The current auto-fit effect only recomputes when `window.innerWidth < 768` (`components/studio/PreviewCanvas.tsx:42`), but the two-column desktop layout (`StudioBody.tsx:19`'s `md:flex-row`) already activates AT 768px — so exactly at that width, and at any other width where the preview column ends up narrower than the paper's 794px design width for reasons unrelated to the overall window size, the zoom never auto-fits and `InvoicePaper.module.css`'s `max-width: 100%` shrinks the paper's real layout box instead (causing label text to wrap onto two lines instead of a clean scaled-down miniature). The fix measures the preview's own scrollable container (the div wrapping `<InvoicePaper />`) directly via a ref, and only overrides the zoom when that container is genuinely narrower than the paper — never when it's wide enough, so a desktop user's manual zoom-in is never reset by an unrelated window resize.

- [ ] **Step 1: Write the failing tests**

Create `components/studio/PreviewCanvas.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { PreviewCanvas } from './PreviewCanvas';

function stubClientWidth(width: number) {
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    value: width,
  });
}

describe('PreviewCanvas auto-fit zoom', () => {
  afterEach(() => {
    // Restore jsdom's default so this stub doesn't leak into later test files.
    stubClientWidth(0);
  });

  it('shrinks the zoom to fit when the container is narrower than the paper', () => {
    stubClientWidth(390);
    render(<PreviewCanvas />);

    expect(screen.getByText('49%')).toBeInTheDocument();
  });

  it('leaves the zoom at 100% when the container is wide enough for the paper', () => {
    stubClientWidth(1200);
    render(<PreviewCanvas />);

    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});
```

The expected `49%`/`100%` values come from `computeFitZoom`'s math running against a stubbed `clientWidth` with padding resolving to `0px` under jsdom (see Global Constraints): `390 / 794 ≈ 0.49` → `49%`; `1200 / 794 ≈ 1.51`, clamped to `1` → `100%`.

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run components/studio/PreviewCanvas.test.tsx`
Expected: FAIL — current code reads `window.innerWidth` (jsdom default `1024`), not the stubbed `clientWidth`, so neither case produces the expected percentage.

- [ ] **Step 3: Write the fix**

Replace the full contents of `components/studio/PreviewCanvas.tsx` with:

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { useSetAtom } from 'jotai';
import { InvoicePaper } from '@/components/invoice/InvoicePaper';
import { zoomAtom } from '@/lib/atoms/ui';
import printStyles from '@/styles/print.module.css';
import { CanvasToolbar, clampZoom, ZOOM_STEP } from './CanvasToolbar';

const PAPER_WIDTH_PX = 794;
const MIN_AUTO_FIT_ZOOM = 0.3;

function computeFitZoom(availableWidth: number): number {
  const fitted = Math.round((availableWidth / PAPER_WIDTH_PX) * 100) / 100;
  return Math.max(MIN_AUTO_FIT_ZOOM, Math.min(1, fitted));
}

export function PreviewCanvas() {
  const setZoom = useSetAtom(zoomAtom);
  const paperContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!(event.metaKey || event.ctrlKey)) return;
      if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        setZoom((current) => clampZoom(current + ZOOM_STEP));
      } else if (event.key === '-') {
        event.preventDefault();
        setZoom((current) => clampZoom(current - ZOOM_STEP));
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setZoom]);

  // UI-SPEC "Адаптив": подгоняем зум под реальную доступную ширину контейнера
  // превью, а не под ширину окна — в двухколоночном layout колонка превью может
  // быть уже 794px бумаги на любой ширине окна, не только "мобильной".
  useEffect(() => {
    function fitToContainerWidth() {
      const container = paperContainerRef.current;
      if (!container) return;
      const style = getComputedStyle(container);
      const paddingLeft = parseFloat(style.paddingLeft);
      const paddingRight = parseFloat(style.paddingRight);
      const available = container.clientWidth - paddingLeft - paddingRight;
      const fitZoom = computeFitZoom(available);
      // Не трогаем зум, если бумага и так помещается (fitZoom === 1) — иначе
      // ресайз окна на широком экране сбрасывал бы ручной зум пользователя.
      if (fitZoom < 1) {
        setZoom(fitZoom);
      }
    }
    fitToContainerWidth();
    window.addEventListener('resize', fitToContainerWidth);
    return () => window.removeEventListener('resize', fitToContainerWidth);
  }, [setZoom]);

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <div
        ref={paperContainerRef}
        className={`flex flex-1 items-start justify-center overflow-auto p-4 md:p-8 ${printStyles.printSurface}`}
      >
        <InvoicePaper />
      </div>
      <CanvasToolbar />
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run components/studio/PreviewCanvas.test.tsx`
Expected: PASS

- [ ] **Step 5: Run the full test suite to confirm no regression**

Run: `pnpm test`
Expected: all existing tests still pass. Pay particular attention to any existing test that renders `PreviewCanvas` (directly or via `StudioBody`/`TemplateStudio`) without stubbing `clientWidth` — jsdom's default `clientWidth` is `0`, so `computeFitZoom(0 - 0 - 0)` = `computeFitZoom(0)` = `Math.max(0.3, Math.min(1, 0))` = `0.3`, meaning `fitZoom < 1` is true and `setZoom(0.3)` WILL fire on every mount in every test that doesn't stub `clientWidth`. If any existing test asserts a specific zoom percentage (e.g. expects `100%` from `CanvasToolbar`) without stubbing `clientWidth` first, it will now fail — if you hit this, add the same `stubClientWidth` helper (or a shared version of it) to that test file rather than changing the fix, since a `0`-width jsdom container is not a real bug, just a test-environment artifact. Search first: `grep -rln "PreviewCanvas\|CanvasToolbar" --include="*.test.tsx" components/`.

- [ ] **Step 6: Commit**

```bash
git add components/studio/PreviewCanvas.tsx components/studio/PreviewCanvas.test.tsx
git commit -m "fix: fit preview zoom to the real container width, not window width"
```

---

### Task 3: Manual real-browser verification

**Files:** none modified — this task produces evidence only, written to the task's report file.

**Interfaces:** none — this task drives the already-fixed app from Tasks 1-2 through a real headless browser, it doesn't touch source.

**Context:** jsdom cannot compute real CSS layout (no real `scrollHeight`/`clientWidth`), so Tasks 1 and 2's unit tests are structural/mocked proxies for the real bugs. This task closes the loop with the same kind of real-browser check used in this project's Definition of Done for layout work (`pnpm dev` + manual check at 1440/1024/768/390px, per `CLAUDE.md`), using a throwaway Playwright install — never added to this project's `package.json` or `node_modules`.

- [ ] **Step 1: Start the dev server**

```bash
cd <repo-root>
lsof -ti:3000 -sTCP:LISTEN | xargs -r kill
pnpm dev > /tmp/its-dev-server.log 2>&1 &
disown
timeout 40 bash -c 'until curl -sf http://localhost:3000 >/dev/null; do sleep 1; done' && echo "SERVER UP"
```

- [ ] **Step 2: Set up a throwaway Playwright install (outside the repo)**

```bash
SCRATCH=$(mktemp -d)
cd "$SCRATCH"
npm init -y > /dev/null 2>&1
npm install playwright@1.63.0 --no-save 2>&1 | tail -5
npx playwright install chromium 2>&1 | tail -5
mkdir shots
```

- [ ] **Step 3: Screenshot Bug 1's scenario (Content tab, standard phone viewport) and confirm nothing is clipped**

Write and run `"$SCRATCH/verify.js"`:

```js
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();

  // Bug 1: Content tab at a completely standard phone size.
  const page1 = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  await page1.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page1.waitForTimeout(400);
  await page1.locator('[aria-label="Content"]').first().click();
  await page1.waitForTimeout(300);
  const overflow1 = await page1.evaluate(() => {
    const el = document.querySelector('.flex.flex-1.flex-col.overflow-hidden.md\\:flex-row');
    return el ? { scrollHeight: el.scrollHeight, clientHeight: el.clientHeight } : null;
  });
  console.log('StudioBody root overflow (should be ~0, was 545 before the fix):', JSON.stringify(overflow1));
  await page1.screenshot({ path: `${process.env.SHOTS}/bug1-content-tab-390x844.png`, fullPage: true });

  // Bug 2: exactly 768px width, default General tab.
  const page2 = await (await browser.newContext({ viewport: { width: 768, height: 900 } })).newPage();
  await page2.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page2.waitForTimeout(400);
  await page2.screenshot({ path: `${process.env.SHOTS}/bug2-768px.png`, fullPage: true });

  await browser.close();
})();
```

```bash
SHOTS="$SCRATCH/shots" node "$SCRATCH/verify.js"
```

- [ ] **Step 4: Inspect the results**

Read both screenshots. Confirm:
- `bug1-content-tab-390x844.png`: the Content tab's full field list (down through Terms/Statement) is visible, and the logged `scrollHeight`/`clientHeight` overflow is near `0` (a few px of rounding is fine — anything close to the pre-fix `545` is a failure).
- `bug2-768px.png`: paper labels ("Invoice number", "Date of Issue", etc.) render on a single line each, not wrapped onto two lines.

- [ ] **Step 5: Stop the dev server and record evidence**

```bash
lsof -ti:3000 -sTCP:LISTEN | xargs -r kill
rm -rf "$SCRATCH"
```

Write the task report including: the overflow numbers before/after (from Task 1/2's own manual testing plus this script's output), and a description of what both screenshots show. No commit for this task — it produces no file changes.

---

## Self-Review Notes

- **Spec coverage:** Bug 1 (spec section "Баг 1") → Task 1. Bug 2 (spec section "Баг 2") → Task 2. Testing section's manual-verification requirement → Task 3. Spec's "Что не входит" exclusions (no Playwright as a dependency, no other unrelated adaptive issues, no persistent manual-zoom state) are respected — Task 3 explicitly uses a throwaway install outside the repo, and no task touches `package.json`.
- **Placeholder scan:** none — every step has complete, real code, verified interactively against the actual current source and an actual test run (the DOM-nesting traversal in Task 1 and the `clientWidth` stubbing technique in Task 2 were both probed against the real codebase before being written into this plan, not assumed).
- **Type consistency:** `computeFitZoom`'s new signature (`(availableWidth: number) => number`) is used consistently within Task 2 — no other task or file references it. `paperContainerRef`/`useRef<HTMLDivElement>` matches the `<div>` it's attached to.
- **Dependency ordering:** Tasks 1 and 2 touch disjoint files and have no interface dependency on each other — either could run first. Task 3 depends on both being complete (it verifies the fixed behavior of each).
