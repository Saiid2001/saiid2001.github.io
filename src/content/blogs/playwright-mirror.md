---
title: "Playwright Mirror"
date: "2026-07-09"
slug: "playwright-mirror"
tags: ["tools"]
summary: "Introducing Playwright Mirror, a tool to mirror browser interactions across independent playwright contexts. This tool is useful for testing and debugging when action concurrency is needed."
cover: "/images/blogs/playwright-mirror/playwright-mirror-example.png"
---

In this post, I introduce [Playwright Mirror](https://github.com/Saiid2001/playwright-mirror), an open-source tool that allows you to mirror browser interactions across independent Playwright contexts. This tool is particularly useful for testing and debugging scenarios where action concurrency is required. 

# Backstory

As part of [my research project](/papers/vsf2025saiid.pdf) on detecting access control vulnerabilities in live web applications, I needed a way to trigger the same APIs from two browser contexts each logged in as a different user. I realized that Playwright already provides a mechanism to record user actions such as clicks, typing, and navigation to be used in their test-suite building features known as [Codegen](https://playwright.dev/docs/codegen-intro). However, I wanted to take it a step further and mirror these actions across two independent browser contexts. This led me to develop a primitive version of Playwright Mirror that involved modifying the playwright source code to intercept the recorded actions and use a web-socket server to send them to a second browser context. 

Essentially, by mirroring actions, I could group pairs of requests from two different users and swap parameters appearing in the requests to test whether the application would give access to a user who should not have access. This approach was ideal because I did not need to have prior knowledge of the object identifiers within the applications I was testing a priori. 

<!-- image with caption -->
![Playwright Mirror Example](/images/blogs/playwright-mirror/image15.gif)
*First version of Playwright Mirror in action on Google Finance. The left browser context is logged in as a user with access to the stock information, while the right browser context is logged in as a user without access. The tool mirrors the actions of the left context to the right context, allowing for testing of access control vulnerabilities.*


While this approach worked for the purposes of the project, it was too brittle to be published as a standalone tool. Specifically, it required a forked version of playwright and also had issues with starting the web-socket server and coordinating the two browser contexts. Seeing the public interest in the tool, I decided to rewrite it from scratch and make it more robust and user-friendly. The new version of Playwright Mirror is now available as an open-source project [on GitHub](https://github.com/Saiid2001/playwright-mirror).

# What needed to be mirrored?

The temptation, when you first sit down to write a mirror, is to record *everything*: every DOM event, every navigation, every network request. It seems safer. Surely more information can't hurt. In practice it's exactly the opposite. The browser produces a torrent of events for a single click: `mousedown`, `mouseup`, `click`, `focus`, sometimes `change`, sometimes `submit`. Replay all of them on the follower and the follower's own browser *also* derives its own copy of the same effects on top. Now you have a double-clicked button, a form submitted twice, or a checkbox that toggled to the wrong state.

The rule that fell out of this turned out to be short: **mirror causes, not effects.** A "cause" is a primary user input: the thing a human physically did with the mouse or keyboard. An "effect" is anything the browser or the page's JavaScript derives from that cause. The follower's browser will happily derive its own effects the moment we replay the cause, running the real page handlers with real `preventDefault` and validation semantics. Everything a real browser normally does for a user, it does for the follower for free.

Concretely, the observer only forwards five kinds of event:

- Trusted left `click`, deferred one microtask so the site's `preventDefault` has run before we decide whether to emit.
- Trusted `input` on `<input>`/`<textarea>`, restricted to text entry (checkbox `input` events are derived from `click`).
- Trusted `change` on `<select>`, the earliest signal an option pick emits.
- Trusted `keydown` for `Enter` inside a text field, relayed as `keyboard.press('Enter')` so the follower's browser natively decides whether to submit.
- Debounced `scroll` position; not strictly a cause, but useful so the follower's viewport tracks what the leader is looking at.

Everything else (`submit`, `change` on radios and checkboxes, `focus`/`blur`, JS-synthesised `!isTrusted` events) is dropped on the floor. And one whole class of interaction is dropped on purpose: **navigation is never mirrored.** The entire point of the tool is that leader and follower are logged into *different* accounts. When the leader clicks an `<a href="/orders/123?token=leader">`, the follower's browser needs to click *its own* link with *its own* token; force-navigating it to the leader's URL would leak per-account state and defeat the very isolation the setup depends on.

# Unexpected Pitfall: Robust Element Selectors

The first version of Playwright Mirror captured a CSS selector for the clicked element on the leader and replayed it on the follower. This is the default choice ([Codegen does it](https://playwright.dev/docs/codegen), CDP-replay tools do it, most record-and-replay systems do it), and in a same-session setup it works fine. In a *differential-testing* setup it falls apart almost immediately.

Consider an orders list. The leader's session sees `<a id="order-a3f9-user-42" href="/orders/a3f9?token=…">`; the follower's session, logged in as a different user, sees `<a id="order-77b1-user-108" href="/orders/77b1?token=…">`. The two IDs are structurally similar but literally different, precisely because they encode per-user state. A CSS selector generated from the leader's DOM (`#order-a3f9-user-42`) has zero chance of matching anything on the follower. Worse, the exact DOM differences a differential-testing rig is *designed to expose* (different order lists, different button availability, different visibility of admin controls) are the same differences that break structural selectors. CDP coordinate replay fails the same way at the pixel level: any layout drift between the two accounts and the follower clicks empty space.

The fix is to shift what the observer records from *implementation* to *intent*. Both users' order pages contain a `<button>` labelled "Cancel"; both contain a link with an accessible name of "Settings"; both have a `combobox` labelled "Country". These are the human-visible affordances of the page, and they generalise across sessions in a way that per-account IDs never will. So the observer computes a semantic locator (role plus accessible name) using the same conventions Playwright's own `getByRole` uses, and *verifies uniqueness on the leader* before emitting it. Only if role+name isn't unique does it fall through to a ladder of decreasingly-desirable fallbacks:

1. **`getByRole(role, { name })`**: the preferred output. User intent, generalises across sessions.
2. **A unique attribute**: `id`, then any `data-*`, then `name`/`title`/`aria-*`, filtered by a heuristic that rejects hex blobs, pure numeric sequences, and values containing whitespace (whitespace usually means "content", not "identity").
3. **Role + name even if non-unique**: the dispatcher's `.first()` picks one; fine for list pages.
4. **`getByPlaceholder` / `getByText`**: visible-text fallbacks.
5. **Structural CSS path**: last resort, will probably fail, but at least it fails loudly.

Notably there is no allowlist of "known good" attributes. `data-testid` is not special-cased over `data-hook`, `data-automation-id`, `data-cy`, or `data-anything-else`; any custom data attribute that uniquely and stably identifies the element is fair game. The stability heuristic filters out obviously-per-session values regardless of which attribute they hang off, so the observer picks up whatever conventions the site under test already uses.

# How Playwright Mirror Works

![Architecture diagram](/images/blogs/playwright-mirror/diagram.svg)

With those two rules pinned down (*mirror causes, not effects; describe intent, not implementation*), the actual runtime is small. There are three moving parts.

**An in-page observer.** [`observer.js`](https://github.com/Saiid2001/playwright-mirror/blob/main/src/observer.js) is added to the leader's browser context as an [`addInitScript`](https://playwright.dev/docs/api/class-browsercontext#browser-context-add-init-script), so every leader frame (including new tabs and post-navigation reloads) gets it before any page script runs. It attaches capture-phase listeners for the five event kinds above, and on each one computes a locator, packages `{type, locator, url, ts}` as JSON, and calls `window.__pw_mirror__(payload)`. That binding is created on the Node side with [`context.exposeBinding`](https://playwright.dev/docs/api/class-browsercontext#browser-context-expose-binding), which gives us a zero-config, in-process bridge from the page into Node with no websocket, no broker, and no fork.

**A serial Node dispatch queue.** Every payload received on the binding is pushed onto a `queue: Item[]` and drained by a single `pump()` coroutine. Keeping this serial is deliberate: real user interactions are strictly ordered, and interleaving two mirrored actions would let the follower observe states the leader never went through (e.g., a "fill" landing before its preceding "click"). For each item, the pump resolves the locator on the follower page via `resolveLocator(page, spec)`, which just routes the `LocatorSpec` kind to `page.getByRole`, `page.getByPlaceholder`, `page.getByText`, or `page.locator`, then dispatches with `.first().click()`, `.fill()`, `.selectOption()`, or `.press()`. Per-follower failures are non-fatal; if one follower's DOM has drifted, the queue keeps flowing for the others.

**Host-based tab pairing.** The trickiest piece was multi-tab. Sites open popups, share sheets, and OAuth windows constantly, and popup blockers behave subtly differently across sessions. Pairing leader tab N to follower tab N by index seemed obvious at first, but a single divergence (one follower suppressing a popup the leader allowed) mis-aligns every subsequent tab. So each follower keeps a `Map<leaderPage, followerPage>` and a queue of unpaired follower pages, and pairing happens on `framenavigated`: as soon as a leader page's host matches an unpaired follower page's host, they're bound. `twitter.com` pairs with `twitter.com` regardless of open order; stray leader tabs whose host never matches anything on the follower stay unpaired, and events targeted at them are silently dropped with a diagnostic. The initial leader tab and each follower's initial tab are seeded into the map before anything else, so the common single-tab case just works.

Two smaller pieces round it out. First, browser-chrome shortcuts. The URL bar and the back/forward/refresh buttons never fire DOM events, so the observer can't see them. Instead it hooks `Alt+Shift+←/→/R` in the page itself and forwards a `command` action, which the dispatcher applies to the leader *and* every follower in parallel via `page.goBack()`, `page.goForward()`, and `page.reload()`. It's a small hack, but it's the only reliable in-page signal, and it makes the leader visibly the driver rather than a special client. Second, shutdown wiring: the leader browser's `disconnected` event, the leader context's `close`, and the closing of the last leader tab all funnel into a single idempotent `shutdown()` that tears down every follower before the leader. Close the leader window and everything cleans up on its own.

![Playwright Mirror Example](/images/blogs/playwright-mirror/playwright-mirror-example.png)

# Open problems

A few known gaps:

- **Lists of identical elements.** Every "Add to cart" button on an inventory page has the same role and name, so the ladder falls through to a per-session attribute that will not resolve on the follower. Needs a positional, parent-scoped rung.
- **File uploads.** The observer sees `change` on `<input type="file">`, but there is no wiring yet to ship the bytes to `page.setInputFiles` on each follower.
- **Native `<select>` popup in CI.** Real humans work; the self-test cannot, because Playwright's `.selectOption()` fires an untrusted `change`.
- **URL-bar typing.** Never touches the DOM, and mirroring it would leak per-account URLs. Probably unfixable by design.
- **Locator diagnostics.** Follower failures are silently swallowed to keep the queue flowing. A structured `onActionFailed` hook, or a leader/follower resolved-element diff, would make debugging much less painful.

If any of this looks interesting, [the repo](https://github.com/Saiid2001/playwright-mirror) is open and PRs are very welcome. The two design rules (*mirror causes, not effects*; *describe intent, not implementation*) are constraints to work within, so contributions that extend the ladder or the observer while keeping them intact are the ones most likely to land quickly.
